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
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport');
const path = require("path");
let allowedOrigins = [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//Add Users
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('userId', 'User Id is required').isLength({ min: 5 }),
    check('userId', 'User Id contains non alpha numeric characters-not allowed').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not apper to be valid').isEmail()
  ], async (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = userId.hashedPassword(req.body.Password);
    await Users.findOne({ userId: req.body.userId })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.userId + 'User already exsits');
        } else {
          Users
            .create({
              userId: req.body.userId,
              password: hashedPassword,
              email: req.body.email,
              birthDate: req.body.birthDate
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('error:' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('error' + error);
      });
  });

// Update User
app.put('/users/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.Users.userId !== req.params.userId) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ userId: req.params.userId }, {
    $set:
    {
      userId: req.body.userId,
      password: req.body.password,
      email: req.body.email,
      birthDate: req.body.birthDate
    }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })

});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:userId', async (req, res) => {
  await Users.findOne({ userId: req.params.userId })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete a user by username
app.delete('/users/:userId', async (req, res) => {
  await Users.findOneAndDelete({ userId: req.params.userId })
    .then((user) => {
      if (user) {
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
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//delete Favorite Movie
app.delete('/users/:userId/favoriteMovies/:id', async (req, res) => {
  await Users.findOneAndUpdate(
    { userId: req.params.userId },
    { $pull: { favoriteMovies: req.params.id } },
    { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) =>
      res.status(500).send('Error:' + err)
    );
});

//Log to terminal with morgan

app.use(morgan('combined'));

//serve files from pulic directory staticly
app.use(express.static('public'));

//Get route for movies and returns top 10 movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error:" + error);
    });
});

//Get route for movie titles
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Get route for movie genre


//Get route for movie genre
app.get('/genre/:name', (req, res) => {
  Movies.findOne({ 'genre.name': req.params.name })
    .then((genre) => {
      res.json(genre.genre.description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Get route for movie Director
app.get('/director/:name', (req, res) => {
  Movies.findOne({ 'director.name': req.params.name })
    .then((director) => {
      res.json(director.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//log to txt file
app.get('/log', (req, res) => {
  res.send('This is a log.');
});
// GET route for "/" that returns a default textual response
app.get('/', (req, res) => {
  res.send('Welcome to my API! Please Go to /documentation.html to view the documentation.');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Check Code No response received.');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
});
