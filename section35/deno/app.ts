import { Application } from "https://deno.land/x/oak/mod.ts";

import todosRoutes from './routes/todos.ts';
import { connect } from "./helpers/db.ts";

// SETUP

const port = 8080;

const app = new Application();

// MIDDLEWARE

app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

// STARTUP

await connect();

app.addEventListener("listen", () => {
  console.log(`Server is listening on port ${port}`)
})

await app.listen({ port });