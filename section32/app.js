import express from "express";

import resHandler from "./res-handler.js";

const app = express();

app.get("/", resHandler);

app.listen(3000, () => {
  console.log('App listening on port 3000.')
});
