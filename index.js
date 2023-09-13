const express = require("express");
const userRouter = require("./routes/userRoutes");
const profRouter = require("./routes/profRoutes");
const courseRouter = require("./routes/courseRoutes");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

dotenv.config({ path: "./config.env" });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", profRouter);
app.use("/api/v1/courses", courseRouter);
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => console.log("Database Connected"));

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
