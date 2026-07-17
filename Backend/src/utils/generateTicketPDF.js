// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import QRCode from "qrcode";

// export const generateTicketPDF = async(ticket, user, event) => {
//     console.log("ticket generate hit");
//   if (!fs.existsSync("tickets")) {
//     fs.mkdirSync("tickets");
//   }

//   const filePath = path.join("tickets", `ticket-${ticket._id}.pdf`);

//   const doc = new PDFDocument({
//     size: "A4",
//     margin: 40,
//   });

//   doc.pipe(fs.createWriteStream(filePath));

//   // Header Background
//   doc.rect(0, 0, 595, 100).fill("#2563EB");

//   doc
//     .fillColor("white")
//     .fontSize(28)
//     .text("EVENT TICKET", 0, 30, {
//       align: "center",
//     });

//   doc
//     .fontSize(14)
//     .text("Event Management Platform", {
//       align: "center",
//     });

//   doc.moveDown(4);

//   // Reset color
//   doc.fillColor("black");

//   // Ticket Box
//   doc.roundedRect(30, 120, 535, 620, 10).stroke("#2563EB");

//   let y = 140;

//   // User Section
//   doc
//     .fillColor("#2563EB")
//     .fontSize(18)
//     .text("BOOKING DETAILS", 50, y);

//   y += 30;

//   doc.fillColor("black").fontSize(12);

//   doc.text(`Ticket ID`, 50, y);
//   doc.text(ticket._id.toString(), 180, y);

//   y += 22;

//   doc.text("Name", 50, y);
//   doc.text(user.name, 180, y);

//   y += 22;

//   doc.text("Email", 50, y);
//   doc.text(user.email, 180, y);

//   // Divider
//   y += 35;
//   doc.moveTo(50, y).lineTo(545, y).stroke("#cccccc");

//   // Event
//   y += 20;

//   doc.fillColor("#2563EB").fontSize(18).text("EVENT", 50, y);

//   y += 30;

//   doc.fillColor("black").fontSize(12);

//   doc.text("Title", 50, y);
//   doc.text(event.title, 180, y);

//   y += 22;

//   doc.text("Location", 50, y);
//   doc.text(event.location, 180, y);

//   y += 22;

//   doc.text("Start", 50, y);
//   doc.text(
//     new Date(event.startDate).toLocaleString(),
//     180,
//     y
//   );

//   y += 22;

//   doc.text("End", 50, y);
//   doc.text(
//     new Date(event.endDate).toLocaleString(),
//     180,
//     y
//   );

//   y += 35;

//   doc.moveTo(50, y).lineTo(545, y).stroke("#cccccc");

//   // Price
//   y += 20;

//   doc.fillColor("#2563EB").fontSize(18).text("PAYMENT", 50, y);

//   y += 30;

//   doc.fillColor("black").fontSize(12);

//   doc.text("Quantity", 50, y);
//   doc.text(ticket.quantity.toString(), 180, y);

//   y += 22;

//   doc.text("Price", 50, y);
//   doc.text(`₹${ticket.ticketPrice}`, 180, y);

//   y += 22;

//   doc.font("Helvetica-Bold");
//   doc.text("Total", 50, y);
//   doc.text(`₹${ticket.totalPrice}`, 180, y);

//   doc.font("Helvetica");

//   y += 40;

//   // Attendees
//   doc.fillColor("#2563EB").fontSize(18).text("ATTENDEES", 50, y);

//   y += 30;

//   ticket.people.forEach((person, index) => {
//     doc.fillColor("black").fontSize(12);

//     doc.text(`${index + 1}. ${person.name}`, 60, y);

//     doc.text(person.gender, 300, y);

//     doc.text(`${person.age} yrs`, 430, y);

//     y += 22;
//   });

//   // Footer
//   doc.rect(0, 780, 595, 60).fill("#2563EB");

//   doc
//     .fillColor("white")
//     .fontSize(14)
//     .text(
//       "Thank you for booking with us. Enjoy your event! ",
//       0,
//       800,
//       {
//         align: "center",
//       }
//     );

//     // Celebration Section

// doc.moveDown();

// doc.fillColor("#2563EB")
// .fontSize(18)
// .text(
//   " EVENT BOOKING CONFIRMED ",
//   {
//     align:"center"
//   }
// );

// doc.moveDown();

// doc.fillColor("black")
// .fontSize(14)
// .text(
// `
// Congratulations 

// Your ticket has been successfully booked.

