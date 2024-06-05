var userController = require("../controllers/users_controller");
var { sqldb } = require("../models/dbconfig");
var { sendMail } = require("../core/core");
var { generate } = require("otp-generator");
const moment = require('moment');

let forgotPassword = async (email) => {
  try {
    let user = await userController.getUserByEmail(email);
    if (!user.status) {
      return { status: false, message: "Email is not registered.", data: {} };
    } else {
      user = JSON.parse(JSON.stringify(user.data));

      const otp = generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });

      await sqldb.users.update(
        { password_otp: otp, last_password_otp_at: new Date() },
        {
          where: { user_id: user.user_id },
        }
      );

      await sendMail({
        email: user.email,
        subject: `Reset your password`,
        text: ``,
        html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset password</title>
            <style>
              /* Add your custom styles here */
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 20px;
              }
              .content {
                text-align: left;
              }
              .button {
                display: inline-block;
                padding: 10px 20px !important;
                margin-top: 20px !important;
                background-color: rgb(253, 51, 126);
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo" style="text-align:center;">
                <h2>Reset your password</h2>
              </div>
              <div class="content">
                <div>Dear ${user.first_name.replace(
                  user.first_name.slice(0, 1),
                  user.first_name.slice(0, 1).toLocaleUpperCase()
                )},</div><br>
                <div>To Reset your password, please use the following One-Time Password (OTP):</div><br>
                <div style="font-size: large; font-weight: 800;">${otp}</div><br>
                <div>This OTP is valid for the next 5 minutes. For your security, please do not share this code with anyone.<br>
                If you did not request this verification, please ignore this email or contact our support team immediately.</div><br>
                <div>If you have any questions or need assistance, please feel free to reach out to our support team at <a href='mailto:support@prox-e.io'>reward@yopmail.com</a></div><br>
                <div>Best Regards,<br>The ReWard Team</div>
              </div>
            </div>
          </body>
          </html>`,
      });
      return {
        status: true,
        message: "OTP has been sent on this email",
        data: user,
      };
    }
  } catch (error) {
    return { status: false, message: error.message, data: {} };
  }
};

let verifyOTP = async (email, otp) => {
  try {
    let user = await userController.getUserByEmail(email);
    if (!user.status) {
      return { status: false, message: "Email is not registered.", data: {} };
    } else {
      user = JSON.parse(JSON.stringify(user.data));

      if (user.password_otp === otp) {
        const OTPGenerationTime = moment(user.last_password_otp_at);
        const cuurentTime = moment(new Date());
        const duration = moment.duration(cuurentTime.diff(OTPGenerationTime));
        const minutes = duration.minutes();
        if (minutes > 5) {
            return { status: false, message: "Your OTP is Expired. Please resend it.", data: {} };
        } else {
            return { status: true, message: "Your OTP is varified.", data: user };
        }
      } else {
        return { status: false, message: "Your OTP is incorrect.", data: {} };
      }
    }
  } catch (error) {
    return { status: false, message: error.message, data: {} };
  }
};

let resetPassword = async (email, password) => {
  try {
    let user = await userController.getUserByEmail(email);
    if (!user.status) {
      return { status: false, message: "Email is not registered.", data: {} };
    } else {
      user = JSON.parse(JSON.stringify(user.data));
      return await userController.updatePassword(user.user_id, password);
    }
  } catch (error) {
    return { status: false, message: error.message, data: {} };
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword
};
