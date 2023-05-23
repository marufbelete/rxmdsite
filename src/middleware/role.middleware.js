

exports.authAdmin = (req, res, next) => {
  let {role} = req.user
  if (role === "admin") {
    next();
    return;
  }
  return res.redirect('/');
  // return res
  //   .status(403)
  //   .json({ message: "you do not have admin priviledge", status: false });
};

exports.authUser = (req, res, next) => {
  const {role} = req.user;
  if (role === "user") {
    next();
    return;
  }
  return res.redirect('/');
  // return res
  //   .status(403)
  //   .json({ message: "you do not have priviledge", status: false });
};



// exports.checkAppoint = async(req, res, next) => {
//   try{
//     console.log(req.user)
//   const {sub} = req?.user;
//   const user = await User.findByPk(sub);
//   if (user.left_appointment) {
//     next();
//     return
//   }
//   return res.redirect("/checkout");
      
// }
// catch(err){
//   next(err)
//  }
// };
