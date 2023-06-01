import express from 'express';

import todoRouter from './routes/todos';

// CONFIG

const app = express();

// MIDDLEWARE

app.use(express.json({}));

app.use(todoRouter);

// STARTUP

app.listen(3000, () => {
  console.log('Server listening at port 3000!');
});
