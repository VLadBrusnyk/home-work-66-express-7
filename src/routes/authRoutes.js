const crypto = require('crypto');
const express = require('express');
const passport = require('passport');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const config = require('../config');
const { sendMail } = require('../services/mailer');
const {
    createUser,
    getUserByEmail,
    setPasswordResetToken,
    clearPasswordResetToken,
    findUserByResetTokenHash,
    hashPassword,
} = require('../data/usersStore');

const router = express.Router();

function sanitizeUser(user) {
    return user ? { id: user.id, username: user.username, email: user.email } : null;
}

router.post('/register', (req, res, next) => {
    const { username, email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }
    if (getUserByEmail(email)) {
        return res.status(409).json({ error: 'User with this email already exists' });
    }

    const safeUsername = username || String(email).split('@')[0];
    const user = createUser({ username: safeUsername, email, password });

    return req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ user: sanitizeUser(user), message: 'User registered and logged in' });
    });
});

router.post('/login', (req, res, next) => {
    return passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });

        return req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({ user: sanitizeUser(user), message: 'Login successful' });
        });
    })(req, res, next);
});

router.get('/me', ensureAuthenticated, (req, res) => {
    return res.json({ user: sanitizeUser(req.user) });
});

router.post('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid', {
                httpOnly: config.sessionCookieOptions.httpOnly,
                sameSite: config.sessionCookieOptions.sameSite,
                secure: config.sessionCookieOptions.secure,
            });
            return res.json({ message: 'Logged out' });
        });
    });
});

// Password reset (email)
router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }

        const user = getUserByEmail(email);
        // Always respond 200 to avoid user enumeration.
        if (!user) {
            return res.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = Date.now() + 1000 * 60 * 30; // 30 minutes
        setPasswordResetToken(user.id, { tokenHash, expiresAt });

        const resetUrl = `${config.APP_BASE_URL}/api/auth/reset-password?token=${rawToken}`;

        await sendMail({
            to: user.email,
            subject: 'Password reset',
            text: `Use this link to reset your password (valid 30 minutes): ${resetUrl}`,
        });

        return res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        return next(err);
    }
});

router.post('/reset-password', (req, res) => {
    const { token, password } = req.body || {};
    if (!token || !password) {
        return res.status(400).json({ error: 'token and password are required' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = findUserByResetTokenHash(tokenHash);
    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.passwordHash = hashPassword(password);
    clearPasswordResetToken(user.id);
    return res.json({ message: 'Password has been reset successfully' });
});

module.exports = router;
