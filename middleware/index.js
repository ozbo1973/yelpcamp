const campOwner = require('./campgroundOwner'),
  commentOwner = require('./commentOwner'),
  isLoggedIn = require('./isLoggedIn'),
  router = require('./routeRoot');

module.exports = {
  campOwner,
  commentOwner,
  isLoggedIn,
  router
};
