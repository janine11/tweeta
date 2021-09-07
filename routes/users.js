var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const db = require('../models')

/* Register new user. */
router.post('/register', function(req, res, next) {
  // take username, password
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'Please include username and password.'
    })
  }
  // create a new user...
  // check if username is already taken
  // this returns a promise (once this has happened, do something else... here .then())
  db.User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then((user) => {
    if (user) {
      res.status(400).json({
        error: 'username already taken'
      })
      // return stops it
      return
    }
    
    // hash password
    // hash is also a promise, 10 is the # of times we're encrypting
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // store in database
      // create is also a promise
      db.User.create({
        // give it an object with details of thing we're creating
        username: req.body.username,
        password: hash
      })
      .then((user) => {
        res.status(201).json({
          success: 'User created.'
        })
      })
    })
    // respond with success or error 
  })
});

module.exports = router;
