const { validationResult } = require("express-validator");

const Post = require("../models/post");

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
    const newError = new Error("Validation error.");
    newError.statusCode = 422;
    throw newError;
  }

  const newPost = new Post({
    title,
    content,
    imageUrl: "images/Signature1.png",
    creator: {
      name: "Flowey",
    },
  });

  newPost
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const feedController = {
  getPosts,
  createPost,
};

module.exports = feedController;
