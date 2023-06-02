import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

import { getTodoCollection } from "../helpers/db.ts";
import DBTodo from "../models/dbtodo.ts";
import Todo from "../models/todo.ts";

const todoRouter = new Router();

todoRouter.get("/todos", async (ctx) => {
  const todos: DBTodo[] = await getTodoCollection().find().toArray();
  const transformedTodos: Todo[] = todos.map((todo: DBTodo) => {
    return {
      id: todo._id.toString(),
      text: todo.text
    }
  });
  ctx.response.body = { todos: transformedTodos };
});

todoRouter.post("/todos", async (ctx) => {
  const reqData = await ctx.request.body().value as Todo;

  const newTodo: Todo = {
    text: reqData.text,
  };

  const id = await getTodoCollection().insertOne(newTodo);

  newTodo.id = id.toString();

  ctx.response.body = { todo: newTodo, message: "Todo was created successfully!" };
});

todoRouter.put("/todos/:todoId", async (ctx) => {
  const reqData = await ctx.request.body().value as Todo;
  const todoId = ctx.params.todoId;

  const updatedTodo = await getTodoCollection().findOne({ _id: new ObjectId(todoId) });

  if (!updatedTodo) {
    ctx.response.body = { message: "Todo not found!" };
    return;
  }

  await getTodoCollection().updateOne(
    { _id: new ObjectId(todoId) },
    { $set: { text: reqData.text } }
  );

  ctx.response.body = { message: "Todo was updated successfully!" };
});

todoRouter.delete("/todos/:todoId", async (ctx) => {
  const todoId = ctx.params.todoId;

  const updatedTodo = await getTodoCollection().findOne({ _id: new ObjectId(todoId) });

  if (!updatedTodo) {
    ctx.response.body = { message: "Todo not found!" };
    return;
  }

  await getTodoCollection().deleteOne({ _id: new ObjectId(todoId) });

  ctx.response.body = { message: "Todo was deleted successfully!" };
});

export default todoRouter;