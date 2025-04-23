const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require('uuid');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const cors = require('cors');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['https://sci-fi-movies.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS policy:', origin);
      callback(new Error('CORS policy does not allow access from this origin'), false);
    }
  },
  optionsSuccessStatus: 200
}));

// ✅ Handle Preflight Requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport');
const path = require("path");

// Log to terminal with morgan
app.use(morgan('combined'));

// Serve files from public directory statically
app.use(express.static('public'));

// === Your Routes ===

// Add Users
app.post('/users',
  [
    check('userId', 'User Id is required').isLength({ min: 5 }),
    check('userId', 'User Id contains non alpha numeric characters-not allowed').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

    await Users.findOne({ userId: req.body.userId })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.userId + ' already exists');
        } else {
          Users
            .create({
              userId: req.body.userId,
              password: hashedPassword,
              email: req.body.email,
              birthDate: req.body.birthDate
            })
            .then((user) => { res.status(201).json(user); })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Update User
app.put('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res.status(400).send('Permission denied');
  }

  const updatedFields = {
    userId: req.body.userId,
    email: req.body.email,
    birthDate: req.body.birthDate
  };

  if (req.body.password) {
    updatedFields.password = Users.hashPassword(req.body.password); // 🔐 Hash the password
  }

  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $set: updatedFields },
    { new: true }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get a user by username
app.get('/users/:userId', async (req, res) => {
  await Users.findOne({ userId: req.params.userId })
    .then((user) => res.json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete a user by username
app.delete('/users/:userId', async (req, res) => {
  await Users.findOneAndDelete({ userId: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.userId + ' was not found');
      } else {
        res.status(200).send(req.params.userId + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:userId/favoriteMovies/:id', async (req, res) => {
  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $push: { favoriteMovies: req.params.id } },
    { new: true }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete a favorite movie
app.delete('/users/:userId/favoriteMovies/:id', async (req, res) => {
  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $pull: { favoriteMovies: req.params.id } },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).send('Error: ' + err));
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => res.status(201).json(movies))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get a movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => res.json(movie))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get genre info
app.get('/genre/:name', (req, res) => {
  Movies.findOne({ 'genre.name': req.params.name })
    .then((genre) => res.json(genre.genre.description))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director info
app.get('/director/:name', (req, res) => {
  Movies.findOne({ 'director.name': req.params.name })
    .then((director) => res.json(director.director))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Log route
app.get('/log', (req, res) => {
  res.send('This is a log.');
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to my API! Please go to /documentation.html to view the documentation.');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Check Code. No response received.');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
