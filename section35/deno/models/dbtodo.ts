import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

export default  interface DBTodo {
  _id: ObjectId
  text: string
}