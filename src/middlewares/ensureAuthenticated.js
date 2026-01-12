function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    const wantsJson = req.originalUrl.startsWith('/api') || req.accepts(['json', 'html']) === 'json';
    if (wantsJson) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    return res.status(401).send('Unauthorized. Please login.');
}

module.exports = ensureAuthenticated;
