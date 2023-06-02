const express = require("express");

const todoRouter = require("./routes/todos");

// CONFIG

const app = express();

// MIDDLEWARE

app.use(express.json());

app.use(todoRouter);

// STARTUP

app.listen(8080, () => {
  console.log("Server listening at port 8080!");
});
