import { Router } from 'express';

import { Todo } from '../models/todo';

const todos: Todo[] = [];

const todoRouter = Router();

todoRouter.get('/', (req, res, next) => {
  res.status(200).json({ todos });
});

todoRouter.post('/todo', (req, res, next) => {
  const newTodo: Todo = {
    id: new Date().getTime().toString(),
    text: req.body.text,
  };
  todos.push(newTodo);
  res
    .status(200)
    .json({ todo: newTodo, message: 'Todo was created successfully!' });
});

todoRouter.put('/todo/:todoId', (req, res, next) => {
  const todoId = req.params.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    res.status(404).json({ message: 'Todo not found!' });
    return;
  }
  todos[todoIndex] = { ...todos[todoIndex], text: req.body.text };
  res.status(200).json({ message: 'Todo was updated successfully!' });
});

todoRouter.delete('/todo/:todoId', (req, res, next) => {
  const todoId = req.params.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    res.status(404).json({ message: 'Todo not found!' });
    return;
  }
  todos.splice(todoIndex, 1);
  res.status(200).json({ message: 'Todo was deleted successfully!' });
});

export default todoRouter;
