var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require("./models/db");

//mongodb+srv://anonymefr:taskok@frdrcpeter-ebpjm.mongodb.net/test?retryWrites=true&w=majority
//mongodb://localhost/Beniragi
var string_con = 'mongodb+srv://anonymefr:taskok@frdrcpeter-ebpjm.mongodb.net/test?retryWrites=true&w=majority';

db.connect(string_con, (isConnected, resultConnect) => {

    if (isConnected) {
        console.log(resultConnect)
    } else {
        console.log(resultConnect);
    }

})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/Users');
var typeUsersRouter = require('./routes/TypeUsers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/type_users', typeUsersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
