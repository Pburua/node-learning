const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");
const { JWT_SECRET } = require("../env");
const fileHelper = require("../util/file-helper");

const graphqlResolver = {
  createUser: async ({ userInput }, req) => {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;

    const errors = [];
    if (!validator.isEmail(email))
      errors.push({
        message: "Email is invalid.",
      });
    if (validator.isEmpty(password))
      errors.push({
        message: "Password is invalid.",
      });
    if (validator.isEmpty(name))
      errors.push({
        message: "Name is invalid.",
      });

    if (errors.length > 0) {
      const newError = new Error("Invalid input");
      newError.data = errors;
      newError.statusCode = 422;
      throw newError;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const newError = new Error("User already exists.");
      newError.statusCode = 422;
      throw newError;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ email, name, password: hashedPassword });

    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      const newError = new Error("User not found.");
      newError.statusCode = 422;
      throw newError;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      const newError = new Error("Password is incorrect.");
      newError.statusCode = 422;
      throw newError;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { token, userId: user._id.toString() };
  },

  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    const title = postInput.title;
    const content = postInput.content;
    const imageUrl = postInput.imageUrl;

    const errors = [];

    if (validator.isEmpty(title))
      errors.push({
        message: "Title is invalid.",
      });
    if (validator.isEmpty(content))
      errors.push({
        message: "Content is invalid.",
      });
    if (validator.isEmpty(imageUrl))
      errors.push({
        message: "Image url is invalid.",
      });

    if (errors.length > 0) {
      const newError = new Error("Invalid input");
      newError.data = errors;
      newError.statusCode = 422;
      throw newError;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    const newPost = new Post({ title, content, imageUrl, creator: user });

    const createdPost = await newPost.save();

    user.posts.push(createdPost);

    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toString(),
      updatedAt: createdPost.updatedAt.toString(),
    };
  },

  getPosts: async ({ page }, req) => {
    if (!req.isAuth) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    if (!page) page = 1;

    const perPage = 2;

    const totalPosts = await Post.find().countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toString(),
          updatedAt: post.updatedAt.toString(),
        };
      }),
      totalPosts,
    };
  },

  getPost: async ({ postId }, req) => {
    if (!req.isAuth) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const newError = new Error("Post not found.");
      newError.statusCode = 404;
      throw newError;
    }

    return {
      post: {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toString(),
        updatedAt: post.updatedAt.toString(),
      },
    };
  },

  updatePost: async ({ id, postInput }, req) => {
    if (!req.isAuth) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const newError = new Error("Post not found.");
      newError.statusCode = 404;
      throw newError;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const newError = new Error("Not authorized.");
      newError.statusCode = 403;
      throw newError;
    }

    const errors = [];

    if (validator.isEmpty(postInput.title))
      errors.push({
        message: "Title is invalid.",
      });
    if (validator.isEmpty(postInput.content))
      errors.push({
        message: "Content is invalid.",
      });
    if (
      validator.isEmpty(postInput.imageUrl) &&
      postInput.imageUrl !== "undefined"
    )
      errors.push({
        message: "Image url is invalid.",
      });

    if (errors.length > 0) {
      const newError = new Error("Invalid input");
      newError.data = errors;
      newError.statusCode = 422;
      throw newError;
    }

    post.title = postInput.title;
    post.content = postInput.content;

    if (postInput.imageUrl !== "undefined") post.imageUrl = postInput.imageUrl;

    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toString(),
      updatedAt: updatedPost.updatedAt.toString(),
    };
  },

  deletePost: async ({ id }, req) => {
    if (!req.isAuth) {
      const newError = new Error("Not authenticated.");
      newError.statusCode = 401;
      throw newError;
    }

    const post = await Post.findById(id);

    if (!post) {
      const newError = new Error("Post not found.");
      newError.statusCode = 404;
      throw newError;
    }

    if (post.creator.toString() !== req.userId.toString()) {
      const newError = new Error("Not authorized.");
      newError.statusCode = 403;
      throw newError;
    }

    const user = await User.findById(post.creator.toString());

    if (!user) {
      const newError = new Error("Post creator not found.");
      newError.statusCode = 404;
      throw newError;
    }

    await Post.findByIdAndRemove(id);

    user.posts.pull(id);

    await user.save();

    await fileHelper.deleteImage(post.imageUrl);

    return true;
  },
};

module.exports = graphqlResolver;
