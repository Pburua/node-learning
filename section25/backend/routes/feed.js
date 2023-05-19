const express = require("express");

const feedController = require("../controllers/feed");
const {
  createPostValidation,
  updatePostValidation,
} = require("../middleware/validation/feed");

const feedRouter = express.Router();

feedRouter.get("/posts", feedController.getPosts);

feedRouter.get("/post/:postId", feedController.getPost);

feedRouter.post("/post", createPostValidation, feedController.createPost);

feedRouter.put(
  "/post/:postId",
  updatePostValidation,
  feedController.updatePost
);

feedRouter.delete("/post/:postId", feedController.deletePost);

module.exports = feedRouter;
