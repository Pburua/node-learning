const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../env");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/callback/success",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

const getLoginPage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "..", "views", "index.html"));
};

const getWelcomePage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "..", "views", "welcome.html"));
};

const login = (req, res, next) => {
  console.log("Google login was statrted.");
  passport.authenticate("google", { scope: ["profile"] });
};

const handleSuccessCallback = (req, res, next) => {
  
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    function (req, res) {
      console.log("Google login was successful.");
      res.status(302).redirect("/welcome");
    }
  );
};

const authController = {
  getLoginPage,
  getWelcomePage,
  handleSuccessCallback,
  login,
};

module.exports = authController;
