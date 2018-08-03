const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('./helpers/auth');
const Country = require('../models/country');
// Add this line to require the Posts controller
const posts = require('./posts');
const questions = require('./questions')

// countries index

router.get('/', (req, res, next) => {
  Country.find({}, function(err, countries) {
    if(err) {
      console.error(err);
    } else {
      res.render('countrieslist', { countries: countries });
    }
  });
});

// new country
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('countries/new');
});

// create countries
router.post('/', (req, res, next) => {
  let country = new Country(req.body);

  country.save(function(err, country) {
    if(err) { console.error(err) };
    return res.redirect('countries');
  });
});

// show the page

router.get('/:id', (req, res, next) => {
  Country.findById(req.params.id, function(err, country) {
    if(err) { console.error(err) };

    Post.find({ country: country }).sort({ points: -1 }).populate('comments').exec(function(err, posts) {
      if(err) { console.error(err) };

      const yes = [];
      const no = [];

      for (var i = 0; i < posts.length; i += 1) {
        if (posts[i].yesno === true) {
          yes.push(posts[i]);
        }
        else {
          no.push(posts[i]);
        }
      }
      res.render('countries/country', { country: country, dos: yes, donts: no });
    });
  });
});

// Add this line to nest the routes
router.use('/:countryId/posts', posts)
router.use('/:countryId/questions', questions);

module.exports = router;
