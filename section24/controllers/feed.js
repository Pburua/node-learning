const getPosts = (req, res, next) => {
    res.send('hello flowey!')
};

const feedController = {
  getPosts,
};

module.exports = feedController;
