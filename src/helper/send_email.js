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
         <span>${Otp}</span>
          </p>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.ae"/>
          </div>
          </div>
        `,
        };
        await sendEmail(mailOptions)
}

const sendLowRefillAlertEmail=async(email,name,medication)=>{
  const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Low Refill Alert",
          html: `
          <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
          <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
          "TestRxMD Low Refill Alert"
          </h1>
          <p>Hello ${name}</p>
          <p style="text-align:start;padding:10px 20px;">
              We hope this email finds you well. We wanted to remind you 
            that your prescription for ${medication} is due for a refill soon. 
            It is important to continue taking your medication as prescribed to ensure 
            the best possible health outcomes.
              Please contact your pharmacy to request a refill of your prescription.
            If you have any questions or concerns
          </p>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.ae"/>
          </div>
          </div>
        `,
        };
        await sendEmail(mailOptions)
}
const sendAffiliatePaidEmail=async(email,name,amount)=>{
  const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Withdrawl Success",
          html: `
          <div style="margin:auto; max-width:650px; background-color:#C2E7FF">
          <h1 style="text-align:center;color:#2791BD;padding:10px 20px;">
          "Payment Succeed"
          </h1>
          <p style="margin:auto; font-size:25px;">Hello ${name}</p>
          <p style="text-align:start;padding:10px 20px;">
            You have withdrwan ${amount.value} ${amount.currency}, successfully to your paypal account,
            thanks for working with us.
          </p>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.ae"/>
          </div>
          </div>
        `,
        };
        await sendEmail(mailOptions)
}

const sendZohoEmail = async () => {
let transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  secure: true,
  port: 465,
  auth: {
    user: "marufbelete@zohomail.in",
    pass: process.env.ZOHO_PASS  
  },

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
  sendZohoEmail,
  sendLowRefillAlertEmail,
  sendAffiliatePaidEmail
};
