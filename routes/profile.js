const passport = require("passport"),
  { User, Campground } = require("../models"),
  { router, isLoggedIn } = require("../middleware");

const r = router("profile", "campgrounds");

//Show Profile(public)
module.exports = app => {
  app.get(r.rt('show','id'), (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
      if (err || !foundUser) {
        err
          ? req.flash("error", err.message)
          : req.flash("error", "User not found");
        return res.redirect("back");
      }
      Campground.find()
        .where("author.id")
        .equals(foundUser._id)
        .exec((err, foundCamps) => {
          if (err) {
            err
              ? req.flash("error", err.message)
              : req.flash("error", "Campground not found");
            return res.redirect("back");
          }
          res.render(r.view('show'), { foundUser, foundCamps });
        });
    });
  });

  //EDIT PROFILE
  app.get(r.rt('edit','id'), isLoggedIn, (req, res) => {
    const actionUrl = r.rt('index') + "/" + req.user._id + "?_method=PUT";
    User.findById(req.user._id, (err, foundUser) => {
      if (err || !foundUser) {
        err ? req.flash("error", err.message) : req.flash("User not found");
        res.render(r.view('show'));
      }
      res.render(r.view('edit'), { actionUrl });
    });
  });

  //UPDATE Profile
  app.put(r.rt('update','id'), isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      req.body.userInfo,
      (err, foundUser) => {
        if (err || !foundUser) {
          req.flash("error", "User not found");
          res.redirect("back");
        }
        //req.flash('success', 'Profile Updated');
        req.flash("success", "Profile has been updated.");
        res.redirect(r.redirectHome(''));
      }
    );
  });
};
