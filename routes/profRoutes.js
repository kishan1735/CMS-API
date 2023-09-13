const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const profController = require("../controllers/profController");

router
  .route("/prof/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    profController.getAllProfessors
  );

router
  .route("/prof/professorGet")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    profController.getProfessor
  );
router
  .route("/prof/professorDelete")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    profController.deleteProfessor
  );

router
  .route("/prof/professorCreate")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    profController.createProfessor
  );
router
  .route("/prof/professorUpdate")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    profController.updateProfessorName
  );

module.exports = router;
