/**
 * Mongoose Models
 * Schemas and model helpers for Movies and Users.
 * @file
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for Movie documents.
 * @typedef {Object} Movie
 * @property {string} title - Movie title
 * @property {string} description - Synopsis
 * @property {{name:string, description:string}} genre - Movie genre info
 * @property {{name:string, description:string}} director - Director info
 * @property {string[]} Actors - Cast members
 * @property {string} ImageUrl - Poster or image URL
 * @property {boolean} featured - Featured flag
 */
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
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

/**
 * Mongoose schema for User documents.
 * @typedef {Object} User
 * @property {string} userId - Unique username
 * @property {string} password - Hashed password
 * @property {string} email - User email
 * @property {Date} birthDate - Birth date
 * @property {mongoose.Types.ObjectId[]} favoriteMovies - Favorite Movie IDs
 */
let userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hash a plaintext password.
 * @param {string} password
 * @returns {string} bcrypt hash
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validate a plaintext password against stored hash.
 * @param {string} password
 * @returns {boolean}
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;