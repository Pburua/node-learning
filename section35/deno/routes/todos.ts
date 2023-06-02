import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";

import { getDB } from "../helpers/db.ts";

interface DBTodo {
  _id: ObjectId
  text: string
}

interface Todo {
  id?: string
  text: string
}

const todoRouter = new Router();

todoRouter.get("/todos", async (ctx) => {
  const todos = await getDB().collection('todos').find().toArray();
  const transformedTodos = todos.map((todo) => {
    return {
      id: todo._id.toString(),
      text: todo.text
    }
  });
  ctx.response.body = { todos: transformedTodos };
});

todoRouter.post("/todos", async (ctx) => {
  const reqData = await ctx.request.body().value;

  const newTodo: Todo = {
    text: reqData.text,
  };

  const id = await getDB().collection('todos').insertOne(newTodo);

  newTodo.id = id.toString();
  
  ctx.response.body = { todo: newTodo, message: "Todo was created successfully!" };
});

// todoRouter.put("/todos/:todoId", async (ctx) => {
//   const reqData = await ctx.request.body().value;
//   const reqParams = ctx.params;
//   const todoId = reqParams.todoId;
//   const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
//   if (todoIndex == -1) {
//     ctx.response.body = { message: "Todo not found!" };
//     return;
//   }
//   todos[todoIndex] = { ...todos[todoIndex], text: reqData.text };
//   ctx.response.body = { message: "Todo was updated successfully!" };
// });

// todoRouter.delete("/todos/:todoId", (ctx) => {
//   const reqParams = ctx.params;
//   const todoId = reqParams.todoId;
//   const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
//   if (todoIndex == -1) {
//     ctx.response.body = { message: "Todo not found!" };
//     return;
//   }
//   todos.splice(todoIndex, 1);
//   ctx.response.body = { message: "Todo was deleted successfully!" };
// });

export default todoRouter;