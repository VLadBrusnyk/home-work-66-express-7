const { themeCookieOptions } = require('../config');

const THEME_COOKIE = 'theme';

function saveTheme(req, res) {
    const { theme } = req.body || req.query || {};
    if (!theme) {
        return res.status(400).json({ error: 'Theme value is required' });
    }

    res.cookie(THEME_COOKIE, theme, themeCookieOptions);
    return res.json({ theme, message: 'Theme preference saved in cookie' });
}

function getTheme(req, res) {
    const theme = req.cookies?.[THEME_COOKIE] || 'light';
    return res.json({ theme });
}

module.exports = { saveTheme, getTheme };
