const express = require("express");

const feedRouter = require("./routes/feed");

// Configuration

const app = express();

// Middleware

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Contol-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/feed", feedRouter);

// Startup

app.listen(8080, () => {
  console.log(`Server listening on port ${8080}`);
});
