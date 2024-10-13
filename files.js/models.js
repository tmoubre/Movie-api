const mongoose = require('mongoose');
// const { default: nodemon } = require('nodemon');
// const express = require('express'),
//     app = express(),
//     morgan = require ('morgan'),
//     bodyParser = require('body-parser'),
//     uuid = require('uuid');
//     const path = require("path");    
// app.use (bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


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