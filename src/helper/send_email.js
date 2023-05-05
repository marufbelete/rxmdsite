const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
const filePath = path.join(__dirname,"..","..",'public', 'images','testrxmd.gif');

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
    debug:true,
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
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #007bff;">One-Time Password</h1>
          <p style="text-align: center;">Please use the following OTP to verify your action:</p>
          <div style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; text-align: center;">
              <h2 style="font-size: 24px; margin-bottom: 20px;">${Otp}</h2>
          </div>
          <p style="text-align: center; margin-top: 20px;">This OTP will expire in 3 minutes.</p>
          </div>
          <div style="text-align:center;padding-bottom:30px">
          <img src="cid:unique@kreata.ae"/>
          </div>
          </div>
        `,
        attachments: [{
          filename: 'testrxmd.gif',
          path: filePath,
          cid: 'unique@kreata.ae' //same cid value as in the html img src
        }]
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
    attachments: [{
      filename: 'testrxmd.gif',
      path: filePath,
      cid: 'unique@kreata.ae' //same cid value as in the html img src
    }]
        };
        await sendEmail(mailOptions)
}
const sendAffiliatePaidEmail=async(email,name,amount)=>{
  const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Withdrawl Success",
          html: `
          <div style="margin: auto; max-width: 650px; background-color: #C2E7FF; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); min-height: 400px;">
          <h1 style="text-align: center; color: #2791BD; font-size: 36px; margin-bottom: 20px; padding: 10px 20px;">TestRxMD Payment Succeeded</h1>
          <p style="text-align: center; font-size: 20px; line-height: 1.5; margin-bottom: 20px;">Hello ${name},</p>
          <p style="text-align: start; padding: 10px 20px; font-size: 20px; line-height: 1.5;">You have successfully withdrawn ${amount.value} ${amount.currency} to your PayPal account. Thank you for working with us!</p>
          <div style="text-align: center; padding-bottom: 30px;">
              <img src="cid:unique@kreata.ae" alt="Withdrawal Success" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />
          </div>
      </div>
        `,
        attachments: [{
          filename: 'testrxmd.gif',
          path: filePath,
          cid: 'unique@kreata.ae' //same cid value as in the html img src
        }]

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


