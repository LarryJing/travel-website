const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Country = require('../models/country');
const Post = require('../models/post');
const Comment = require('../models/comment');

// Comments new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };

      res.render('comments/new', { post: post, country: country });
    });
  })
});

// create comment
router.post('/', auth.requireLogin, (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };
    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };

      let comment = new Comment(req.body);
      post.comments.push(comment);

      post.save(function(err, post) {
        if(err) { console.error(err) };

        comment.save(function(err, comment) {
          if(err) { console.error(err) };

          return res.redirect(`/countries/${country.id}`);
        });
      });
    });
  });
});

module.exports = router;
