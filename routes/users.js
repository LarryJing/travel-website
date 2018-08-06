const express = require('express');

const router = express.Router();
const User = require('../models/user');

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

// User index
router.get('/', (req, res) => {

  User.find({}, 'username', (err, users) => {
    if (err) {
      console.error(err);
    } else {
      res.render('users/index', { users }); // {{users : users }}
    }
  });
});

// User New
router.get('/new', (req, res) => {
  res.render('users/new', {err: req.query.err});
});

// User create
router.post('/', (req, res) => {
  //
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) return res.redirect(`/users/new?err=${err}`)
    return res.redirect('/');
  });

});

module.exports = router;
