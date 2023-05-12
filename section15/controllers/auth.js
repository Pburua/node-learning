const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");
const { SENDGRID_API_KEY, FROM_EMAIL } = require("../env");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY,
  }
}));

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Signup error: User already exists");
        res.redirect("/signup");
        throw "Signup error: User already exists.";
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: FROM_EMAIL,
        subject: 'Signup succeeded!',
        html: '<h1>You have successfully signed up</h1>'
      });
    })
    .then(() => {
      console.log('Signup email was sent successfully.')
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let curUser;

  User.findOne({ email })
    .then((user) => {
      if (!user) throw "Login error: Incorrect email.";

      curUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isPasswordValid) => {
      if (!isPasswordValid) throw "Login error: Incorrect password.";

      req.session.user = curUser;
      req.session.isAuthenticated = true;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.error(err);
      req.flash("error", "Login error: Invalid email or password.");
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
