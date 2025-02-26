const dynamicPage = require("../models/dynamicPageModel");

exports.editPageInfo = async (req, res, next) => {
  try {
    const existing_page= await dynamicPage.findOne()
    // console.log()
    const new_patient_info = await dynamicPage.update({
    ...req.body
    },{where:{id:existing_page.id}});
    console.log(req.body)

    return res.json(new_patient_info);
  } catch (err) {
    next(err);
  }
};

