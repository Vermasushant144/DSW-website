const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

//For Sending Email to Register User
const sendEmail = async(reciver_email,subject,html)=>{
    var Transport = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });
    var mailOptions = {
        from: process.env.EMAIL, // sender address (who sends)
        to: reciver_email, // list of receivers (who receives)
        subject: subject, // Subject line
        html: html // html body
    };
    Transport.sendMail(mailOptions);
}

module.exports = sendEmail;