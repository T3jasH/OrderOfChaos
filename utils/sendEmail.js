const fetch = require('node-fetch');

const sendEmail = async (resp,toEmail,name,resetUrl) => {
    try {
        await fetch(
                resp,
             {
                 method: 'POST',
                 headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                     Authorization: process.env.AUTHHEADER,
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
