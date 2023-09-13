const User = require("../models/userModel");

exports.getAllStudents = async (req, res) => {
  try {
    const users = await User.find({ active: true, role: "student" });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.body.id,
      role: { $nin: ["admin", "professor"] },
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
      role: "student",
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateStudentName = async (req, res) => {
  try {
    if (!req.body || !req.body.id) {
      throw new Error("You have to give an ID no");
    }
    const user = await User.findOneAndUpdate(
      {
        id: req.body.id,
        role: "student",
      },
      {
        name: req.body.name,
      }
    );
    if (!user) {
      throw new Error("User does not exist");
      next();
    }
    const updatedUser = await User.findOne({
      id: req.body.id,
    });

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

exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({
      id: req.body.id,
      role: { $nin: ["admin", "professor"] },
    });
    res.status(204).json({
      status: "success",
      message: "Data deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
