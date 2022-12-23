const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bouncer = require("../helper/bruteprotect");
const {
  isEmailExist,
  issueToken,
  hashPassword,
  isEmailVerified,
  isPasswordCorrect,
  isTokenValid,
  issueLongtimeToken,
} = require("../helper/user");
const { handleError } = require("../helper/handleError");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../helper/send_email");

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { first_name, last_name, email, password } = req.body;
    const token = jwt.sign({ email: email }, process.env.SECRET);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "TestRxMD Account Confirmation Link",
      text: "Follow the link to confirm your email!",
      html: `${process.env.CONFIRM_LINK}?verifyToken=${token}`,
    };
    if (await isEmailExist(email)) {
      if (await isEmailVerified(email)) {
        handleError("User already exists with this email", 400);
      } else {
        await sendEmail(mailOptions);
        return res.redirect("/registered");
      }
    }
    const user_role = await Role.findOne({ where: { role: "user" } });
    const hashedPassword = await hashPassword(password);
    const user = new User({
      first_name,
      last_name,
      email,
      roleId: user_role.id,
      password: hashedPassword,
      isLocalAuth: true,
    });
    await user.save();
    await sendEmail(mailOptions);
    return res.redirect("/registered");
  } catch (err) {
    next(err);
  }
};

exports.registerUserWithRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { first_name, last_name, email, password } = req.body;
    const token = jwt.sign({ email: email }, process.env.SECRET);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "TestRxMD Account Confirmation Link",
      text: "Follow the link to confirm your email!",
      html: `${process.env.CONFIRM_LINK}?verifyToken=${token}`,
    };
    if (await isEmailExist(email)) {
      if (await isEmailVerified(email)) {
        handleError("User already exists with this email", 400);
      } else {
        await sendEmail(mailOptions);
        return res.json({
          message: "user registered, check the registered user email to verify",
        });
      }
      const adminRoleId = await Role.findOne({ where: { role: "admin" } });
      const hashedPassword = await hashPassword(password);
      const user = new User({
        first_name,
        last_name,
        email,
        roleId: adminRoleId,
        password: hashedPassword,
        isLocalAuth: true,
      });
      await user.save();
      await sendEmail(mailOptions);
      return res.redirect("/registered");
    }
  } catch (err) {
    next(err);
  }
};

// Login a user
exports.loginUser = async (req, res, next) => {
  // Check if email exists
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  try {
    const { login_email, login_password, rememberme } = req.body;
    const user = login_email && (await isEmailExist(login_email));
    if (user && user.isLocalAuth) {
      //if not validated send email
      if (!user.isEmailConfirmed) {
        const token = jwt.sign({ email: user.login_email }, process.env.SECRET);
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.login_email,
          subject: "Account Confirmation Link",
          text: "Follow the link to confirm your email for TestRxMD",
          html: `${process.env.CONFIRM_LINK}?verifyToken=${token}`,
        };
        await sendEmail(mailOptions);
        return res.json({
          message: "Please check your email for confirmation link",
        });
      }
      if (await isPasswordCorrect(login_password, user.password)) {
        const token = rememberme
          ? await issueLongtimeToken(
              user.id,
              user.role?.role,
              process.env.SECRET
            )
          : await issueToken(user.id, user.role.role, process.env.SECRET);
        const info = {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          email: user.email,
        };
        bouncer.reset(req);
        return res.json({ token: token, auth: true, user: info });
      }
      handleError("Username or Password Incorrect", 400);
    }
    handleError("Username or Password Incorrect", 400);
  } catch (err) {
    next(err);
  }
};
//get user
exports.getUsers = async (req, res, next) => {
  try {
    const { page, paginate } = req.query;
    const options = {
      include: ["role"],
      page: Number(page) || 1,
      paginate: Number(paginate) || 25,
      order: [["first_name", "DESC"]],
      // where: { name: { [Op.like]: `%elliot%` } }
    };
    const brands = await User.paginate(options);
    return res.json(brands);
  } catch (err) {
    next(err);
  }
};
//get user by id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { include: ["role"] });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};
// get current loged user
exports.getCurrentLogedUser = async (req, res, next) => {
  try {
    const id = req.user.sub;
    const user = await User.findByPk(id, { include: ["role"] });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};
//update user info
exports.updateUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.password) {
      delete req.body.password;
    }
    const updated_user = await User.update(
      { ...req.body },
      { where: { id: id } }
    );
    return res.json(updated_user);
  } catch (err) {
    next(err);
  }
};
//change password
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const id = req.user.sub;
    const user = await User.findByPk(id);
    if (!user) {
      handleError("user not found", 403);
    }
    const { old_password, new_password } = req.body;
    if (await isPasswordCorrect(old_password, user.password)) {
      const hashedPassword = await hashPassword(new_password);
      const updated_user = await User.update(
        { password: hashedPassword },
        { where: { id: id } }
      );
      return res.json(updated_user);
    }
    handleError("old password not correct", 403);
  } catch (err) {
    next(err);
  }
};
//forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = jwt.sign({ email: email }, process.env.SECRET, {
      expiresIn: "40m",
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account Confirmation Link",
      text: "Follow the link to confirm your email!",
      html: `${process.env.CONFIRM_LINK}?verifyToken=${token}`,
    };
    await sendEmail(mailOptions);
    return res.json({
      status: true,
      message: "email sent, please check your email.",
    });
  } catch (err) {
    next(err);
  }
};
//reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    const user = await isTokenValid(token);
    const hashedPassword = await hashPassword(password);
    await User.findByIdAndUpdate(
      { username: user.email },
      {
        password: hashedPassword,
      }
    );
    return res.redirect(`http://localhost:7000/login`);
  } catch (err) {
    next(err);
  }
};
//confirm email
exports.confirmEmail = async (req, res, next) => {
  try {
    const { verifyToken } = req.query;
    const user = await isTokenValid(verifyToken);
    if (user) {
      const userInfo = await User.findOne({ where: { email: user.email } });
      userInfo.isEmailConfirmed = true;
      await userInfo.save();
      return res.redirect("/");
    }
    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
