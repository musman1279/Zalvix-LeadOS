import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
        "EMAIL_PASSWORD length:",
        process.env.EMAIL_PASSWORD?.length
    );

    console.log("Checking Gmail SMTP...");

    await transporter.verify();

    console.log("Gmail SMTP authentication successful!");

    await transporter.sendMail({
        from: `"Zalvix LeadOS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
    });
};

export default sendEmail;