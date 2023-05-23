const express = require("express");

const feedController = require("../controllers/feed");
const {
  createPostValidation,
  updatePostValidation,
} = require("../middleware/validation/feed");
const isAuth = require("../middleware/is-auth");

const feedRouter = express.Router();

feedRouter.get("/posts", isAuth, feedController.getPosts);

feedRouter.get("/post/:postId", isAuth, feedController.getPost);

feedRouter.post(
  "/post",
  isAuth,
  createPostValidation,
  feedController.createPost
);

feedRouter.put(
  "/post/:postId",
  isAuth,
  updatePostValidation,
  feedController.updatePost
);

feedRouter.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = feedRouter;
