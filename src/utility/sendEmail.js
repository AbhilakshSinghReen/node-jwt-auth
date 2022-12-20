const nodemailer = require("nodemailer");

// Initialize nodemailer transporter
// Transporter config is in .env file
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send email, returns info returned by transporter
async function sendEmail(sendTo, subject, text) {
  console.log("-------------------------");
  console.log("New Email");
  console.log("from: ", process.env.EMAIL_ID);
  console.log("to: ", sendTo);
  console.log("subject: ", subject);
  console.log(text);
  console.log("-------------------------");
  return { ok: true };

  // const sendEmailInfo = await transporter.sendMail({
  //   from: process.env.EMAIL_ID, // email is sent from the Email Id configured in .env file
  //   to: sendTo,
  //   subject: subject,
  //   text: text,
  // });

  // return sendEmailInfo;
}

module.exports = sendEmail;
