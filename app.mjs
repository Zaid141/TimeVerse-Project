import './config.mjs';
import passport from 'passport';
import express from 'express';
import session from 'express-session';
const app = express();

import './db.mjs';
import './passport-config.mjs';

import mongoose, { model } from 'mongoose';
const TimeCapsule = mongoose.model('TimeCapsule');
const User = mongoose.model('User');
const Content = mongoose.model('Content');


// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


// Route for the homepage
app.get('/', (req, res) => {
  res.render('home.hbs');
});

// Add a new route to render the create capsule form
app.get('/create-capsule', (req, res) => {
  res.render('create-capsule');
});

// Use Passport for authentication in your login route
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/time-capsules',
    failureRedirect: '/login',
  })
);

// Route to handle form submission for creating time capsules
app.post('/create-capsule', async (req, res) => {
  try {
    const { recipient, deliveryDate, isPublic, message } = req.body;

    // Create a new TimeCapsule document
    const timeCapsule = new TimeCapsule({
      recipient,
      deliveryDate,
      isPublic,
      contents: { message }
    });

    // Save the time capsule
    timeCapsule.save();

    res.redirect('/time-capsules');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Add a new route to render the login form
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new User document
    const user = new User({
      username,
      password,
      capsules: []
    });

    // Save the user to the database
    await user.save();

    // Redirect to the login page after successful registration
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/time-capsules', async (req, res) => {
  try {
    const timeCapsules = await TimeCapsule.find();
    res.render('time-capsules', { timeCapsules });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT || 3000);
