const mongoose = require('mongoose');
const config = require('../config');

let didWarnMissingUri = false;

async function connectToMongo() {
    if (!config.MONGODB_URI) {
        if (!didWarnMissingUri) {
            didWarnMissingUri = true;
            console.warn('[mongo] MONGODB_URI is not set; MongoDB connection skipped');
        }
        return null;
    }

    if (/[<>]/.test(config.MONGODB_URI)) {
        console.warn(
            '[mongo] MONGODB_URI contains "<" or ">" (looks like a placeholder). Remove angle brackets and restart.'
        );
        return null;
    }

    const options = {};
    if (config.MONGODB_DB) {
        options.dbName = config.MONGODB_DB;
    }

    await mongoose.connect(config.MONGODB_URI, options);
    console.log('[mongo] Connected');

    return mongoose.connection;
}

function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = { mongoose, connectToMongo, isMongoConnected };
