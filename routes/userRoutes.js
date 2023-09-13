const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.post("/deleteMe", authController.protect, authController.deleteMe);
router.post("/updateMe", authController.protect, authController.updateMe);
router
  .route("/student")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    studentController.getAllStudents
  );

router
  .route("/student/studentGet")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    studentController.getStudent
  );
router
  .route("/student/studentDelete")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    studentController.deleteStudent
  );

router
  .route("/student/studentCreate")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    studentController.createStudent
  );
router
  .route("/student/studentUpdate")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    studentController.updateStudentName
  );

module.exports = router;
