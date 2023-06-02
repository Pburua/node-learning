import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

interface Todo {
  id: string
  text: string
}

const todoRouter = new Router();

const todos: Todo[] = [];

todoRouter.get("/", (ctx) => {
  ctx.response.body = { todos };
});

todoRouter.post("/todo", async (ctx) => {
  const reqData = await ctx.request.body().value;

  const newTodo: Todo = {
    id: new Date().getTime().toString(),
    text: reqData.text,
  };
  todos.push(newTodo);
  ctx.response.body = { todo: newTodo, message: "Todo was created successfully!" };
});

todoRouter.put("/todo/:todoId", async (ctx) => {
  const reqData = await ctx.request.body().value;
  const reqParams = ctx.params;
  const todoId = reqParams.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    ctx.response.body = { message: "Todo not found!" };
    return;
  }
  todos[todoIndex] = { ...todos[todoIndex], text: reqData.text };
  ctx.response.body = { message: "Todo was updated successfully!" };
});

todoRouter.delete("/todo/:todoId", (ctx) => {
  const reqParams = ctx.params;
  const todoId = reqParams.todoId;
  const todoIndex = todos.findIndex((curTodo) => todoId === curTodo.id);
  if (todoIndex == -1) {
    ctx.response.body = { message: "Todo not found!" };
    return;
  }
  todos.splice(todoIndex, 1);
  ctx.response.body = { message: "Todo was deleted successfully!" };
});

export default todoRouter;