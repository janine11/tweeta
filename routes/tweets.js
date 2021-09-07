var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET all Tweets. */
router.get('/', async function(req, res, next) {
  // find all tweets in db
  const tweets = await db.Tweet.findAll({
    // get specific to include the model for User, but only the attribute username (not everything, like password)
    include: [{
      model: db.User,
      attributes: ['username']
    }]
  })
  // send them back
  res.send(tweets)
});

router.post('/', async (req, res) => {
  // content, user
  if (!req.body.content) {
    res.status(400).json({
      error: 'tweet content cannot be empty'
    })
    return
  }
  // find logged in user
  const user = await db.User.findByPk(req.session.user.id);
  // create a new tweet (createTweet has a model attached to it)
  const tweet = await user.createTweet({
    content: req.body.content
  })
  // send back response
  res.json(tweet)
})

module.exports = router;
