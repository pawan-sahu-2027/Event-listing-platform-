import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigiration = {
    from: process.env.MAIL_USER,
    to: email,

    subject: "Email Verification",

    text: `Hi! There , you are recent visited
    our and enter your email, 
    please verify your email using this link to verify your email
    http://localhost:5173/verify/${token} Thanks`,
  };

  transporter.sendMail(mailConfigiration, function (error, info) {
    if (error) throw error;
    console.log("Email sent successfully");
    console.log(info);
  });
};
