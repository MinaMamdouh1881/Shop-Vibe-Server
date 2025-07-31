import nodemailer from 'nodemailer';

export default async function sendEmail({
  to,
  content,
  subject,
}: {
  to: string;
  content: string;
  subject: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.log('Error sending email:', error);
  }
}
