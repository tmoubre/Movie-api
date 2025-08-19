/**
 * @file Authentication endpoints and JWT token generation.
 * @module auth
 */
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // dev fallback
require("./passport");

/**
 * Generate a signed JWT for a user (minimal payload).
 * @param {Object} user - Mongoose user doc or plain object.
 * @returns {string} Signed JWT.
 */
function generateJWTToken(user) {
  const u = user && user.toJSON ? user.toJSON() : user;
  const payload = {
    _id: u._id,
    userId: u.userId || u.Username || u.username,
    email: u.email || u.Email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    subject: String(payload.userId || payload._id || ""),
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

/**
 * Registers the /login route using Passport Local strategy.
 * Returns a JWT on success.
 * @param {import('express').Application|import('express').Router} router
 * @route POST /login
 * @returns {{user: object, token: string}}
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error)
        return res.status(500).json({ message: "Authentication error", error });
      if (!user)
        return res
          .status(400)
          .json({ message: (info && info.message) || "Invalid credentials" });

      req.login(user, { session: false }, (err) => {
        if (err)
          return res.status(500).json({ message: "Login error", error: err });
        const token = generateJWTToken(user);
        return res.json({ user, token });
      });
    })(req, res);
  });
};
