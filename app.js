var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coolRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');

var app = express();

/*connecting to Database-MongoDB*/
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://m001-student:learningdatabase@sandbox.mxfyc.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
  .then( () => console.log('Connection to MongoDB is successful!'))
  .catch(err => console.log('Failed connection to MongoDB'));

mongoose.connection.on('error', err => console.log('Server disconnected from mongoDB'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//these paths '/' and 'users' are treated as a prefix to routes defined in the imported files(middlewares:indexRouter,coolRouter)
app.use('/', indexRouter);

//to add more routes, seprate the middlewares with comma, or write it in new line(seprately), or use array
app.use('/users', usersRouter, coolRouter);   
//app.use('/users', coolRouter); 

app.use('/catalog', catalogRouter);


/*
  catch 404 and forward to error handler
  express does not catch HTTP errors
  we don't want to shut down the app so give it to next()
*/
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
