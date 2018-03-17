const passport = require('passport'),
  { User, Campground } = require('../models'),
  { router, isLoggedIn } = require('../middleware');

const r = router('profile', 'campgrounds');
let msg = '';

//Show Profile(public)
module.exports = app => {
  app.get(r.show, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
      if (err || !foundUser) {
        err
          ? req.flash('error', err.message)
          : req.flash('error', 'User not found');
        return res.redirect('back');
      }
      Campground.find()
        .where('author.id')
        .equals(foundUser._id)
        .exec((err, foundCamps) => {
          if (err) {
            err
              ? req.flash('error', err.message)
              : req.flash('error', 'Campground not found');
            return res.redirect('back');
          }
          res.render(r.viewShow, { foundUser, foundCamps });
        });
    });
  });

  //EDIT PROFILE
  app.get(r.edit, isLoggedIn, (req, res) => {
    const actionUrl = r.route + '/' + req.user._id + '?_method=PUT';
    User.findById(req.user._id, (err, foundUser) => {
      if (err || !foundUser) {
        err ? (msg = msg_error(err.message)) : msg_error('User not found');
        res.render(r.viewShow);
      }
      res.render(r.viewEdit, { actionUrl });
    });
  });

  //UPDATE Profile
  app.put(r.update, isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      req.body.userInfo,
      (err, foundUser) => {
        if (err || !foundUser) {
          req.flash('error', 'User not found');
          res.redirect('back');
        }
        //req.flash('success', 'Profile Updated');
        msg = msg_success('Profile Update');
        res.redirect(r.home);
      }
    );
  });
};
