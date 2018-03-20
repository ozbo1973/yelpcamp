const passport = require("passport"),
  { User } = require("../models"),
  { router } = require("../middleware");

//root vars
const r = router("register", "campgrounds");

module.exports = app => {
  //INDEX
  app.get(r.rt('index'), (req, res) => {
    res.render(r.view('index'), { page: "register" });
  });
  //CREATE
  app.post(r.rt('create'), (req, res) => {
    const { username, avatar, email, firstname, lastname } = req.body;
    const newUser = new User({ username, avatar, email, firstname, lastname });
    if (req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render(r.view('index'), { msg_error: err.message });
      }
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect(r.homeDir);
      });
    });
  });
};
