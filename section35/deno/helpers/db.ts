import { Database, MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

import DBTodo from "../models/dbtodo.ts";

let db: Database;

async function connect() {
  const client = new MongoClient();

  await client.connect("mongodb://127.0.0.1:27017");

  db = client.database("todo-app-test");
}

function getDB() {
  return db;
}

function getTodoCollection() {
  return db.collection<DBTodo>('todos');
}

export {
  connect,
  getDB,
  getTodoCollection,
}