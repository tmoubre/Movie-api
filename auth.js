/**
 * Authentication endpoints and JWT token generation.
 * Exposes POST /login (Local strategy) and signs JWT.
 * @file auth.js
 */
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
require("./passport");

/** Create a signed JWT for a user (minimal payload). */
function generateJWTToken(user) {
  const plain = user && user.toJSON ? user.toJSON() : user;
  const payload = {
    _id: plain._id,
    userId: plain.userId || plain.Username || plain.username, // keep your subject semantics
    email: plain.Email || plain.email,
  };
  return jwt.sign(payload, jwtSecret, {
    subject: String(payload.userId || ""), // subject = userId, as in your original
    expiresIn: "7d",
    algorithm: "HS256",
  });
}
/**
 * Log in a user with username/password (Local strategy).
 * Returns a signed JWT on success.
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
