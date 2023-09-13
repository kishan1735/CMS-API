const Course = require("../models/courseModel");
const User = require("../models/userModel");
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      courseName: req.body.courseName,
      courseCode: req.body.courseCode,
    });

    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    if (!req.body.courseName && !req.body.courseCode) {
      throw new Error("Give Course Name or Code");
    }
    const course = await Course.findOneAndRemove({
      $or: [
        { courseName: req.body.courseName },
        { courseCode: req.body.courseCode },
      ],
    });
    if (!course) {
      throw new Error("Course does not exist");
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const student = await User.findOne({ id: req.body.id, role: "student" });
    if (!student) {
      throw new Error("Student not found");
    }
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    if (check?.studentIds?.find((el) => el.id === req.body.id)) {
      throw new Error("Student already exists");
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $push: {
          studentIds: {
            id: student.id,
            name: student.name,
            email: student.email,
          },
        },
      }
    );

    if (!course) {
      throw new Error("Course doesn't exist");
    }
    const updatedCourse = await Course.findOne({
      courseCode: req.params.courseCode,
    });
    res.status(200).json({
      status: "success",
      data: {
        student: student,
        course: updatedCourse,
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
    const student = await User.findOne({ id: req.body.id, role: "student" });
    // console.log(student);
    if (!student) {
      throw new Error("Student not found");
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $pull: {
          studentIds: {
            id: student.id,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    if (req.user.id !== req.body.id) {
      throw new Error("Not You");
    }
    const student = await User.findOne({ id: req.user.id, role: "student" });
    if (!student) {
      throw new Error("Student not found");
    }
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    console.log(check.studentIds.find((el) => el.id === req.user.id));
    if (check.studentIds.find((el) => el.id === req.user.id)) {
      throw new Error("U have already registered to this course");
    }

    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $push: {
          studentIds: {
            id: student.id,
            name: student.name,
            email: student.email,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }
    const updatedCourse = await Course.findOne({
      courseCode: req.params.courseCode,
    });
    res.status(200).json({
      status: "success",
      data: {
        student: student,
        course: updatedCourse,
      },
    });
    res.status(201).json({
      status: "success",
      data: {
        student: student,
        course: updatedCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deregisterStudent = async (req, res) => {
  try {
    if (req.user.id !== req.body.id) {
      throw new Error("Not You");
    }

    const student = await User.findOne({ id: req.user.id, role: "student" });
    // console.log(student);
    if (!student) {
      throw new Error("Student not found");
    }
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    if (!check.studentIds.find((el) => el.id === req.user.id)) {
      throw new Error("U have not registered to this course");
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $pull: {
          studentIds: {
            id: student.id,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }
    await course.save();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.studentCommentsAdd = async (req, res) => {
  try {
    const student = await User.findOne({ id: req.user.id, role: "student" });
    if (!student) {
      throw new Error("Student not found");
    }
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    if (!check.studentIds.find((el) => el.id === req.user.id)) {
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $push: {
          comments: {
            id: req.user.id,
            name: req.user.name,
            comment: req.body.comment,
            time: Date.now(),
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }
    if (!req.body.comment) {
      throw new Error("No comment detected");
    }
    const updatedCourse = await Course.findOne({
      courseCode: req.params.courseCode,
    });
    res.status(200).json({
      status: "success",
      data: {
        course: updatedCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.studentCommentsDelete = async (req, res) => {
  try {
    const student = await User.findOne({ id: req.user.id, role: "student" });
    if (!student) {
      throw new Error("Student not found");
    }
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    if (!check.studentIds.find((el) => el.id === req.user.id)) {
      throw new Error("Student not found");
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $pull: {
          comments: {
            id: req.user.id,
            time: req.body.time,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.profCommentsDelete = async (req, res) => {
  try {
    const check = await Course.findOne({ courseCode: req.params.courseCode });
    if (!check.studentIds.find((el) => el.id === req.body.id)) {
      throw new Error("Student not found");
    }
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $pull: {
          comments: {
            id: req.body.id,
            time: req.body.time,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course doesn't exist");
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
