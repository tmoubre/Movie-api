# myFlix Movie API

An Express + MongoDB REST API that powers the myFlix application. Includes JWT-based authentication, user management, and movie endpoints.

## Tech Stack
- Node.js, Express
- MongoDB with Mongoose
- Passport (Local & JWT strategies)
- express-validator, morgan, cors
- bcrypt for password hashing

## Prerequisites
- Node.js LTS
- MongoDB database (Atlas or local)
- A `.env` or environment variables configured for:
  - `CONNECTION_URI` – MongoDB connection string
  - `PORT` (optional)

## Setup
```bash
git clone <your-repo-url>
cd Movie-api
npm install
```
Create a `.env` with:
```
CONNECTION_URI=<your-mongodb-uri>
PORT=8080
JWT_SECRET=your_jwt_secret
```

## Run
```bash
npm start
# or with nodemon
npm run dev
```

## Authentication
- `POST /login` — returns a JWT (see `auth.js`). Send `userId` and `password`.
- Use `Authorization: Bearer <token>` header for protected routes.

## Endpoints (summary)
- `POST /users` — register user
- `PUT /users/:userId` — update user
- `DELETE /users/:userId` — delete user
- `POST /users/:userId/favoriteMovies/:id` — add favorite
- `DELETE /users/:userId/favoriteMovies/:id` — remove favorite
- `GET /movies` — all movies (protected)
- `GET /movies/:title` — movie by title (protected)
- `GET /movies/genre/:name` — genre info (protected)
- `GET /movies/directors/:name` — director info (protected)

## Documentation
### Generate JSDoc
```bash
npm i -g jsdoc
jsdoc ./
# opens ./out/index.html
```
> Only block comments starting with `/** ... */` are included.

## Testing (manual)
- Use Postman or curl with a valid JWT to hit protected endpoints.

## Security Notes
- Do not commit real connection strings or secrets.
- Passwords are hashed with bcrypt.
- CORS is restricted to allowed origins in `index.js`.

## AI Usage
Parts of these docs and code comments were assisted by an AI tool and reviewed for accuracy.

### Dependencies (Key Libraries & Versions)
- `express` **^4.21.0**
- `mongoose` **^8.7.1**
- `passport` **^0.7.0**
- `passport-jwt` **^4.0.1**
- `passport-local` **^1.0.0**
- `jsonwebtoken` **^9.0.2**
- `cors` **^2.8.5**
- `bcrypt` **^5.1.1**
- `morgan` **^1.10.0**
- `express-validator` **^7.2.0**

### Build / Deployment Instructions

**Environment variables (.env):**
```bash
CONNECTION_URI=<your MongoDB URI>
JWT_SECRET=<your strong secret>
PORT=8080
```

**Development:**
```bash
npm install
node index.js           # or add "start": "node index.js" and run: npm start
```

**Production:**
```bash
npm ci
NODE_ENV=production PORT=8080 node index.js
# (optional) pm2 start index.js --name myflix-api
```
