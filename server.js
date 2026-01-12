const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./src/config');

const { connectToMongo } = require('./src/db/mongoose');

const initPassport = require('./src/passport');

const homeRoutes = require('./src/routes/homeRoutes');
const userRoutes = require('./src/routes/userRoutes');
const articleRoutes = require('./src/routes/articleRoutes');
const dbArticleRoutes = require('./src/routes/dbArticleRoutes');
const apiUserRoutes = require('./src/routes/apiUserRoutes');
const apiArticleRoutes = require('./src/routes/apiArticleRoutes');
const apiDbArticleRoutes = require('./src/routes/apiDbArticleRoutes');
const authRoutes = require('./src/routes/authRoutes');
const preferencesRoutes = require('./src/routes/preferencesRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = config.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.engine('ejs', require('ejs').__express);

if (config.COOKIE_SECURE) {
    app.set('trust proxy', 1);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: config.sessionCookieOptions,
    })
);

initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRoutes);
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);
app.use('/db/articles', dbArticleRoutes);
app.use('/preferences', preferencesRoutes);

app.use('/api/users', apiUserRoutes);
app.use('/api/articles', apiArticleRoutes);
app.use('/api/db/articles', apiDbArticleRoutes);
app.use('/api/auth', authRoutes);

app.use('/protected', protectedRoutes);

app.use((req, res) => {
    const isApi = req.originalUrl.startsWith('/api');
    if (isApi) return res.status(404).json({ error: 'Not found' });
    return res.status(404).send('Not found');
});

app.use(errorHandler);

if (require.main === module) {
    (async () => {
        try {
            await connectToMongo();
        } catch (err) {
            console.error('[mongo] Connection failed:', err && err.message ? err.message : err);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })();
}

module.exports = app;
