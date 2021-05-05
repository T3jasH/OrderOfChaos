// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.API_KEY);

const sendEmail = async (to, text, subject) => {
    try {
        const message = {
            to,
            from: {
                name: process.env.FROM_NAME_NEW,
                email: process.env.FROM_EMAIL_NEW,
            },
            subject,
            text,
        };
        await sgMail.send(message);
    } catch (err) {
        console.log(err.message);
    }

    // const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth : {
    //         user: process.env.SMTP_EMAIL,
    //         pass: process.env.SMTP_PASSWORD,
    //     },
    // });

    // const message = {
    //     from : `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message,
    // };

    // const info = await transporter.sendMail(message);

    // console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
