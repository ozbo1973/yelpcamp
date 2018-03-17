const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  overrideMethod = require('method-override'),
  flash = require('connect-flash'),
  { Campground, Comment, User } = require('./models'),
  seedDb = require('./seed'),
  app = express(),
  dbURL = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp',
  PORT = process.env.PORT || 3000;

//****APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(overrideMethod('_method'));
app.set('view engine', 'ejs');
app.locals.moment = require('moment');

//**** PASSPORT
app.use(
  require('express-session')({
    secret: 'This is a secret to code',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//LOCAL VARS
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.msg_error = req.flash('error');
  res.locals.msg_success = req.flash('success');
  next();
});

//**** DATABASE
if (process.env.NODE_ENV !== 'production') {
  seedDb();
}
mongoose.connect(dbURL);

// ***** ROUTES
app.get('/', (req, res) => {
  res.render('landing');
});
require('./routes/campgrounds')(app);
require('./routes/comments')(app);
require('./routes/register')(app);
require('./routes/profile')(app);
app.get('*', (req, res) => {
  res.render('landing');
});

//PORT SUCCESS
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
