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
