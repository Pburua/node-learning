const path = require('path');

const getLoginPage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};

const getWelcomePage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'views', 'welcome.html'));
};

const handleSuccessCallback = (req, res, next) => {
  console.log('Google login was successful.');
  console.log('req.body.g_csrf_token', req.body.g_csrf_token);
  console.log('req.body.credential', req.body.credential);
  res.status(302).redirect('/welcome');
};

const authController = {
  getLoginPage,
  getWelcomePage,
  handleSuccessCallback
};

module.exports = authController;
