var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');

var db = mongojs('nodetest1', ['users']);

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//  Set static path
app.use(express.static(path.join(__dirname, 'public')));


// Global Vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// creo el json 'person' para despues mostrarlo abajo con res.json(person);
/*var person = {name: 'Pol', age: 34};*/


db.on('error', function(err) {
  console.log('database error', err);

  var docs = [{
    name: 'error en la base',
    nick: 'blank',
    mail: 'blank'
  }];
});

db.on('connect', function() {
  console.log('database connected');
});


app.get('/', function(req, res) {
  //	res.send('hola');
  //	res.json(person);

  db.users.find(function(err, docs) {
    // docs is an array of all the documents in mycollection
    res.render('index', {
      title: 'caballos',
      users: docs
    });
  });

});

app.post('/users/add', function(req, res) {

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('nick', 'Nick is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {

    res.render('index', {
      title: 'caballos',
      users: docs,
      errors: errors
    });

  } else {

    var newUser = {
      name: req.body.name,
      nick: req.body.nick,
      mail: req.body.mail
    };

    db.users.insert(newUser, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }


});

app.delete('/users/delete/:id', function(req, res) {
  console.log('ok');
  console.log(req.params.id);
});

app.listen(3000, function() {
  console.log('Server started on port 3000');
});
