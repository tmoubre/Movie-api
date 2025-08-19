/**
 * @file Mongoose models (Movie, User) and auth helpers.
 * @module models
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Movie schema.
 * @typedef {Object} Movie
 * @property {string} title
 * @property {string} description
 * @property {{name:string, description?:string}} genre
 * @property {{name:string, description?:string}} director
 * @property {string[]} [Actors]
 * @property {string} [imageURL]
 * @property {boolean} [featured]
 */
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: String,
    description: String,
  },
  director: {
    name: String,
    description: String,
  },
  Actors: [String],
  imageURL: String,
  featured: Boolean,
});

/**
 * User schema.
 * @typedef {Object} User
 * @property {string} userId
 * @property {string} password  Hashed via bcrypt.
 * @property {string} email
 * @property {Date} [birthDate]
 * @property {import('mongoose').Types.ObjectId[]} [favoriteMovies]
 */
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
  email: { type: String, required: true },
  birthDate: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hash a plaintext password.
 * @function hashPassword
 * @memberof User
 * @static
 * @param {string} password
 * @returns {string} bcrypt hash
 */
userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

/**
 * Validate a plaintext password against the stored hash.
 * @function validatePassword
 * @memberof User
 * @param {string} password
 * @returns {boolean}
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Movie, User };
