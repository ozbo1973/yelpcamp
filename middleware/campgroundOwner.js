Campground = require('../models/campSchema');

module.exports = (req, res, next) => {
  Campground.findById(req.params.id, (err, found) => {
    let msg = '';
    if (err || !found) {
      err ? (msg = err.message) : (msg = 'Campground not Found');
      req.flash('error', msg);
      return res.redirect('back');
    }
    if (!found.author.id.equals(req.user._id)) {
      req.flash('error', 'Permission denied, you are not the author!');
      return res.redirect('back');
    }
    next();
  });
};
