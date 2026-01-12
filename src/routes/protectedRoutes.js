const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    return res.json({
        message: 'You have accessed a protected resource.',
        user: req.user ? { id: req.user.id, username: req.user.username, email: req.user.email } : null,
    });
});

module.exports = router;
