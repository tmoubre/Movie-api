# myFlix API (Node/Express + MongoDB)

A RESTful API for the myFlix app that lets users register, log in, browse movies, and manage their list of favorites. JSON Web Tokens (JWT) secure protected endpoints.

## Tech Stack
- **Runtime:** Node.js, Express
- **Database:** MongoDB (Atlas or local), Mongoose ODM
- **Auth:** Passport (Local & JWT strategies), bcrypt for password hashing
- **Docs:** JSDoc (`/out` folder)
- **Dev Tools:** morgan (logging), cors, express-validator, dotenv

## Installation
```bash
git clone <your-repo-url>
cd Movie-api
npm install
Configuration

Create a .env file (not committed):

CONNECTION_URI=<your MongoDB URI>   # e.g. mongodb://127.0.0.1:27017/myflix OR your Atlas URI
JWT_SECRET=<a long random secret>
PORT=8080

Running
npm start
# Server on http://localhost:8080

Documentation

Generate / view API docs:

npm run docs
# Open ./out/index.html

Key Endpoints

POST /login — obtain JWT

POST /users — register

PUT /users/:userId — update user (JWT)

GET /users/:userId — get user

DELETE /users/:userId — delete user

POST /users/:userId/favoriteMovies/:id — add favorite

DELETE /users/:userId/favoriteMovies/:id — remove favorite

GET /movies — list (JWT)

GET /movies/:title — get by title

GET /genre/:name — genre info

GET /director/:name — director info

Build / Deploy

Heroku: set config vars CONNECTION_URI and JWT_SECRET, then push the repo.

Ensure your MongoDB Atlas IP Access List allows Heroku outbound connections (0.0.0.0/0 for testing, or specific ranges).

Author

Troy Oubre - oubre1@att.net