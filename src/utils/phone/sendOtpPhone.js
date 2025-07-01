import dotenv from "dotenv";
import twilio from "twilio";
import { EventEmitter } from "events";

// تحميل متغيرات البيئة
dotenv.config();

export const phoneEmitter = new EventEmitter();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendOtpPhone = async (phone, otp, userName) => {
    try {
        if (!phone || !otp) {
            throw new Error("Missing required parameters: phone or otp");
        }

        console.log(`📤 Sending OTP to ${phone}...`); // ✅ طباعة للتأكد

        const message = await client.messages.create({
            body: `${userName}, your OTP code is: ${otp}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER, // ✅ بدون `${}`
        });

        console.log(`✅ OTP sent successfully to ${phone}: ${message.sid}`);
        return message;
    } catch (error) {
        console.error(`❌ Failed to send OTP to ${phone}:`, error);
        throw new Error("Failed to send OTP. Please try again later.");
    }
};

phoneEmitter.on("sendPhone", async (phone, otp, userName) => {
    try {
        const message = await sendOtpPhone(phone, otp, userName);

        if (message) {
            console.log(`✅ OTP sent successfully to ${phone}: ${message.sid}`);
        } else {
            console.log(`⚠️ Failed to send OTP to ${phone}.`);
        }
    } catch (error) {
        console.error(`❌ Unexpected error while sending OTP to ${phone}:`, error.message);
    }
});