//  PDF Ticket Attached


//  Enjoy The Event

// Create memories, have fun and celebrate!


// Thank you for choosing us 
// `,
// {
// align:"center"
// }
// );




// doc.moveDown();


//   doc.end();
// {console.log("Ticket generated successfully");}
//   return filePath;
// };



import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export const generateTicketPDF = async (ticket, user, event) => {
  console.log("Ticket generation initiated...");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    // Capture the PDF stream into an in-memory buffer array
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      console.log("Ticket buffer generated successfully.");
      resolve(pdfBuffer);
    });
    doc.on("error", (err) => {
      reject(err);
    });

    // Header Background
    doc.rect(0, 0, 595, 100).fill("#2563EB");

    doc
      .fillColor("white")
      .fontSize(28)
      .text("EVENT TICKET", 0, 30, {
        align: "center",
      });

    doc
      .fontSize(14)
      .text("Event Management Platform", {
        align: "center",
      });

    doc.moveDown(4);

    // Reset color
    doc.fillColor("black");

    // Ticket Box
    doc.roundedRect(30, 120, 535, 620, 10).stroke("#2563EB");

    let y = 140;

    // User Section
    doc
      .fillColor("#2563EB")
      .fontSize(18)
      .text("BOOKING DETAILS", 50, y);

    y += 30;

    doc.fillColor("black").fontSize(12);

    doc.text(`Ticket ID`, 50, y);
    doc.text(ticket._id.toString(), 180, y);

    y += 22;

    doc.text("Name", 50, y);
    doc.text(user.name, 180, y);

    y += 22;

    doc.text("Email", 50, y);
    doc.text(user.email, 180, y);

    // Divider
    y += 35;
    doc.moveTo(50, y).lineTo(545, y).stroke("#cccccc");

    // Event
    y += 20;

    doc.fillColor("#2563EB").fontSize(18).text("EVENT", 50, y);

    y += 30;

    doc.fillColor("black").fontSize(12);

    doc.text("Title", 50, y);
    doc.text(event.title, 180, y);

    y += 22;

    doc.text("Location", 50, y);
    doc.text(event.location, 180, y);

    y += 22;

    doc.text("Start", 50, y);
    doc.text(
      new Date(event.startDate).toLocaleString(),
      180,
      y
    );

    y += 22;

    doc.text("End", 50, y);
    doc.text(
      new Date(event.endDate).toLocaleString(),
      180,
      y
    );

    y += 35;

    doc.moveTo(50, y).lineTo(545, y).stroke("#cccccc");

    // Price
    y += 20;

    doc.fillColor("#2563EB").fontSize(18).text("PAYMENT", 50, y);

    y += 30;

    doc.fillColor("black").fontSize(12);

    doc.text("Quantity", 50, y);
    doc.text(ticket.quantity.toString(), 180, y);

    y += 22;

    doc.text("Price", 50, y);
    doc.text(`₹${ticket.ticketPrice}`, 180, y);

    y += 22;

    doc.font("Helvetica-Bold");
    doc.text("Total", 50, y);
    doc.text(`₹${ticket.totalPrice}`, 180, y);

    doc.font("Helvetica");

    y += 40;

    // Attendees
    doc.fillColor("#2563EB").fontSize(18).text("ATTENDEES", 50, y);

    y += 30;

    ticket.people.forEach((person, index) => {
      doc.fillColor("black").fontSize(12);

      doc.text(`${index + 1}. ${person.name}`, 60, y);

      doc.text(person.gender, 300, y);

      doc.text(`${person.age} yrs`, 430, y);

      y += 22;
    });

    // Footer
    doc.rect(0, 780, 595, 60).fill("#2563EB");

    doc
      .fillColor("white")
      .fontSize(14)
      .text(
        "Thank you for booking with us. Enjoy your event! ",
        0,
        800,
        {
          align: "center",
        }
      );

    // Celebration Section
    doc.moveDown();

    doc.fillColor("#2563EB")
      .fontSize(18)
      .text(
        " EVENT BOOKING CONFIRMED ",
        {
          align: "center"
        }
      );

    doc.moveDown();

    doc.fillColor("black")
      .fontSize(14)
      .text(
        `
Congratulations 

Your ticket has been successfully booked.

PDF Ticket Attached


Enjoy The Event

Create memories, have fun and celebrate!


Thank you for choosing us 
`,
        {
          align: "center"
        }
      );

    doc.moveDown();

    // Finalize the PDF stream
    doc.end();
  });
};