var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Country = require('../models/country');
const Post = require('../models/post');
const Question = require('../models/question')

// set layout variables
router.use(function(req, res, next) {
  res.locals.title = "SafeTravels";
  res.locals.currentUserId = req.session.userId;

  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("home page");
  // function onSignIn(googleUser) {
  //   var id_token = googleUser.getAuthResponse().id_token;
  //   var profile = googleUser.getBasicProfile();
  //   name = profile.getName();
  //   console.log("in onsignin");
  //   User.findById(user._id, function(err, user) {
  //     if (user === null) {
  //       const user = new User();
  //       user.username = name;
  //       user.password = user._id;
  //
  //       user.save(function(err, user) {
  //         if(err) return res.redirect(`/users/new?err=${err}`);
  //         return res.redirect('/');
  //       });
  //     }
  //     else {
  //       cosole.log("signed in");
  //       const currentUserId = id_token;
  //     }
  //   });
  // }
  const currentUserId = req.session.userId;
  var countries = [];
  if (!currentUserId){
    Question.find().sort({ createdAt:-1 }).limit(10).exec(function(err, questions) {
      // for (let i = 0; i < questions.length; i++) {
      //   Country.find({req.params.countryId:questions[i].country}).exec(function(err, country) {
      //     countries.push(country);
      //   });
      // }
      console.log(countries);
      res.render('index', { title: 'SafeTravels', currentUserId: currentUserId, questions: questions, countries: countries});
    });
  }
  else{
    User.findById(currentUserId, function(err, user) {
      Question.find().sort({ createdAt:-1 }).limit(10).exec(function(err, questions) {
        // for (let i = 0; i < questions.length; i++) {
        //   Country.find({countryId:questions[i].country}).exec(function(err, country) {
        //     countries.push(country);
        //   });
        // }
        res.render('index', { title: 'SafeTravels', currentUserId: currentUserId, questions: questions, countries: countries});
      });
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

      return res.render('login', { message: "Username or password incorrect"});
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
    console.log(user);
    if (typeof user === 'undefined' || !user) {
      res.render('login', { message: "Please sign in again"});
    }
    else {
      name = user.username;
      Post.find({ user: name }).sort({ points: -1 }).populate('comments').exec(function(err, posts1) {
        if(posts1 === null) { res.render('profile', { user:user, currentUserId: currentUserId , username: user.username, posts: userposts, contenttitle: "Posts"}); };
        res.render('profile', { user:user, currentUserId: currentUserId , username: user.username, posts: posts1, contenttitle: "Posts"});
      });
    }
  });
});

// questions
router.get('/profile/:id/questions', function(req, res, next) {

  const currentUserId = req.session.userId;
  User.findById(currentUserId, function(err, user) {
    if (err){console.error(err);};
    name = user.username;
    Question.find({ user: name }).sort({ points: -1 }).populate('answers').exec(function(err, questions) {
      if(questions === null) { res.render('profile', { user:user, currentUserId: currentUserId , username: user.username, questions: questions, contenttitle: "Questions"}); };
      res.render('profile', { user:user, currentUserId: currentUserId , username: user.username, questions: questions, contenttitle: "Questions"});
    });
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

router.get('/privacy', (req, res, next) => {
  res.render('privacy');
});

router.get('/attributions', (req, res, next) => {
  res.render('cred');
});

module.exports = router;
