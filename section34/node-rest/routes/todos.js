const express = require("express");

const todoRouter = express.Router();

const todos = [];

todoRouter.get("/", (req, res, next) => {
  res.status(200).json({ todos });
});

todoRouter.post("/todo", (req, res, next) => {
  const reqBody = req.body;
  const newTodo = {
    id: new Date().getTime().toString(),
    text: reqBody.text,
  };
  todos.push(newTodo);
  res
    .status(200)
    .json({ todo: newTodo, message: "Todo was created successfully!" });
});

todoRouter.put("/todo/:todoId", (req, res, next) => {
  const reqBody = req.body;
  const reqParams = req.params;
  const todoId = reqParams.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    res.status(404).json({ message: "Todo not found!" });
    return;
  }
  todos[todoIndex] = { ...todos[todoIndex], text: reqBody.text };
  res.status(200).json({ message: "Todo was updated successfully!" });
});

todoRouter.delete("/todo/:todoId", (req, res, next) => {
  const reqParams = req.params;
  const todoId = reqParams.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    res.status(404).json({ message: "Todo not found!" });
    return;
  }
  todos.splice(todoIndex, 1);
  res.status(200).json({ message: "Todo was deleted successfully!" });
});

module.exports = todoRouter;
