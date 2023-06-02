import { Database, MongoClient } from "https://deno.land/x/mongo/mod.ts";

let db: Database;

async function connect() {
  const client = new MongoClient();

  await client.connect("mongodb://127.0.0.1:27017");

  db = client.database("todo-app-test");
}

function getDB() {
  return db;
}

export {
  connect,
  getDB
}