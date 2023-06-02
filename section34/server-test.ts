import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const port = 8080;

const handler = (_request: Request): Response => {
  const body = "Hello Deno?"

  return new Response(body, { status: 200 });
};

await serve(handler, { port });
