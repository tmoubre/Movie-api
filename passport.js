const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = models.Users,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new localStrategy({
        usernameField: 'UserId',
        passwordField: 'Password',
    },
        async (userId, password, callback) => {
            console.log(`${userId}${password}`);
            await Users.findone({ userId: userId })
                .then((Users) => {
                    if (!Users) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'incorrect uername or password combination',
                        });
                    }
                    console.log('finished');
                    return callback(null, Users);
                })
                .catch((error) => {
                    console.log(error);
                    return callback(error);
                })
        }
    )
);
passport.use(new JWTStrategy({
    JWTFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}
));