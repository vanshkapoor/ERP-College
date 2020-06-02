module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) { // because of passport
        return next();
      }
      req.flash('error_msg', 'Not authorized');
      res.redirect('//login');// when handel bars added give the path here muskan bhumika
    }
  }