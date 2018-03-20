const passport = require("passport"),
  { router } = require("../middleware");

r = router("login", "campgrounds");

module.exports = app => {
  app.get(r.rt('index'), (req, res) => {
    res.render(r.view('index'), { page: "login" });
  });

  app.post(
    r.rt('create'),
    passport.authenticate("local", {
      successRedirect: r.homeDir,
      failureRedirect: r.rt('index')
    }),
    (req, res) => {
      res.redirect(r.redirectHome(''));
    }
  );
};
