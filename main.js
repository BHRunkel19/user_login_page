//require packages
const express = require('express');
const expHandlebars = require('express-handlebars')
const validator = require('express-validator')
const session = require('express-session');
const bodyParser = require('body-parser')
const userData = require('./data.js')
const app = express();

//define templates
app.engine('handlebars', expHandlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


//configure express-session
app.use(
  session({
    secret: 'blargh',
    resave: false, //doesn't save without changes
    saveUninitialized: true
  })
)

//configure app to render static files
app.use(express.static('public'));

//configure bodyparser for requesting form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//configure validator
app.use(validator());

//create default session
app.get('/', function(req, res){
  if (!req.session.user){
    res.redirect('/login')
  } else {
    res.render('home', {
      user: req.session.user
    });
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let player = req.body;

  req.checkBody('username', 'Username is required, dummy!').notEmpty();
  req.checkBody('password', 'Password is required, dummy!').notEmpty();

  let errors = req.validationErrors();

  if (errors){
    res.render('login', {
      errors: errors
    });

  } else {
    let users = userData.filter(function(userCheck){
      return userCheck.username === req.body.username;
    });
    console.log(users);

    if (users.length === 0) {
      let notRecognized = "No User Found."
      res.render('login', {
        thing: notRecognized
      })
    }


    let user = users[0];

    if (user.password === req.body.password){
      req.session.user = user.username;
      res.redirect('/');
    } else {
      let notPassword = "Womp womp"
      res.render('login', {
        something: notPassword
      });
    }
  }
});

//define how the app will listen and respond to program initiation
app.listen(3000, function(){
  console.log('The program has successfully started!')
})
