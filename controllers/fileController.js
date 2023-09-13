const multer = require("multer");
const File = require("../models/fileModel");
const fs = require("fs");
const Course = require("../models/courseModel");
const fire = require("../firebase.config.js");

// const spaceRef = require("../firebase.config");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/courseFiles");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    console.log(ext);
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});
exports.uploadedFiles = upload.single("file");

exports.addFile = async (req, res) => {
  try {
    // console.log(req.file);
    const formattedDate = Date.now();
    const file = await File.create({
      file: req.file.path,
      fileName: req.file.filename,
    });
    // console.log(req.file.buffer);
    const buffer = fs.readFileSync(req.file.path);
    await fire.uploadFile(
      buffer,
      req.file.mimetype.split("/")[1],
      formattedDate
    );
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $push: {
          contents: {
            file: req.file.path,
            fileName: req.file.filename,
            formattedDate,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course not found");
    }

    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const path = await File.findOneAndRemove({ fileName: req.body.fileName });

    const check = await Course.findOne({ courseCode: req.params.courseCode });
    await fire.deleteFile(
      check.contents.find((el) => el.fileName === req.body.fileName)
        .formattedDate,
      "pdf"
    );
    const course = await Course.findOneAndUpdate(
      { courseCode: req.params.courseCode },
      {
        $pull: {
          contents: {
            fileName: req.body.fileName,
          },
        },
      }
    );
    if (!course) {
      throw new Error("Course not found");
    }
    const pathAct = check.contents.find(
      (el) => el.fileName === req.body.fileName
    ).file;
    fs.rmSync(pathAct);
    res.status(204).json({
      status: "success",
      message: "Deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
