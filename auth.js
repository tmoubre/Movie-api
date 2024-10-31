const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require("passport");
// const { Users } = require('./models');

require('./passport'); // Your local passport file


let generateJWTToken = (User) => {
    return jwt.sign(User, jwtSecret, {
        subject: User.UserId, // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/*post login*/
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, userId, info) => {
            if (error || !User) {
                return res.status(400).json({
                    message: 'Somthing is not right',
                    User: userId
                });
            }
            req.login(userId, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(User.toJSON());
                return res.json({ userId, token });
            });
        })(req, res);
    });
}