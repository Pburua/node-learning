const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");
const fileHelper = require("../util/file-helper");
const socketHelper = require("../util/socket-helper");

const getPosts = async (req, res, next) => {
  const curPage = req.query.page || 1;
  const itemsPerPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((curPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json({ posts, totalItems });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const newError = new Error("Not found.");
      newError.statusCode = 404;
      throw newError;
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
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

  try {
    await newPost.save();

    const creator = await User.findById(req.userId);

    creator.posts.push(newPost);

    await creator.save();

    socketHelper.getIO().emit("posts", {
      action: "create",
      post: {
        ...newPost._doc,
        creator: { _id: req.userId, name: creator.name },
      },
    });

    res.status(200).json({
      message: "Post created successfully",
      post: newPost,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const newError = new Error("Not found.");
      newError.statusCode = 404;
      throw newError;
    }

    if (post.creator._id.toString() !== req.userId) {
      const newError = new Error("Not authorized.");
      newError.statusCode = 403;
      throw newError;
    }

    if (imageUrl !== post.imageUrl)
      fileHelper.deleteFile(path.join(__dirname, "..", post.imageUrl));

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();

    socketHelper.getIO().emit("posts", {
      action: "update",
      post: result,
    });

    res.status(200).json({
      message: "Post updated successfully",
      post: result,
    });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

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

    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);

    user.posts.pull(postId);

    await user.save();

    socketHelper.getIO().emit("posts", {
      action: "delete",
      postId,
    });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const newError = new Error("Not found.");
      newError.statusCode = 404;
      throw newError;
    }
    res.status(200).json({
      status: user.status,
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = new Error("Validation error.");
    newError.statusCode = 422;
    newError.data = errors.array();
    throw newError;
  }

  const status = req.body.status;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const newError = new Error("Not found.");
      newError.statusCode = 404;
      throw newError;
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      message: "Status was updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

const feedController = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getStatus,
  updateStatus,
};

module.exports = feedController;
