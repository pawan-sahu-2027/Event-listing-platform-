import Event from "../models/eventModel.js";
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import { generateTicketPDF } from "../utils/generateTicketPDF.js";
import { sendTicketMailer } from "../utils/sendTicketMailer.js";

export const bookFreeTicket = async (req, res) => {
  try {
    const { eventId, quantity, people } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    if (event.ticketPrice > 0) {
      return res.status(400).json({
        status: false,
        message: "This is not a free event.",
      });
    }

    const available =
      event.maxUsers - event.totalTicketsSold;

    if (quantity > available) {
      return res.status(400).json({
        status: false,
        message: "Not enough seats available.",
      });
    }

    const ticket = await Ticket.create({
      userId: req.user._id,
      eventId,
      people,
      quantity,
      ticketPrice: 0,
      totalPrice: 0,
    });

    event.totalTicketsSold += quantity;

    await event.save();
 try {
  await sendTicketEmail(ticket._id);
} catch (err) {
  console.error(err);
}
    
  

    return res.status(201).json({
      status: true,
      message: "Ticket booked successfully.",
      ticket,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};



export const sendTicketEmail = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("userId")
    .populate("eventId");

  if (!ticket) {
    throw new Error("Ticket not found");
  }
     
  const pdfPath = await generateTicketPDF(
    ticket,
    ticket.userId,
    ticket.eventId
  );

  console.log("PDF PATH:", pdfPath);

  await sendTicketMailer(
    ticket.userId.email,
    pdfPath
  );
};