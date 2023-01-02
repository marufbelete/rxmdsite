exports.authAdmin = (req, res, next) => {
  let {role} = req.user
  if (role === "admin") {
    next();
    return;
  }

  return res
    .status(403)
    .json({ message: "you do not have admin priviledge", status: false });
};

exports.authUser = (req, res, next) => {
  const {role} = req.user;
  if (role === "user") {
    next();
    return;
  }
  return res
    .status(403)
    .json({ message: "you do not have priviledge", status: false });
};
