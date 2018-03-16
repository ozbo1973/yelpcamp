module.exports = (req, res, next) => {
  if (req.user._id && req.user.isAdmin) {
    next();
  } else {
    req.flash('error', 'Permission denied, you do not have admin permission!');
    return res.redirect('back');
  }
};
