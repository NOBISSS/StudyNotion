import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});
export async function sendMail(
  email: string,
  subject: string,
  html: string,
) {
  try {
    let mailOptions = {
      from: "secondbrain.services <noreply>",
      to: email,
      subject: subject,
      html: html,
    };
    let info = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong while generating otp");
  }
}
