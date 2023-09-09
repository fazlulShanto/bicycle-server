import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

const sendOTP = async (name: string, email: string, otp: string) => {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Rad Hilfe',
      link: 'https://Rad-hilfe.com',
    },
  });

  const response = {
    body: {
      name: name,
      intro: 'Your OTP code is: ' + otp,
      code: otp,
    },
  };

  const emailBody = mailGenerator.generate(response);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to Rad Hilfe',
    html: emailBody,
  };

  await transporter.sendMail(message);
};

export { sendOTP };
