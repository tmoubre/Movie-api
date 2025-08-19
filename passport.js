"use strict";

/**
 * Passport configuration:
 * - LocalStrategy: authenticates via userId + password.
 * - JWTStrategy: validates Bearer token and loads the user.
 *
 * @file passport.js
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const Models = require("./models.js");

const Users = Models.User;

/**
 * Secret used to verify JWT signatures.
 * Prefer setting JWT_SECRET in the environment.
 */
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * LocalStrategy: username/password auth.
 * @remarks
 * Maps the username field to `userId` to match your schema/request body.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "userId",
      passwordField: "password",
      session: false,
    },
    /**
     * Verify callback for LocalStrategy.
     * @param {string} userId - The user’s chosen username (stored as `userId` in DB).
     * @param {string} password - Plaintext password to validate.
     * @param {Function} done - Passport callback.
     * @returns {void}
     */
    async (userId, password, done) => {
      try {
        const user = await Users.findOne({ userId: userId });
        if (!user) {
          // Do not leak which part was wrong.
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        // `validatePassword` should be defined on your User schema (bcrypt compare).
        const ok = user.validatePassword(password);
        if (!ok) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

/**
 * JWTStrategy: Bearer token auth.
 * @remarks
 * Expects tokens signed with the same secret and a payload containing `_id`.
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
    },
    /**
     * Verify callback for JWTStrategy.
     * @param {object} payload - Decoded JWT payload (should include `_id`).
     * @param {Function} done - Passport callback.
     * @returns {void}
     */
    async (payload, done) => {
      try {
        // `auth.js` signs the token with `_id` in the payload.
        const user = await Users.findById(payload._id);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Exporting is optional; requiring this file once initializes strategies.
// Exporting passport can be convenient for tests or explicit imports.
module.exports = passport;
