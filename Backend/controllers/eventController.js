import cloudinary from "../config/cloudinary.js";
import Event from "../models/eventModel.js";
import PendingEventsModel from "../models/pendingEventModel.js";
import { generateEmbedding } from "../utils/embedding.js";
import getDataUri from "../config/dataUri.js";

export const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) {
      return res.status(404).json({
        message: "No events to display",
        status: true,
      });
    }

    return res.status(200).json({
      message: "All event fetch successfully",
      status: true,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const createEvent = async (req, res) => {
  console.log("API hit successfully");
  try {
    const {
      title,
      description,
      location,
      locationLink,
      category,
      startDate,
      endDate,
      ticketPrice,
      startTime,
      endTime,
    } = req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      !category?.trim() ||
      !startDate ||
      !endDate ||
      !ticketPrice?.trim() ||
      !startTime?.trim() ||
      !endTime?.trim() ||
      !locationLink?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required ",
        success: false,
      });
    }
    console.log("receive all fields  successfully");

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "end Date should be greater then start date ",
        status: false,
      });
    }
    console.log(" date receive  successfully");

    // 🔹 3. Time Fix (IMPORTANT)

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (startDateTime >= endDateTime) {
      return res.status(400).json({
        message: "start time can not be equal or before end time ",
        status: false,
      });
    }

    console.log("Image  uploding");

    // 🔹 4. Upload Image (Cloudinary)
    let image = "";
    let public_id = "";

    if (req.file) {
//   


        const fileUri = getDataUri(req.file);

const result = await cloudinary.uploader.upload(fileUri, {
  folder: "eventsModules",
});
       
    
       console.log("break point 3 ");

      
      image = result.secure_url;
      public_id = result.public_id;
    }
    console.log("generating embading");
    let embedding = [];
    try {
      const textToEmbed = `${title} ${description} ${location}`;
      embedding = await generateEmbedding(textToEmbed);
    } catch (err) {
      console.warn("⚠️ Embedding failed");
    }
    console.log("enbeading generated sucessfull");

    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      locationLink: locationLink.trim(),
      category: category.trim(),
      startDate: startDateTime,
      endDate: endDateTime,
      ticketPrice,
      image,
      public_id,
      embedding,
    });
    console.log("Event save  successfully");
    return res.status(201).json({
      message: "event created successfully ",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getSingleId = async (req, res) => {
  try {
    const Eventid = req.params.id;

    const event = await Event.findById(Eventid);

    if (!event) {
      return res.status(400).json({
        message: "Event not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Event fatch successfull",
      status: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const deleteEvent = async (req, res) => {
  
  try {
    console.log("API hit successfully");
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({
        message: "event not found",
        status: false,
      });
    }
    console.log("Event found");
    await cloudinary.uploader.destroy(event.image);
    console.log("image");
    //  await Event.deleteOne(eventId);
    await event.deleteOne();
    console.log("event deleted ");
    return res.status(200).json({
      message: "Event deleted successfully ",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error in deleting the event",
      status: false,
    });
  }
};
