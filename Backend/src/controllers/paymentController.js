import stripe from "../config/stripe.js";
import PendingEvent from "../models/pendingEventModel.js";
import Event from "../models/eventModel.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/dataUri.js";
import Advertisement from "../models/advertisementModel.js";
import Ticket from "../models/ticketModel.js";
import Payment from "../models/paymentModel.js";
import { generateEmbedding } from "../utils/embedding.js";
import { sendTicketEmail }from "./ticketController.js" 
export const createAdvertisementCheckout = async (req, res) => {  
  console.log("CreateAdvertisementsession ");
  try {
    const {
      title,
      description,
      location,
      locationLink,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketPrice,
      maxUsers,
      //   amount,
    } = req.body;
    const advertisementData = JSON.parse(req.body.advertisementData);
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    let amount = req.body;
    amount = Number(req.body.amount);

    let imageBuffer = null;

    if (req.file) {
      imageBuffer = req.file.buffer.toString("base64");
    }

    const adminId = req.id;
    console.log("before PendingEvent");
    console.log(PendingEvent.modelName);
console.log(PendingEvent.collection.name);

    const pending = await PendingEvent.create({
      adminId: req.id,

      eventData: {
        title,
        description,
        location,
        locationLink,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        ticketPrice,
        maxUsers,

        imageBuffer,
        imageMimeType: req.file?.mimetype || "",
      },

      advertisementData,
    });
    console.log("after PendingEvent");

console.log("before stripe");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: "Event Promotion",
            },

            unit_amount: amount * 100,
          },

          quantity: 1,
        },
      ],

      metadata: {
        pendingEventId: pending._id.toString(),
        type: "advertisement",
      },
      

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
       
      cancel_url: `${process.env.CLIENT_URL}/add-event?payment=cancelled`,
    });
       console.log("after stripe");

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 

export const stripeWebhook = async (req, res) => {
  console.log("========== WEBHOOK HIT ==========");
  const signature = req.headers["stripe-signature"];
  console.log("Signature:", signature);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Webhook verified");
    console.log("Event Type:", event.type);
console.log("Event Object:", event.data.object.object);

if (event.data.object.metadata) {
  console.log("Metadata:", event.data.object.metadata);
}
  } catch (err) {
    console.log("Webhook verification failed");
    console.log(err.message);
    console.log(err);

    return res.status(400).send(err.message);
  }

  if (event.type === "checkout.session.completed") {
    
    const session = event.data.object;
    const metadata = session.metadata;
    console.log("this is start data data ");
    if (metadata.type === "ticket") {
      console.log("this is ticket data ");
      await handleTicketPayment(session, metadata);
    }

    if (metadata.type === "advertisement") {
      console.log("this is advertisement data ");
      await handleAdPayment(session, metadata, event);
    }
  }
  ///////

  console.log("this is compleate  data ");
  res.status(200).send();
};

