import nodemailer from "nodemailer";

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use your SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mockly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, // ✅ send styled HTML
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
  }
};

export default sendEmail;
