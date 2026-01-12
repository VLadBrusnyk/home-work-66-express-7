function errorHandler(err, req, res, next) {
    console.error('Unhandled error:', err);
    const isApi = req.originalUrl.startsWith('/api');
    if (isApi) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(500).send('Internal server error.');
}

module.exports = errorHandler;
