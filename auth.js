const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require("passport");

require('./passport'); // Your local passport file


let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.userId, // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/*post login*/
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, userId, info) => {
            if (error || !userId) {
                return res.status(400).json({
                    message: 'Somthing is not right',
                    user: userId
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error)
                }
                let token = generateJWTToken(userId.toJSON());
                return res.json({ userId, token });
            });
        })(req, res);
    });
}