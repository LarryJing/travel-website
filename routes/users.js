const express = require('express');

const router = express.Router();
const User = require('../models/user');

// User New
router.get('/new', (req, res) => {
  res.render('users/new', {err: req.query.err});
});

// User create
router.post('/', (req, res) => {
  //
  const user = new User(req.body);
  User.find({username: req.body.username}, function(err, user) {
    if (user === null) {
      user.save(function(err, user) {
        if(err) return res.redirect(`/users/new?err=${err}`);
        return res.redirect('/login');
      });
    }
    else {
      res.render('error', {title: "Username is taken"});
    }
  })
});

module.exports = router;
