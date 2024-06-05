const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

let hashPassword = async (password) => {
  try {
      const saltRounds = parseInt(Math.random() * (20 - 1) + 1);
      let salt = await bcrypt.genSalt(saltRounds)
      let hash = await bcrypt.hash(password, salt);
      return { status: true, data: hash };
  } catch (error) {
    return { status: false, data: error };
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let sendMail = async (mailData) => {
  try {
    const data = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: mailData.email, // list of receivers
      subject: mailData.subject, // Subject line
      text: mailData.text, // plain text body
      html: mailData.html, // html body
    });
    return { status: true, message: 'Email sent successfully.', data: data }
  } catch (error) {
    return { status: false, data: error, message: error.message }
  }
};

module.exports = {
  hashPassword,
  sendMail
};
