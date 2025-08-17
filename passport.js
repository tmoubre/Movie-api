/**
 * Passport Strategies
 * Local and JWT strategies for authentication.
 * @file
 */
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * Configure LocalStrategy for username/password login.
 */
passport.use(
    new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password',
    },
        async (userId, password, callback) => {
            console.log(`${userId} ${password}`);
            await Users.findOne({ userId: userId })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'Incorrect username or password combination',
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, { message: 'Incorrect password.' });
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((error) => {
                    console.log(error);
                    return callback(error);
                }
                )
        }
    )
);
/**
 * Configure JWTStrategy to authenticate with Bearer token.
 */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));