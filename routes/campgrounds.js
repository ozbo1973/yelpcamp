const Campground = require('../models/campSchema'),
  Comment = require('../models/commentSchema'),
  { isLoggedIn, campOwner, router } = require('../middleware');

//root vars
const r = router('campgrounds');

module.exports = app => {
  //INDEX
  app.get(r.route, (req, res) => {
    Campground.find({}, (err, campgrounds) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.render(r.name + '/index', { campgrounds, page: 'campgrounds' });
    });
  });

  //CREATE
  app.post(r.route, isLoggedIn, (req, res) => {
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
          req.flash('error', err.message);
          return res.redirect('back');
        }
        req.flash('success', camp.name + ' successfully created');
        res.redirect(r.route);
      }
    );
  });

  //NEW
  app.get(r.route + '/new', isLoggedIn, (req, res) => {
    res.render(r.name + '/new');
  });

  //SHOW
  app.get(r.route + '/:id', (req, res) => {
    Campground.findById(req.params.id)
      .populate('comments')
      .exec((err, campground) => {
        if (err || !campground) {
          req.flash('error', 'Campground not found');
          return res.redirect('back');
        }
        res.render(r.name + '/show', { campground });
      });
  });

  //EDIT
  app.get(r.route + '/:id/edit', isLoggedIn, campOwner, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      res.render(r.name + '/edit', { campground });
    });
  });

  //UPDATE
  app.put(r.route + '/:id', isLoggedIn, campOwner, (req, res) => {
    //find and UPDATE
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) => {
      if (err || !camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('back');
      }
      req.flash('success', 'Camp has been updated');
      res.redirect(r.route + '/' + req.params.id);
    });
  });

  //DESTROY
  app.delete(r.route + '/:id', isLoggedIn, campOwner, (req, res) => {
    //find and remove
    Campground.findByIdAndRemove(req.params.id, err => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      req.flash('success', 'Camp has been deleted');
      res.redirect(r.route);
    });
  });
};
//./exports
