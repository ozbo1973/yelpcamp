Comment = require('../models/commentSchema');

module.exports = (req, res, next) => {
  Comment.findById(req.params.comment_id, (err, found) => {
    if (err || !found) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    if (!found.author.id.equals(req.user._id) && !req.user.isAdmin) {
      req.flash('error', 'Permission denied, you are not the author!');
      return res.redirect('back');
    }
    next();
  });
};
