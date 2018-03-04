const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//Tell express we want to use handlebars for a view engine
//also register a path for partials.
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

/************Middleware examples*************** */

//"Middle-ware" - ability to act on the req/rsp prior to sending it out
//on regular routing.
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next(); //Needed to move on or the routing will never run
});

app.use((req, res, next) => {
    res.render('maintenance.hbs',{
        pageTitle: 'Under Construction Page'});
});

/*******Dynamic Routing example********/
//Takes the absolute path of our express app we want to serve up
//This one is a middleware which will allow us to serve up any routing
//under the specified path
app.use(express.static(__dirname + '/public'));

/*******************Static Routing Examples*********************** */

//Examples hitting the root to return some JSON
// app.get('/', (req, res) => {
//     //res.send('<h1>Hello Express!</h1>');
//     res.send({
//         id: 1,
//         name: 'Chris',
//         likes: [
//             'Item 1',
//             'Item 2'
//         ]
//     });
// });

//Register a function by name to hbs so the hbs pages may call it
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

//Another example, this time with a parameter
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//Render the about page. Render default looks to the views/ folder
//can handle hbs since we have told node to use it
app.get('/about', (req, res) => {
    res.render('about.hbs',{
        pageTitle: 'About Page'
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs',{
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'
    });
});

// /bad - send back json with errorMsg
app.get('/bad', (req,res) => {
    res.send({
        errorMessage: 'Bad Page'
    });
});

/**************Start server on a port + can run a custom function when it's started************ */
app.listen(3000, () => {
    console.log('Server is up');
});