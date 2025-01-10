const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER
});


// const createList = async () => {
//   const response = await client.lists.({
//     name: "TestrxMD_Newsletter",
//     permission_reminder: "permission_reminder",
//     email_type_option: true,
//     contact: {
//       company: "TestrxMD",
//       address1: "address1",
//       city: "city",
//       country: "country",
//     },
//     campaign_defaults: {
//       from_name: "from_name",
//       from_email: "Beulah_Ryan@hotmail.com",
//       subject: "subject",
//       language: "language",
//     },
//   });
// };

const mailchimpList = async (req,res,next) => {
    // const response = await client.lists.getAllLists();
    const response = await client.lists.getListMembersInfo(process.env.MAILCHIMP_LIST_ID);
    // const response = await client.campaigns.list();
    // const response = await client.lists.createList({
    //   name: "Test List",
    //   permission_reminder: "You are receiving this email because you opted in via our website",
    //   email_type_option: true,
    //   contact: {
    //     company: "TestRx MD",
    //     address1: "11700 W Charleston Blvd # 170-75",
    //     address2: "Las Vegas NV 89135-1573",
    //     city: "Las Vegas",
    //     state: "NV",
    //     zip: "891351573",
    //     country: "US",
    //     phone: "8122966499"
    //   },
    //   campaign_defaults: {
    //     from_name: "Test",
    //     from_email: "info@testrxmd.com",
    //     subject: "Test Integration",
    //     language: "en"
    //   },
    // });
    console.log(response);
    return res.json(response)
  };

const mailchimpAddmemberToList = async (email,firstName,lastName) => {
  if(!email)return
  try{
    const response = await client.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName,
      },
      status: "subscribed",
      
    });
    return response;
  }
  catch (err) {
    return
  }
    
  };

const mailchimpCreateCampaign = async (req,res,next) => {
//   const response = await client.campaigns.update(process.env.MAILCHIMP_CAMPAIGN_ID,
//   {
//     settings: {
//     subject_line: "Test Announcement",
//     title: "Test Campaign",
//     from_name: "Maruf Test",
//     reply_to: "info@testrxmd.com"
//  }
// });

const response = await client.campaigns.setContent(process.env.MAILCHIMP_CAMPAIGN_ID, {
  html: `
    <html>
      <body>
        <h1>Welcome to the Newsletter!</h1>
        <p>This is a test announcement.</p>
      </body>
    </html>
  `,
  plain_text: "Welcome to the Newsletter! This is a test announcement."
});


  // const response = await client.campaigns.create({ type: "regular",recipients:
  //   {
  //   list_id:process.env.MAILCHIMP_LIST_ID
  //   },
  //   settings: {
  //   subject_line: "Test Announcement",
  //   title: "Test Campaign",
  //   from_name: "Maruf Test",
  //   reply_to: "info@testrxmd.com"
  // } });
  res.json(response);
};

const sendMailchimpCampaign = async (req,res,next) => {
  const response = await client.campaigns.send(process.env.MAILCHIMP_CAMPAIGN_ID);
  console.log(response);
  res.json(response);
};


module.exports ={
  mailchimpAddmemberToList,
  mailchimpCreateCampaign,
  mailchimpList,
  sendMailchimpCampaign
}
