const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//Function for creating a JWT token

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    const token = signToken(newUser._id);
    // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    if (!email || !password) {
      throw new Error("No email or password");
    }
    // Check if user exists and password is correct

    const user = await User.findOne({
      id,
      email,
      active: { $ne: false },
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Unauthorised: Incorrect email or password or id");
    }
    //3 If everything is okay send it to client
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1 Getting token and checking if it exists
    let token;
    //req.headers is what is sent along with the req
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token);
    if (!token) {
      throw new Error("You are not logged in! Please login to get access!!!");
    }
    // 2 Verification
    //Getting the payload as we gave id in it in the signtoken
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3 Check if user exists(user deleted in between or changes his password after token has been released)
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new Error("User belonging to this token does not exist");
    }

    //GRANT access to protected route
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        message: "No access for this role",
      });
    }
    next();
  };
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findOneAndUpdate({ id: req.user.id }, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "err.message",
    });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        id: req.user.id,
        role: req.user.role,
      },
      {
        name: req.body.name,
      }
    );

    if (!user) {
      throw new Error("User does not exist");
      next();
    }
    const updatedUser = await User.findOne({ id: req.user.id });
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  //1 Get USer Based on Posted Email
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      throw new Error("No user with that email adress");
    }
    //2 Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Token sent",
      token: user.passwordResetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //1 Get user based on token
    const hashedToken = req.params.token;
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // console.log(user);
    //2 Set new Password
    if (!user) {
      throw new error("Token is invalid or expired");
    }
    if (!req.body.password || !req.body.passwordConfirm) {
      throw new Error("Give both password and password reset token");
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password updated",
    });
    //3 Update changedPasswordAt
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};
