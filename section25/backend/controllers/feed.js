const { validationResult } = require("express-validator");

const Post = require("../models/post");

const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      next(err);
    });
};

const getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const newError = new Error("Not found.");
        newError.statusCode = 404;
        throw newError;
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      next(err);
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

  if (!req.file) {
    const newError = new Error("No image provided.");
    newError.statusCode = 422;
    throw newError;
  }

  const imageUrl = req.file.path.replace("\\" ,"/");

  const newPost = new Post({
    title,
    content,
    imageUrl,
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
  getPost,
  createPost,
};

module.exports = feedController;
