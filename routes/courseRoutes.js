const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const fileController = require("../controllers/fileController");
const courseController = require("../controllers/courseController");
router
  .route("/course/:courseCode/files")
  .post(
    authController.protect,
    authController.restrictTo("professor"),
    fileController.uploadedFiles,
    fileController.addFile
  )
  .patch(
    authController.protect,
    authController.restrictTo("professor"),
    fileController.uploadedFiles,
    fileController.deleteFile
  );

router
  .route("/create")
  .post(
    authController.protect,
    authController.restrictTo("professor"),
    courseController.createCourse
  );
router
  .route("/delete")
  .post(
    authController.protect,
    authController.restrictTo("professor"),
    courseController.deleteCourse
  );
router
  .route("/course/:courseCode")
  .post(
    authController.protect,
    authController.restrictTo("professor"),
    courseController.addStudent
  )
  .patch(
    authController.protect,
    authController.restrictTo("professor"),
    courseController.deleteStudent
  );
router
  .route("/course/:courseCode/register")
  .post(
    authController.protect,
    authController.restrictTo("student"),
    courseController.registerStudent
  )
  .patch(
    authController.protect,
    authController.restrictTo("student"),
    courseController.deregisterStudent
  );

router
  .route("/course/:courseCode/comments")
  .post(
    authController.protect,
    authController.restrictTo("student"),
    courseController.studentCommentsAdd
  )
  .patch(
    authController.protect,
    authController.restrictTo("student"),
    courseController.studentCommentsDelete
  );
router
  .route("/course/:courseCode/profComments")
  .patch(
    authController.protect,
    authController.restrictTo("student"),
    courseController.profCommentsDelete
  );

module.exports = router;
