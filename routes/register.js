const passport = require('passport'),
  { User } = require('../models'),
  { router, isLoggedIn } = require('../middleware');

//root vars
const r = router('register', 'campgrounds');

module.exports = app => {
  //INDEX
  app.get(r.route, (req, res) => {
    res.render(r.name + '/register', { page: 'register' });
  });
  //CREATE
  app.post(r.route, (req, res) => {
    const { username, avatar, email, firstname, lastname } = req.body;
    const newUser = new User({ username, avatar, email, firstname, lastname });
    if (req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render(r.name + r.route, { msg_error: err.message });
      }
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Welcome to YelpCamp ' + user.username);
        res.redirect(r.home);
      });
    });
  });

  //EDIT PROFILE
  app.get('/profile/:id', isLoggedIn, (req, res) => {
    res.render(r.name + '/profile');
  });

  //UPDATE Profile
  app.put('/profile/:id', isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      req.body.userInfo,
      (err, foundUser) => {
        if (err || !foundUser) {
          req.flash('error', 'User not found');
        }
        req.flash('success', 'Profile Updated');
        res.redirect('/campgrounds');
      }
    );
  });

  app.get('/login', (req, res) => {
    res.render(r.name + '/login', { page: 'login' });
  });

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: './campgrounds',
      failureRedirect: './login'
    }),
    (req, res) => {
      res.redirect(r.home);
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/');
  });
};
