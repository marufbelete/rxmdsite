const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const sendEmail = async (mailOptions) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.MAIL_CLIENT_ID,
    process.env.MAIL_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.MAIL_REFRESH_TOKEN,
  });
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  await transporter.sendMail(mailOptions);
  return true;
};
const sendOtpEmail=async(Otp,email)=>{
  const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "TestRxMD 2-FA verification",
          html: `
          <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
          <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
          TestRxMD 2-FA Confirmation
          </h1>
          <p style="text-align:start;padding:10px 20px;">
          Your 2FA OTP code.
         <span>${Otp.token}</span>
          </p>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.ae"/>
          </div>
          </div>
        `,
        };
        await sendEmail(mailOptions)
}

const sendTutonaEmail = async () => {
// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: 'smtp.tutanota.com',
//     port: 587,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         user: 'marufbelete@tutanota.com',
//         pass: 'Maruf3839!'
//     }
// });
let transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  secure: true,
  port: 465,
  auth: {
    user: "marufbelete@zohomail.in",
    pass: "9Z8k7w9ktLie"  
  },
  // connectionTimeout: 5 * 60 * 1000,
  // greetingTimeout: 5 * 60 * 1000,
  // socketTimeout: 5 * 60 * 1000
})
// setup email data with encrypted password
let mailOptions = {
    from: 'marufbelete@zohomail.in',
    to: 'marufbelete9@gmail.com',
    subject: 'Test email',
    text: 'Hello world!',
};

// send mail with encrypted password
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
}

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendTutonaEmail
};
