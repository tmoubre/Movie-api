const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
      name: String,
      description: String
    },
    director: {
      name: String,
      description: String
    },
    Actors: [String],
    ImageUrl: String,
    featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    userId: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthDate: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.Users = User;