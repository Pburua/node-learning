const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "Undertale post", content: "hello im flowey the flower" }],
  });
};

const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created successfully",
    post: {
      id: new Date().getTime(),
      title,
      content,
    },
  });
};

const feedController = {
  getPosts,
  createPost,
};

module.exports = feedController;
