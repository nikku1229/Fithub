import transporter from "../config/otp";
import { AppError } from "./errorHandler";

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const sendOtpEmail = async (
  email: string,
  otp: string,
  name: string,
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Forgot Password OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>You requested to reset your password. Please use the following OTP to verify your identity:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #f5f5f5; padding: 15px 30px; border-radius: 5px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
            ${otp}
          </div>
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">Best regards,<br>Your App Team</p>
      </div>
    `,
  };
  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    return {success:true};
  } catch (error) {
    throw new AppError("Failed to send OTP email", 500);
  }
};
