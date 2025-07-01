import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // استخدم 465 مع `secure: true` أو 587 مع `secure: false`
    secure: true, // استخدم true إذا كنت تستخدم المنفذ 465
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false, // تجاوز بعض مشاكل الـ SSL
    },
  });

  const info = await transporter.sendMail({
    from: `'sarahah app' <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.rejected.length == 0 ? true : false;
};
export const subject = {
  register: "Activate account",
  resetPass: "Reset password",
};
