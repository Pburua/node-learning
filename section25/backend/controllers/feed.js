const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");
const fileHelper = require("../util/file-helper");

const getPosts = (req, res, next) => {
  const curPage = req.query.page || 1;
  const itemsPerPage = 2;

  let totalItems;

  Post.find()
    .countDocuments()
    .then((postCount) => {
      totalItems = postCount;
      return Post.find()
        .skip((curPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then((posts) => {
      res.status(200).json({ posts, totalItems });
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

  const imageUrl = req.file.path.replace("\\", "/");

  const newPost = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });

  let creator;

  newPost
    .save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(newPost);
      return user.save();
    })
    .then(() => {
      res.status(200).json({
        message: "Post created successfully",
        post: newPost,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      next(err);
    });
};

const updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = new Error("Validation error.");
    newError.statusCode = 422;
    throw newError;
  }

  if (req.file) imageUrl = req.file.path.replace("\\", "/");

  if (!imageUrl) {
    const newError = new Error("No image provided.");
    newError.statusCode = 422;
    throw newError;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const newError = new Error("Not found.");
        newError.statusCode = 404;
        throw newError;
      }

      if (post.creator.toString() !== req.userId) {
        const newError = new Error("Not authorized.");
        newError.statusCode = 403;
        throw newError;
      }

      if (imageUrl !== post.imageUrl)
        fileHelper.deleteFile(path.join(__dirname, "..", post.imageUrl));

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated successfully",
        post: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const newError = new Error("Not found.");
        newError.statusCode = 404;
        throw newError;
      }

      if (post.creator.toString() !== req.userId) {
        const newError = new Error("Not authorized.");
        newError.statusCode = 403;
        throw newError;
      }

      fileHelper.deleteFile(path.join(__dirname, "..", post.imageUrl));
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      res.status(200).json({
        message: "Post deleted successfully",
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
  updatePost,
  deletePost,
};

module.exports = feedController;
