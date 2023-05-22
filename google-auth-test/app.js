const express = require("express");

const authRouter = require("./routes/auth");

// Configuration

const app = express();

// Middleware

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(authRouter);

// Startup

app.listen(8080, () => {
  console.log(`Server listening on port ${8080}`);
});
