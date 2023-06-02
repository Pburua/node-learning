import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

const port = 8080;
const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello oak?";
});

app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });