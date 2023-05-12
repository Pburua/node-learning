const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((user) => {
      if (user) {
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
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let curUser;

  User.findOne({ email })
    .then((user) => {
      if (!user) throw 'Login error: Incorrect email.';

      curUser = user;
      return bcrypt.compare(password, user.password)
    })
    .then((isPasswordValid) => {
      if (!isPasswordValid) throw 'Login error: Incorrect password.';

      req.session.user = curUser;
      req.session.isAuthenticated = true;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/login');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
