const express = require("express");

const feedController = require("../controllers/feed");
const { createPostValidation } = require("../middleware/validation/feed");

const feedRouter = express.Router();

feedRouter.get("/posts", feedController.getPosts);

feedRouter.get("/post/:postId", feedController.getPost);

feedRouter.post("/post", createPostValidation, feedController.createPost);

module.exports = feedRouter;
