const passport = require('passport'),
  User = require('../models/userSchema'),
  route = require('../middleware/routeRoot');

//root vars
const r = route('register', 'campgrounds');

module.exports = app => {
  app.get(r.route, (req, res) => {
    res.render(r.name + '/register', { page: 'register' });
  });

  app.post(r.route, (req, res) => {
    const newUser = new User({ username: req.body.username });
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
