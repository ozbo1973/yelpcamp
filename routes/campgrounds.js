const { Campground, Comment } = require("../models"),
  { isLoggedIn, campOwner, router } = require("../middleware");

//root vars
const r = router('campgrounds','campgrounds');

module.exports = app => {
  //INDEX
  app.get(r.rt('index'), (req, res) => {
    Campground.find({}, (err, campgrounds) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      res.render(r.view('index'), { campgrounds, page: "campgrounds" });
    });
  });

  //CREATE
  app.post(r.rt('create'), isLoggedIn, (req, res) => {
    //get new campgrounds
    const { name, price, img, description } = req.body;
    const author = { id: req.user._id, username: req.user.username };
    Campground.create(
      {
        name,
        price,
        img,
        author,
        description
      },
      (err, camp) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        req.flash("success", camp.name + " successfully created");
        res.redirect(r.redirectHome(''));
      }
    );
  });

  //NEW
  app.get(r.rt('new'), isLoggedIn, (req, res) => {
    res.render(r.view('new'));
  });

  //SHOW
  app.get(r.rt('show','id'), (req, res) => {
    Campground.findById(req.params.id)
      .populate("comments")
      .exec((err, campground) => {
        if (err || !campground) {
          req.flash("error", "Campground not found");
          return res.redirect("back");
        }
        res.render(r.view('show'), { campground });
      });
  });

  //EDIT
  app.get(r.rt('edit','id'), isLoggedIn, campOwner, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      res.render(r.view('edit'), { campground });
    });
  });

  //UPDATE
  app.put(r.rt('update','id'), isLoggedIn, campOwner, (req, res) => {
    //find and UPDATE
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) => {
      if (err || !camp) {
        req.flash("error", "Campground not found");
        return res.redirect("back");
      }
      req.flash("success", "Camp has been updated");
      res.redirect(r.redirectUpdate(req.params.id));
    });
  });

  //DESTROY
  app.delete(r.rt('destroy','id'), isLoggedIn, campOwner, (req, res) => {
    //find and remove
    Campground.findByIdAndRemove(req.params.id, err => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      req.flash("success", "Camp has been deleted");
      res.redirect(r.redirectHome(''));
    });
  });
};
//./exports
