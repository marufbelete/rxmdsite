
exports.authAdmin = (req, res, next) => {
  const userrole=req.user.role;
  if (userrole==="admin") {
    next()
    return;
    }
  return res.status(403).
  json({message:"you do not have privillage",status:false})

};

exports.authCustomer = (req, res, next) => {
  const userrole=req.user.role;
  if (userrole==="customer") {
    next()
    return;
      }
  return res.status(403).
  json({message:"you do not have privillage",status:false})
};
