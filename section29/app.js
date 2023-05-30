const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const setUser = require("./middleware/set-user");
const errorHandler = require("./middleware/error-handler");
const setRenderLocals = require("./middleware/set-render-locals");

// Configuration

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  )
    return cb(null, true);
  cb(null, false);
};

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);

app.use(flash());

app.use(setRenderLocals);

app.use(setUser);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use(errorHandler);

// Setting up mongodb and listening

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongdoDB connection established.");
    app.listen(process.env.PORT, () => {
      console.log(`Server listening at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
