const express = require('express');
const { saveTheme, getTheme } = require('../controllers/preferencesController');

const router = express.Router();

router.get('/theme', getTheme);
router.post('/theme', saveTheme);

module.exports = router;
