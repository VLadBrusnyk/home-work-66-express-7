const {
    listUsers,
    getUserById,
    createUser,
    replaceUser,
    patchUser,
    deleteUser,
} = require('../data/usersStore');

function apiListUsers(req, res) {
    return res.json(listUsers());
}

function apiGetUser(req, res) {
    const { userId } = req.params;
    const user = getUserById(userId);
    if (!user) {
        return res.status(404).json({ error: `User not found: ${userId}` });
    }
    return res.json(user);
}

function apiCreateUser(req, res) {
    const { username, email } = req.body || {};
    const user = createUser({ username, email });
    return res.status(201).json(user);
}

function apiReplaceUser(req, res) {
    const { userId } = req.params;
    const { username, email } = req.body || {};
    const updated = replaceUser(userId, { username, email });
    if (!updated) {
        return res.status(404).json({ error: `User not found: ${userId}` });
    }
    return res.json(updated);
}

function apiPatchUser(req, res) {
    const { userId } = req.params;
    const updated = patchUser(userId, req.body || {});
    if (!updated) {
        return res.status(404).json({ error: `User not found: ${userId}` });
    }
    return res.json(updated);
}

function apiDeleteUser(req, res) {
    const { userId } = req.params;
    const ok = deleteUser(userId);
    if (!ok) {
        return res.status(404).json({ error: `User not found: ${userId}` });
    }
    return res.status(204).send();
}

module.exports = {
    apiListUsers,
    apiGetUser,
    apiCreateUser,
    apiReplaceUser,
    apiPatchUser,
    apiDeleteUser,
};
