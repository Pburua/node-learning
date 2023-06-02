import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import todoRouter from "./routes/todos.ts";

const port = 8080;

const app = new Application();

app.use(async (_ctx, next) => {
  await next();
})

app.use(todoRouter.routes())
app.use(todoRouter.allowedMethods())

app.addEventListener("listen", () => {
  console.log(`Server is listening on port ${port}`)
})

await app.listen({ port })