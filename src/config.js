require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret';
// JWT auth removed; kept intentionally minimal for sessions + password reset.
const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE || 'lax';
const COOKIE_SECURE = (process.env.COOKIE_SECURE || '').toLowerCase() === 'true' || isProd;

const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;

const SESSION_MAX_AGE_MS = Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 7);

const sessionCookieOptions = {
    httpOnly: true,
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_SECURE,
    maxAge: SESSION_MAX_AGE_MS,
};

const themeCookieOptions = {
    sameSite: COOKIE_SAMESITE,
    secure: COOKIE_SECURE,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

module.exports = {
    PORT,
    SESSION_SECRET,
    COOKIE_SECURE,
    COOKIE_SAMESITE,
    APP_BASE_URL,
    SESSION_MAX_AGE_MS,
    sessionCookieOptions,
    themeCookieOptions,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: (process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    MAIL_FROM: process.env.MAIL_FROM,
};
