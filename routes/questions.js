const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Country = require('../models/country');
const Question = require('../models/question');
const answers = require('./answers');
const User = require('../models/user');

// layout variables
router.use(function(req, res, next) {
  res.locals.currentUserId = req.session.userId;

  next();
});

// questions index
router.get('/', (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    Question.find({ country: country }).sort({ points: -1 }).populate('answers').exec(function(err, questions) {
      if(err) { console.error(err) };

      res.render('questions/questions', { country: country, questions:questions });
    });
  });
})

// new question
router.get('/new', auth.requireLogin, (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    res.render('questions/new', { country: country });
  });
});


// creating question
router.post('/', auth.requireLogin, (req, res, next) => {

  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    let question = new Question(req.body);
    question.country = country;

    User.findById(req.session.userId, function(err, user) {
       if (err){console.error(err);};
       question.user = user.username;
       question.save(function(err, question) {
         if(err) { console.error(err) };
         User.findByIdAndUpdate(req.session.userId, {$inc: {numquestions: 1}}).then(() => {
           return res.redirect(`/countries/${country.id}/questions`);
         });
       });
    });
  });
});

router.post('/:id', auth.requireLogin, (req, res, next) => {
  Question.findById(req.params.id, function(err, question) {
    question.points += parseInt(req.body.points);

    question.save(function(err, question) {
      if(err) { console.error(err) };

      return res.redirect(`/countries/${question.country}/questions`);
    });
  });
});


router.use('/:questionId/answers', answers);

module.exports = router;
