const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Country = require('../models/country');
const Post = require('../models/post');
const comments = require('./comments');
const User = require('../models/user');

// layout variables
router.use(function(req, res, next) {
  res.locals.currentUserId = req.session.userId;

  next();
});

// new post
router.get('/new', auth.requireLogin, (req, res, next) => {
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    res.render('posts/new', { country: country });
  });
});

// creating post
router.post('/', auth.requireLogin, (req, res, next) => {
  // const userId = req.session.userId;
  // User.findById(userId, function(err, user) {
  //   if (err){console.error(err);};
  //
  //   user.update({$inc: {numposts}} , function(err, user) {
  //     Country.findById(req.params.countryId, function(err, country) {
  //       if(err) { console.error(err) };
  //
  //       let post = new Post(req.body);
  //       post.country = country;
  //
  //       post.save(function(err, post) {
  //         if(err) { console.error(err) };
  //
  //         return res.redirect(`/countries/${country._id}`);
  //       });
  //     });
  //   })
  // });
  Country.findById(req.params.countryId, function(err, country) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.country = country;
    User.findById(req.session.userId, function(err, user) {
       if (err){console.error(err);};
       post.user = user.username;
    });

    post.save(function(err, post) {
      if(err) { console.error(err) };
      User.findByIdAndUpdate(req.session.userId, {$inc: {numposts: 1}}).then(() => {
        return res.redirect(`/countries/${country._id}`);
      });
    });
  });

});

router.post('/:id', auth.requireLogin, (req, res, next) => {
  const currentUserId = req.session.userId;
  var found = 0;

  Post.findById(req.params.id, function(err, post) {
    User.findById(currentUserId, function(err, user) {
       if (err){console.error(err);};

       for (let i = 0; i < post.voters.length; i++)
       {
         console.log('goes through for')
         if (post.voters[i].username === user.username)
         {
           console.log("found");
           found = 1;
         }
       }
       post.voters.push(user);
    });
    if (found == 1)
    {
      console.log("found 2");
      return res.redirect(`/countries/${post.country}`);
    }

    post.points += parseInt(req.body.points);
    post.save(function(err, post) {
      if(err) { console.error(err) };

      return res.redirect(`/countries/${post.country}`);
    });
  });
});

router.use('/:postId/comments', comments);

module.exports = router;