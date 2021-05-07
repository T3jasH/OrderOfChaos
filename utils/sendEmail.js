// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const fetch = require('node-fetch');


sgMail.setApiKey(process.env.API_KEY);

// const sendEmail = async (to, text, subject) => {
//     try {
//         const message = {
//             to,
//             from: {
//                 name: process.env.FROM_NAME_NEW,
//                 email: process.env.FROM_EMAIL_NEW,
//             },
//             subject,
//             text,
//         };
//         await sgMail.send(message);
//     } catch (err) {
//         console.log(err.message);
//     }
// };

const sendEmail = async (resp,toEmail,name,resetUrl) => {
    try {
        await fetch(
                resp,
             {
                 method: 'POST',
                 headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                     Authorization: 'code-event!@$',
                 },
                 body: JSON.stringify({
                     toEmail: toEmail,
                     name: name,
                     link: resetUrl,
                 }),
             }   
        );
    } catch(err) {
        console.log(err);
    }
}

module.exports = sendEmail;
