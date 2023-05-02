const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'views', 'page-not-found.html'));
});

app.listen(8080);

console.log(`Server is listening on port ${8080}!`);
