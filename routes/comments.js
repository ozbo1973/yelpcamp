const Campground = require('../models/campSchema'),
  Comment = require('../models/commentSchema'),
  { isLoggedIn, commentOwner, router } = require('../middleware');

//root vars
const r = router('comments', 'campgrounds');

module.exports = app => {
  //NEW COMMENT
  app.get(r.home + '/:id' + r.route + '/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
      if (err || !camp) {
        req.flash('error', 'Campground not found');
        return res.redirect('back');
      }
      res.render(r.name + '/new', { camp });
    });
  });

  //CREATE COMMENTS
  app.post(r.home + '/:id' + r.route, isLoggedIn, (req, res) => {
    //lookup campground id
    Campground.findById(req.params.id, (err, camp) => {
      if (err || !camp) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      Comment.create(req.body.comment, (err, newComment) => {
        if (err || !newComment) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        //connect comment to campgrounds
        newComment.author.id = req.user._id;
        newComment.author.username = req.user.username;
        newComment.save();
        camp.comments.push(newComment._id);
        camp.save(err => {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          //redirect to campground
          res.redirect(r.home + '/' + camp._id);
        });
      });
    });
  });

  //EDIT comment
  app.get(
    r.home + '/:id' + r.route + '/:comment_id/edit',
    commentOwner,
    (req, res) => {
      Campground.findById(req.params.id, (err, campFound) => {
        if (err || !campFound) {
          req.flash('error', 'Campground not found.');
          return res.redirect('back');
        }

        Comment.findById(req.params.comment_id, (err, commentFound) => {
          if (err) {
            req.flash('error', 'Comment not found.');
            return res.redirect('back');
          }
          res.render(r.name + '/edit', { campId: req.params.id, commentFound });
        });
      });
    }
  );

  //UPDATE comment
  app.put(
    r.home + '/:id' + r.route + '/:comment_id',
    commentOwner,
    (req, res) => {
      //find and UPDATE
      Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, commentUpdate) => {
          if (err || !commentUpdate) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          req.flash('success', 'Comment has been updated.');
          res.redirect(r.home + '/' + req.params.id);
        }
      );
    }
  );

  //Delete comment
  app.delete(
    r.home + '/:id' + r.route + '/:comment_id',
    commentOwner,
    (req, res) => {
      Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        req.flash('success', 'Comment has been deleted.');
        res.redirect(r.home + '/' + req.params.id);
      });
    }
  );
};
