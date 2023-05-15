const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const { SENDGRID_API_KEY, FROM_EMAIL } = require("../env");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).render("auth/signup", {
      pageTitle: "Sign Up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    });

  bcrypt
    .hash(password, 12)
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
        subject: "Signup succeeded!",
        html: "<h1>You have successfully signed up</h1>",
      });
    })
    .then(() => {
      console.log("Signup email was sent successfully.");
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

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
    });

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
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/reset-password", {
    pageTitle: "Reset password",
    path: "/reset-password",
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) res.redirect("/reset-password");

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          res.redirect("/reset-password");
          throw "Reset Password Error: No account with that email found";
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then(() => {
        res.redirect("/reset-password");
        return transporter.sendMail({
          to: req.body.email,
          from: FROM_EMAIL,
          subject: "Password reset",
          html: `<h1>You requested a password reset:</h1>
            <a href="http://localhost:8080/new-password/${token}">
              Link for reset
            </a>`,
        });
      })
      .then(() => {
        console.log("Reset password email was sent successfully.");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const curToken = req.params.token;

  User.findOne({
    resetToken: curToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        res.redirect("/login");
        throw "New Password Error: User not found.";
      }

      let message = req.flash("error");
      message = message.length > 0 ? message[0] : null;

      res.render("auth/new-password", {
        pageTitle: "New password",
        path: "/new-password",
        errorMessage: message,
        passwordToken: curToken,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let curUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        res.redirect("/login");
        throw "New Password Error: User not found.";
      }

      curUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      curUser.password = hashedPassword;
      curUser.resetToken = undefined;
      curUser.resetTokenExpiration = undefined;
      return curUser.save();
    })
    .then(() => {
      console.log("Password was changed successfully.");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
