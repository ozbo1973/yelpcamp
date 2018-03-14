module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to perform the action.');
  res.redirect('/login');
};
