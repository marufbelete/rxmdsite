const nodemailer=require('nodemailer');
const { google} =require('googleapis');

const sendEmail=async(mailOptions)=>{
const oAuth2Client = new google.auth.OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token:process.env.MAIL_REFRESH_TOKEN });
const accessToken= await oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken:process.env.MAIL_REFRESH_TOKEN,
    accessToken:accessToken       
  }
});
await transporter.sendMail(mailOptions)
return true
}

module.exports={
    sendEmail
}