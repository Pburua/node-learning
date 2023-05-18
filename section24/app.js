const express = require("express");

const feedRouter = require("./routes/feed");

// Configuration

const app = express();

// Middleware

app.use(express.json());

app.use("/feed", feedRouter);

// Startup

app.listen(8080, () => {
  console.log(`Server listening on port ${8080}`);
});
