const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  file: {
    type: String,

    // type: Array[String],
    default: [],
  },
  fileName: {
    type: String,
    default: [],
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
