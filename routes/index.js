var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Country = require('../models/country');

// set layout variables
router.use(function(req, res, next) {
  res.locals.title = "SafeTravels";
  res.locals.currentUserId = req.session.userId;

  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    name = profile.getName();
    User.findById(user._id, function(err, user) {
      if (user === null) {
        const user = new User();
        user.username = name;
        user.password = user._id;

        user.save(function(err, user) {
          if(err) return res.redirect(`/users/new?err=${err}`);
          return res.redirect('/');
        });
      }
      else {
        const currentUserId = req.session.userId;
      }
    });
  }
  const currentUserId = req.session.userId;
  if (!currentUserId){
    res.render('index', { title: 'SafeTravels', currentUserId: currentUserId});
  }
  else{
    User.findById(currentUserId, function(err, user) {
        res.render('index', { title: 'SafeTravels', currentUserId: currentUserId, username: user.username});
    });
  }
});

router.get('/search', (req, res) => {
  let search = req.query.search
  // const searchterm = `/^${search}/`

  Country.findOne({countryname: {$regex: search, $options: "i"}}, function(err, country){
    if (country === null) {
      res.render('error', { title: "Sorry, we couldn't find what you were looking for :(\ Please enter in a country."})
    }
    else{
      res.redirect(`/countries/${country._id}`);
    }
  });
});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Username or password incorrect");
      next_error.status = 401;

      return next(next_error);
    } else {
      req.session.userId = user._id;
      return res.redirect('/') ;
    }
  });
});

// get profile page
router.get('/profile/:id', function(req, res, next) {

  if (auth2.isSignedIn.get()) {
    var profile = auth2.currentUser.get().getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  }

  const currentUserId = req.session.userId;
  User.findById(currentUserId, function(err, user) {
    if (err){console.error(err);};

    res.render('profile', { user:user, currentUserId: currentUserId , username: user.username});
  });
});

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }
  return res.redirect('/');
});

module.exports = router;
