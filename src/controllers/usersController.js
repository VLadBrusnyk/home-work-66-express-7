const { listUsers: listUsersFromStore, getUserById } = require('../data/usersStore');

function listUsers(req, res) {
    return res.render('users/list', { users: listUsersFromStore() });
}

function getUser(req, res) {
    const { userId } = req.params;
    const user = getUserById(userId);
    if (!user) {
        return res.status(404).send(`User not found: ${userId}`);
    }
    return res.render('users/detail', { user });
}

function createUser(req, res) {
    const { username, email } = req.body;
    return res.status(201).send(`User created: ${username} (${email})`);
}

module.exports = { listUsers, getUser, createUser };
