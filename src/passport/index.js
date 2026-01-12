const LocalStrategy = require('passport-local').Strategy;
const { getUserById, verifyCredentialsByEmail } = require('../data/usersStore');

function initPassport(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = getUserById(id);
        if (!user) return done(null, false);
        return done(null, user);
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                session: true,
            },
            (email, password, done) => {
                try {
                    const user = verifyCredentialsByEmail(email, password);
                    if (!user) return done(null, false, { message: 'Invalid email or password' });
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
}

module.exports = initPassport;
