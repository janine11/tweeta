var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require ('express-session');
const db = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// how are you storing the session? from the db.sequelize file
const store = new SequelizeStore({db: db.sequelize});
store.sync()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tweetsRouter = require('./routes/tweets')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
      secret: 'secret', // used to sign the cookie
      resave: false, // update session even w/ no changes
      saveUninitialized: true, // always create a session
      cookie: {
        secure: false, // true: only accept https req's
        maxAge: 2592000, // time in seconds
      },
      store,
    })
  );

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
// edited to /api/v1 bc we;re using React as front end it's an API route
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tweets', tweetsRouter);

module.exports = app;
