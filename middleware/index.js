const campOwner = require('./campgroundOwner'),
  commentOwner = require('./commentOwner'),
  isLoggedIn = require('./isLoggedIn'),
  router = require('./routeRoot'),
  isAdmin = require('./isAdmin');

module.exports = {
  campOwner,
  commentOwner,
  isLoggedIn,
  router,
  isAdmin
};
