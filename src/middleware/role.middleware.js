
exports.authAdmin = (req, res, next) => {
  const userrole=req.user.role;
  if (userrole==="admin") {
    next()
    return;
    }
  json({message:"you do not have admin privillage",status:false})
  return res.status(403)
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
