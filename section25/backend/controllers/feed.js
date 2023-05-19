const { validationResult } = require("express-validator");

const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "Undertale post",
        content: "Hello! I am Flowey the flower!",
        imageUrl: "images/Signature1.png",
        creator: {
          name: "Flowey",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Validation error.",
        errors: errors.array(),
      });
  }

  res.status(201).json({
    message: "Post created successfully",
    post: {
      _id: new Date().getTime(),
      title,
      content,
      imageUrl: "images/Signature1.png",
      creator: {
        name: "Flowey",
      },
      createdAt: new Date(),
    },
  });
};

const feedController = {
  getPosts,
  createPost,
};

module.exports = feedController;
