const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const noteRoute = require("./routes/noteRoute");
const cookieParser = require("cookie-parser");

var cors = require("cors");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected");
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRoute);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Running on ${port}...`);
});
