
exports.authAdmin = (req, res, next) => {
  const userrole = req.user.role;
  if (userrole === "admin") {
    next()
    return;
  }

  return res.status(403).
  json({ message: "you do not have admin priviledge", status: false })
};

exports.authUser = (req, res, next) => {
  const userrole = req.user.role;
  if (userrole === "user") {
    next()
    return;
  }
  return res.status(403).
    json({ message: "you do not have priviledge", status: false })
};
