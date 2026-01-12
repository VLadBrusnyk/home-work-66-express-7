const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const validateUserData = require('../middlewares/validateUserData');
const { listUsers, getUser, createUser } = require('../controllers/usersController');

const router = express.Router();

router.use(ensureAuthenticated);
router.use(validateUserData);

router.get('/', listUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

module.exports = router;
