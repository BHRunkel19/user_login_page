//require packages
const express = require('express');
const mustacheExpress = require('mustache-express');
const morgan = require('morgan');
const expHandlebars = require('express-handlebars')
const validator = require('express-validator')
const session = require('express-session');
const bodyParser = require('body-parser')
const fs = require('fs');
const users = require('./data.js')
const app = express();

//define templates
app.engine('handlebars', expHandlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


//configure session
app.use(
  session({
    secret: 'blargh',
    resave: false,
    saveUninitialized: true
  })
)

//setup morgan for log request
app.use(morgan('dev'));

//configure app to render static files
app.use(express.static('public'));

//configure bodyparser for requesting form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//configure validator
app.use(validator());

//create default session
app.use((req, res, next) => {
  if (!req.session.users){

    req.session.users = [];

  }
  console.log(req.session);
  next();
})

//configure the webroot
app.get('/', (req, res) => {
  if (req.session.users === undefined || req.session.users.length == 0){
    res.redirect('/login');
  } else {
    res.render('home')
  }

})

//configure login form page
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  let userData = req.body;

  req.checkBody('email', 'Email is required').notEmpty();

  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if (errors){
    console.log(errors);

    res.render('login', {
      errors: errors,
      userData: userData
    })

  } else {

    req.session.users.push(userData);
    users.push(userData);
    console.log(users);

    res.redirect('/');
  }
})

//define how the app will listen and respond to program initiation
app.listen(3000, function(){
  console.log('The program has successfully started!')
})
