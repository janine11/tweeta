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

router.post('/login', async (req, res) => {
  // check if username and password
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      error: 'Please include username and password.'
    })
    return
  }
  // find user by username
  // its going to stop at this line and wait for the promise to finish
  // then put the result in the variable (const user =)
  const user = await db.User.findOne({
    where: {
      username: req.body.username
    }
  })

  if (!user) {
    res.status(400).json({
      error: 'could not find user with that username.'
    })
    // if there is no user, stop at this point
    return
  }
  // check password
  // compare (comparing data (req.body.password) to the user.password from above on line 63)
  const success = await bcrypt.compare(req.body.password, user.password)
    if (!success) {
    res.status(401).json({
      error: 'incorrect password'
    })
    return
  }
  // login
  // how we tell Express that the user has logged in
    req.session.user = user
  // respond with success or error
  res.json({
    success: 'successfully logged in.'
  })
})


module.exports = router;
