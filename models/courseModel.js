const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, "Please provide a course name"],
    unique: true,
  },
  courseCode: {
    type: String,
    required: [true, "Please provide a course code"],
    unique: true,
    uppercase: true,
  },
  contents: {
    type: Array,
    default: [],
  },
  studentIds: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
  formattedDate: {
    type: Number,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
