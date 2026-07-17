// import nodemailer from "nodemailer";
// import path from "path";
// export const sendTicketMailer = async (email, pdfPath) => {

//   try {

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });


//     await transporter.verify();

//     console.log("SMTP server ready");


//     const info = await transporter.sendMail({

//       from: process.env.MAIL_USER,

//       to: email,

//       subject: "Your Event Ticket",

//       html: `
//         <h2>🎉 Ticket Booked Successfully</h2>

//         <p>Your event ticket is attached with this email.</p>

//         <p>Thank you for booking ❤️</p>
//       `,

      

//     //   attachments:[
//     //     {
//     //       filename:"Ticket.pdf",
//     //       path:pdfPath
//     //     }
//     //   ]

//     // });

//     attachments:[
//  {
//    filename:"Event-Ticket.pdf",
//    path:path.resolve(pdfPath)
//  }
// ]
//     });


//     console.log("Mail sent:", info.messageId);


//     if(fs.existsSync(pdfPath)){
//       fs.unlinkSync(pdfPath);
//     }


//   } catch(error){

//     console.log("MAIL ERROR:", error);

//   }

// };




import nodemailer from "nodemailer";

export const sendTicketMailer = async (email, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP server ready");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Event Ticket",
      html: `
        <h2>🎉 Ticket Booked Successfully</h2>
        <p>Your event ticket is attached with this email.</p>
        <p>Thank you for booking ❤️</p>
      `,
      attachments: [
        {
          filename: "Event-Ticket.pdf",
          content: pdfBuffer, // Pass the in-memory buffer directly
        }
      ]
    });

    console.log("Mail sent successfully! Message ID:", info.messageId);

  } catch (error) {
    console.log("MAIL ERROR:", error);
  }
};