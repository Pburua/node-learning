const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const feedRouter = require("./routes/feed");
const { MONGO_URL } = require("./env");
const errorHandler = require("./middleware/error-handler");
const multer = require("multer");
const authRouter = require("./routes/auth");
const socketHelper = require("./util/socket-helper");

// Configuration

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || "image/jpg" || "image/jpeg") {
    return cb(null, true);
  }
  cb(null, false);
};

// Middleware

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());

app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

// Startup

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Mongodb connection established.`);
    return new Promise((resolve, reject) => {
      const expressServer = app.listen(8080, () => {
        return resolve({ expressServer, port: 8080 });
      });
    });
  })
  .then(({ expressServer, port }) => {
    console.log(`Server listening on port ${port}`);

    const socketio = socketHelper.init(expressServer);
    socketio.on("connection", (socket) => {
      console.log("Socket client connected.");
    });
  })
  .catch((err) => {
    console.error(err);
  });
