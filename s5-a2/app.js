
const express = require('express');

const app = express();

app.use('/users', (req, res) => {
    res.send('<h1>you are at user list</h1>');
})

app.use('/', (req, res) => {
    res.send('<h1>you are at server root</h1>');
})

app.listen(8080);

console.log(`Server listening at port ${8080}`);
