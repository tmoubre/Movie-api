/**
 * @file index.js
 * @description Express entrypoint for the myFlix API. Wires middleware, auth, routes, and
 * a robust MongoDB connection using environment variables.
 *
 * Required env vars:
 * - CONNECTION_URI : MongoDB connection string (local or Atlas)
 * - JWT_SECRET     : Secret used to sign/verify JWTs (must match passport.js)
 * - PORT           : Optional; defaults to 8080
 */

// Load .env only in local/dev; Heroku uses config vars, not .env files
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config();
  } catch (_) {
    // dotenv not installed in production – that's fine
  }
}

const express = require("express");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

const Models = require("./models.js"); // Movie & User mongoose models
const Movies = Models.Movie;
const Users = Models.User;

require("./passport"); // configure strategies (should read process.env.JWT_SECRET)

const app = express();

/**
 * Connect to MongoDB using CONNECTION_URI.
 * Fails fast with a clear message if missing.
 * @returns {Promise<void>}
 */
async function connectDB() {
  const uri = process.env.CONNECTION_URI;
  if (!uri) {
    console.error(
      "❌ CONNECTION_URI is not set. Add it to .env locally and to Heroku config vars in production."
    );
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(uri); // Mongoose v6+ sensible defaults
  console.log("✅ MongoDB connected");
}

// Helpful global connection logs
mongoose.connection.on("error", (err) => {
  console.error("Mongo connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

/** ===== CORS (safe config) ==============================================
 * Allow your deployed client + local Angular dev.
 * Requests from other origins are denied quietly (no 500s).
 */
const allowedOrigins = new Set([
  "https://sci-fi-movies.netlify.app",
  "http://localhost:4200",
]);

const corsOptions = {
  origin(origin, cb) {
    // Allow non-browser clients with no Origin (curl, health checks, server-to-server)
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    console.warn("CORS denied for origin:", origin);
    return cb(null, false);
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 200,
};

// ── Middleware ───────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight
app.use(morgan("combined")); // request logging
app.use(express.json()); // body parsing (JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve /public

// Mount /login from auth.js
require("./auth.js")(app);

/**
 * @route GET /health
 * @summary Liveness/readiness probe.
 * @returns {object} 200 - `{ status, db }`
 */
app.get("/health", async (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ status: "ok", db: state });
});

/** ============================ Routes: Users ============================ */

/**
 * @route POST /users
 * @summary Create a new user.
 * @param {string} body.userId - Username (min 5, alphanumeric)
 * @param {string} body.password - Password (required)
 * @param {string} body.email - Email address
 * @param {string} [body.birthDate] - Optional ISO date
 * @returns {object} 201 - Created user document
 */
app.post(
  "/users",
  [
    check("userId", "User Id is required").isLength({ min: 5 }),
    check("userId", "User Id must be alphanumeric").isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // Validate payload
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    try {
      // Hash password before storing
      const hashedPassword = Users.hashPassword(req.body.password);

      const existing = await Users.findOne({ userId: req.body.userId });
      if (existing)
        return res.status(400).send(`${req.body.userId} already exists`);

      const user = await Users.create({
        userId: req.body.userId,
        password: hashedPassword,
        email: req.body.email,
        birthDate: req.body.birthDate,
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route PUT /users/:userId
 * @summary Update a user’s profile. Requires JWT; user can only update self.
 * @param {string} path.userId
 * @returns {object} 200 - Updated user document
 */
app.put(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Only allow a user to update their own record
    if (!req.user || req.user.userId !== req.params.userId) {
      return res.status(403).send("Permission denied");
    }

    try {
      const updatedFields = {
        userId: req.body.userId,
        email: req.body.email,
        birthDate: req.body.birthDate,
      };

      if (req.body.password) {
        updatedFields.password = Users.hashPassword(req.body.password);
      }

      const updatedUser = await Users.findOneAndUpdate(
        { userId: req.params.userId },
        { $set: updatedFields },
        { new: true }
      );

      return res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route GET /users/:userId
 * @summary Get a single user by userId. Requires JWT (self).
 * @param {string} path.userId
 * @returns {object} 200 - User document
 */
app.get(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).send("Permission denied");
      }
      const user = await Users.findOne({ userId: req.params.userId });
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route DELETE /users/:userId
 * @summary Delete a user by userId. Requires JWT; user can only delete self.
 * @param {string} path.userId
 * @returns {string} 200 - Confirmation message
 */
app.delete(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).send("Permission denied");
      }

      const user = await Users.findOneAndDelete({ userId: req.params.userId });
      if (!user)
        return res.status(404).send(`${req.params.userId} was not found`);

      return res.status(200).send(`${req.params.userId} was deleted.`);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route POST /users/:userId/favoriteMovies/:id
 * @summary Add a movie ID to user’s favorites. Requires JWT (self).
 * @param {string} path.userId
 * @param {string} path.id - Movie ID
 * @returns {object} 200 - Updated user document
 */
app.post(
  "/users/:userId/favoriteMovies/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).send("Permission denied");
      }

      const updatedUser = await Users.findOneAndUpdate(
        { userId: req.params.userId },
        { $addToSet: { favoriteMovies: req.params.id } }, // $addToSet avoids duplicates
        { new: true }
      );

      return res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route DELETE /users/:userId/favoriteMovies/:id
 * @summary Remove a movie ID from user’s favorites. Requires JWT (self).
 * @param {string} path.userId
 * @param {string} path.id - Movie ID
 * @returns {object} 200 - Updated user document
 */
app.delete(
  "/users/:userId/favoriteMovies/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.userId !== req.params.userId) {
        return res.status(403).send("Permission denied");
      }

      const updatedUser = await Users.findOneAndUpdate(
        { userId: req.params.userId },
        { $pull: { favoriteMovies: req.params.id } },
        { new: true }
      );

      return res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/** ============================ Routes: Movies =========================== */

/**
 * @route GET /movies
 * @summary Get all movies. Requires JWT.
 * @returns {array<object>} 200 - Array of movie documents
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      return res.status(200).json(movies);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @route GET /movies/:title
 * @summary Get a movie by title.
 * @param {string} path.title
 * @returns {object|null} 200 - Movie document
 */
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await Movies.findOne({ title: req.params.title });
    return res.json(movie);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error: " + err);
  }
});

/**
 * @route GET /genre/:name
 * @summary Get a genre description by genre name.
 * @param {string} path.name
 * @returns {string|null} 200 - Genre description
 */
app.get("/genre/:name", async (req, res) => {
  try {
    const doc = await Movies.findOne({ "genre.name": req.params.name });
    return res.json(doc?.genre?.description ?? null);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error: " + err);
  }
});

/**
 * @route GET /director/:name
 * @summary Get director details by name.
 * @param {string} path.name
 * @returns {object|null} 200 - Director subdocument
 */
app.get("/director/:name", async (req, res) => {
  try {
    const doc = await Movies.findOne({ "director.name": req.params.name });
    return res.json(doc?.director ?? null);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error: " + err);
  }
});

/**
 * @route GET /
 * @summary Root greeting.
 */
app.get("/", (req, res) => {
  res.send("Welcome to my API! See /documentation.html for docs.");
});

/**
 * Global error handler (last in the chain).
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.stack || err);
  res.status(500).send("Unexpected error.");
});

/**
 * Bootstrap server: connect DB, then listen.
 * Keeps Heroku from flipping between starting/crashed during DB outages.
 */
(async function start() {
  try {
    await connectDB(); // ensure DB first
    const port = process.env.PORT || 8080;
    app.listen(port, "0.0.0.0", () => {
      console.log("🚀 Listening on Port " + port);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
