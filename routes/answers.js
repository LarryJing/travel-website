const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Country = require('../models/country');
const Question = require('../models/question');
const Answer = require('../models/answer');
const User = require('../models/user');

// new answer
router.get('/new', auth.requireLogin, (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    Question.findById(req.params.questionId, function(err, question) {
      if(err) { console.error(err) };

      res.render('answers/new', { question: question, country: country });
    });
  })
});

// create answer
router.post('/', auth.requireLogin, (req, res, next) => {

  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };
    Question.findById(req.params.questionId, function(err, question) {
      if(err) { console.error(err) };

      let answer = new Answer(req.body);
      question.answers.unshift(answer);

      question.save(function(err, question) {
        if(err) { console.error(err) };

        answer.save(function(err, answer) {
          if(err) { console.error(err) };
          User.findByIdAndUpdate(req.session.userId, {$inc: {numanswers: 1}}).then(() => {
            return res.redirect(`/countries/${country.id}/questions`);
          });
        });
      });
    });
  });
});

module.exports = router;
