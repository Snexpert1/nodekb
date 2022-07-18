const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//check connection ok or not?
db.once('open', ()=>{
    console.log("Connected to Mongodb");
});

//check for Db errors here
db.on('error', (err)=>{
    console.log(err);
});

//init app
const app = express();
// imp since we need to work on model attributes thus we need to bring the model here in our main file
// bring in the model here
let article_1 = require('./models/article');
// const { copyFileSync } = require('fs');


// now lets show the articles data from mongodb on to browser using app.get
// let x = article_1.find({}, (err, x1)=>{
//     if (err){
//         console.log(err)
//     } else{
//         x1.forEach(t => {
//             console.log(`This is ${t.title}, ${t.author} and body is: ${t.body}`);
//         });

//     };

// });
// console.log(x);
//load view engnine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// add the body parser middleware here below
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public folder for using static files like css, bootstrap, jquery etc.

app.use(express.static(path.join(__dirname, 'public')));


//express session middleware

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }));

// express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator middleware

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
  
      
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
        
      };
    }
  }));


// bring in the passport js file here
require('./middleware/passport')(passport);

// now add middleware to initialize the passport authentication

app.use(passport.initialize());
app.use(passport.session());

// add a global variable for the user object we are going to create route to all the urls and create a global variable

app.get('*', (req,res, next)=>{
    res.locals.user = req.user || null;
    next();
})


//we will now install boostrap and for this we are gonna install bower which is frontend package manager for bootstrap
// and jquery since javascript file in bootstrap needs jquery so it will also do install jquery as well



//home route
app.get('/', (req,res)=>{

    article_1.find({}, (err, list)=>{
        if (err){
            console.log(err);

        }else{
            res.render('index', {
                title: "Articles",
                articles1: list
            });

        };
    });


    
});

// route files

let articles = require('./routes/articles');
app.use('/articles', articles);
let User = require('./routes/users');
app.use('/users', User);


//start the server

app.listen(3000, ()=>{
    console.log("server is running at port 3000");
});
