const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);

    console.log(token);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
    next();
  } catch (e) {
    console.log(e);
  }
};
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      throw new Error("invalid user name or password!!!");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect password or username");
    }
    const token = signToken(user._id);
    res.cookie("dov", token, {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      // httpOnly: true,
      // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (e) {
    console.log(e);
  }
};
// exports.authorization = (req, res, next) => {
//   const token = req.cookies.uid;
//   if (!token) {
//     return res.sendStatus(403);
//   }
//   try {
//     const data = jwt.verify(token);
//     req.user._id = data._id;
//     return next();
//   } catch {
//     return res.sendStatus(403);
//   }
// };
exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies?.dov;
    console.log(req.cookies);
    console.log(token);
    // if (token) {
    //   return jwt.verify(token, process.env.JWT_SECRET);
    //   // token = req.headers.authorization.split(" ")[1];
    // }
    if (!token) {
      return next("You are not logged in!!");
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
      return next("User does not exist");
    }
    req.user = currentUser;
  } catch (e) {
    console.log(e);
  }
  next();
};
