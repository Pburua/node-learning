const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("../env");
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/callback",
      scope: ["profile"],
    },
    async function verify(issuer, profile, cb) {
      try {
        console.log("Verifying...");

        if (issuer != "https://accounts.google.com")
          throw new Error("Invalid issuer.");

        let user = await User.findOne({ googleID: profile.id });

        if (!user) {
          user = new User({
            googleID: profile.id,
            name: profile.displayName,
          });

          await user.save();

          console.log("User created in db.");
        } else {
          console.log("User found in db.");
        }

        return cb(null, user);
      } catch (err) {
        console.error(err);
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, { id: user.id, name: user.name });
});

passport.deserializeUser((user, cb) => {
  User.findById(user.id)
    .then((user) => {
      return cb(null, user);
    })
    .catch((err) => {
      console.error(err);
    });
});
