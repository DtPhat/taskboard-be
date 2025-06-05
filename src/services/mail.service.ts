import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config';

export async function sendVerificationCode(email: string, code: string) {
  const transporter = nodemailer.createTransport(EMAIL_CONFIG);
  try {
    await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: 'Verification Code',
      text: typeof code === 'string'
        ? `Your verification code is: ${code}`
        : code, // Allow sending a message directly
    });
  } catch (error) {
    console.log(error);
  }
}