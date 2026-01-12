const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const validateUserData = require('../middlewares/validateUserData');
const {
    apiListUsers,
    apiGetUser,
    apiCreateUser,
    apiReplaceUser,
    apiPatchUser,
    apiDeleteUser,
} = require('../controllers/apiUsersController');

const router = express.Router();

router.use(ensureAuthenticated);
router.use(validateUserData);

router.get('/', apiListUsers);
router.get('/:userId', apiGetUser);
router.post('/', apiCreateUser);
router.put('/:userId', apiReplaceUser);
router.patch('/:userId', apiPatchUser);
router.delete('/:userId', apiDeleteUser);

module.exports = router;