const handleAdPayment = async (session, metadata, event) => {
  console.log("Pending Id:", session.metadata.pendingEventId);

  const pending = await PendingEvent.findById(session.metadata.pendingEventId);

  console.log("Pending Event:", pending);

  if (!pending) {
    return res.sendStatus(404);
  }

  if (pending.paymentStatus === "paid") {
    return res.sendStatus(200);
  }

  const eventData = pending.eventData;

  const advertisementData = pending.advertisementData;

  let image = "";
  let public_id = "";
  console.log("Uploading image...");
  if (pending.eventData.imageBuffer) {
    const result = await cloudinary.uploader.upload(
      `data:${pending.eventData.imageMimeType};base64,${pending.eventData.imageBuffer}`,
      {
        folder: "events",
      },
    );

    image = result.secure_url;
    public_id = result.public_id;
  }
  console.log("Image uploaded");
  console.log("Creating Event...");

  //  creating embeading 

        let embedding = [];
      try {
        const textToEmbed = `${pending.eventData.title} ${pending.eventData.description} ${pending.eventData.location}`;
        embedding = await generateEmbedding(textToEmbed);
      } catch (err) {
        console.warn("⚠️ Embedding failed");
      }



      //////// end of embeading ////
  let createdEvent;
  try {
    createdEvent = await Event.create({
      title: pending.eventData.title,
      description: pending.eventData.description,
      location: pending.eventData.location,
      locationLink: pending.eventData.locationLink,
      category: pending.eventData.category,
      startDate: pending.eventData.startDate,
      endDate: pending.eventData.endDate,
      startTime: pending.eventData.startTime,
      endTime: pending.eventData.endTime,
      ticketPrice: pending.eventData.ticketPrice,
      maxUsers: pending.eventData.maxUsers,
      embedding,

      image,
      public_id,

      adminId: pending.adminId,

      isPromoted: true,
      promotionTypes: pending.advertisementData.promotionTypes,
      promotionAmount: pending.advertisementData.price,
    });
  } catch (err) {
    console.log("Event Create Error");
    console.log(err);
  }

  

  // console.log(`stripeWebhook2${createdEvent}` );
  console.log(createdEvent);
  await Advertisement.create({
    adminId: pending.adminId,
    eventId: createdEvent._id,

    planType: pending.advertisementData.planType,

    price: pending.advertisementData.price,

    startDate: new Date(),

    endDate: pending.advertisementData.endDate,
  });
  pending.paymentStatus = "paid";
  await pending.save();
};

///////////////////////////////// Ticket related payment ////////////////////////////////////////

export const createCheckoutSession = async (req, res) => {
  console.log("Api hit");

  try {
    const { eventId, quantity, people } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }
    // console.log(event);
      if (event){
        console.log("event created ");
      }
    const available = event.maxUsers - event.totalTicketsSold;

    if (quantity > available) {
      return res.status(400).json({
        status: false,
        message: "Seats not available",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: event.title,
            },

            unit_amount: event.ticketPrice * 100,
          },

          quantity,
        },
      ],

      success_url:  "https://www.event-booking.live/ticket-success",
      cancel_url: "https://www.event-booking.live/payment-failed",
      // `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      metadata: {
        eventId,
        type: "ticket",
        userId: req.user._id.toString(),
        quantity: quantity.toString(),
        people: JSON.stringify(people),
      },
    });
    console.log("1 reak pont ");
    res.json({
      status: true,
      url: session.url,
    });
    console.log("2 break pont ");
    console.log("Session ID:", session.id);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: false,
      message: err,
    });
  }
}; 
const handleTicketPayment = async (session, metadata) => {
  console.log("3 break pont ");
  try {
    console.log(metadata.eventId);
    const event = await Event.findById(metadata.eventId);

    if (!event) {
      throw new Error("Event not found");
    }
    console.log("4 break pont ");

    

    const quantity = Number(metadata.quantity);
    const ticketPrice = Number(event.ticketPrice);
    const people = JSON.parse(metadata.people);

    const payment = await Payment.create({
      userId: metadata.userId,
      eventId: metadata.eventId,

      amount: ticketPrice * quantity,

      paymentType: "ticket",

      status: "success",

      stripePaymentIntentId: session.payment_intent,

      stripeSessionId: session.id,
    });
    const ticket = await Ticket.create({
      userId: metadata.userId,
      eventId: metadata.eventId,
      quantity,
      ticketPrice,
      totalPrice: ticketPrice * quantity,
      // paymentId: session.payment_intent || session.id,
      paymentId: payment._id,
      people,
    });
    

    event.totalTicketsSold += quantity;
    event.totalRevenue += ticket.totalPrice;

    await event.save();
     try {
    await sendTicketEmail(ticket._id);
} catch (err) {
    console.error(err);
}
    return ticket;
  } catch (error) {
    console.error("Ticket Payment Error:", error);
    throw error;
  }
};
