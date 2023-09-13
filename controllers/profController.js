const User = require("../models/userModel");

exports.getAllProfessors = async (req, res) => {
  try {
    const users = await User.find({ active: true, role: "professor" });

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

exports.getProfessor = async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.body.id,
      role: { $nin: ["admin", "student"] },
    });
    if (!user) {
      throw new Error("User not found");
    }

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

exports.createProfessor = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      id: req.body.id,
      role: "professor",
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

exports.updateProfessorName = async (req, res) => {
  try {
    if (!req.body || !req.body.id) {
      throw new Error("You have to give an id");
    }

    const user = await User.findOneAndUpdate(
      {
        id: req.body.id,
        role: "professor",
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
      role: "professor",
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

exports.deleteProfessor = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({
      id: req.body.id,
      role: { $nin: ["admin", "student"] },
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
