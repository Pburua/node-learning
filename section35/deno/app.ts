import { Application } from "https://deno.land/x/oak/mod.ts";

import todosRoutes from './routes/todos.ts';

// SETUP

const port = 8080;

const app = new Application();

// MIDDLEWARE

app.use(async (ctx, next) => {
  console.log('Middleware!');
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

// STARTUP

app.addEventListener("listen", () => {
  console.log(`Server is listening on port ${port}`)
})

await app.listen({ port });