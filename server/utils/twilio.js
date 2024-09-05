require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const emailUser = process.env.MAIL_USER;
const emailPass = process.env.MAIL_PASS;

exports.sendSms = ({ phone, message }) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: !phone ? process.env.TWILIO_PHONE_VERIFIED : phone
    })
    .then(message => console.log(message.sid));
}

exports.sendWhatsapp = ({ phone, message, attachs }) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      mediaUrl: attachs,
      body: message,
      from: 'whatsapp:+447488894793',
      // from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
      to: 'whatsapp:+447546254328'
      // to: !phone ? 'whatsapp:' + process.env.TWILIO_PHONE_VERIFIED : phone
    })
    .then(message => console.log(message.sid));
}

// exports.sendEmail = ({ to, html, subject, attachments }) => {
//   const nodemailer = require('nodemailer');

//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: gmailUser,
//       pass: gmailPass
//     },
//     timeout: 10000,
//   });

//   let mailOptions = {
//     from: process.env.SEND_EMAIL,
//     to: !to ? process.env.SEND_EMAIL : to,
//     subject,
//     html
//   };

//   if (attachments) {
//     mailOptions.attachments = attachments;
//   }

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       console.log('Error sending email');
//     } else {
//       console.log('Email sent: ');
//     }
//   });
// }

const getTemplateHtml = (data) => {
  const handlebars = require('handlebars');
  let htmlToSend;
  const fs = require('fs');
  if(data.type == 0) {
    const templateHtml = fs.readFileSync('media/login-email.html', 'utf8');
    const template = handlebars.compile(templateHtml);
    htmlToSend = template({ data });
  }
  else if(data.type == 1) {
    const templateHtml = fs.readFileSync('media/verify-email.html', 'utf8');
    const template = handlebars.compile(templateHtml);
    htmlToSend = template({ data });
  }
  else if(data.type == 2) {
    const templateHtml = fs.readFileSync('media/prescription-email.html', 'utf8');
    const template = handlebars.compile(templateHtml);
    htmlToSend = template({ data });
  }


  return htmlToSend;
}

exports.sendTemplateEmail = (data) => {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    secure: false,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 587,
    debug: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const emailBody = getTemplateHtml(data);

  let mailOptions = {
    from: process.env.SEND_EMAIL,
    to: data.to,
    subject: data.subject,
    html: emailBody
  };

  if (data.attachments) {
    mailOptions.attachments = data.attachments;
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent:');
    }
  });
}
