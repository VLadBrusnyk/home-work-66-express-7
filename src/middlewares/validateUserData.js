function validateUserData(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const { username, email } = req.body || {};
        if (!username || !email) {
            return res.status(400).send('Missing required fields: username and email.');
        }
    }
    next();
}

module.exports = validateUserData;
