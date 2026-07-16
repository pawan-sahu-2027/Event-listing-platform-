import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
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

    subject: "Password reset OTP",

    html: `<p> your otp for password reset is:<b> ${otp}</b>.
     Please use this OTP to verify your email.<p> `,
    
  };

 
  try {
  await transporter.sendMail(mailConfigiration);
  console.log("OTP sent successfully");
} catch (error) {
  console.error("Email send failed:", error.message);
}
  
};


