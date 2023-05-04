const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const users = [];

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', { pageTitle: 'S6-A4 - Home Page' });
})

app.get('/users', (req, res) => {
    console.log('users', users);
    res.render('users', { pageTitle: 'S6-A4 - Users Page', users });
})

app.post('/users', (req, res) => {
    users.push(req.body);
    res.status(302);
    res.redirect('/users');
})

app.listen(8080);

console.log(`Server listening at port ${8080}`);
