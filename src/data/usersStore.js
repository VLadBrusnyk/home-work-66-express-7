const bcrypt = require('bcrypt');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const USERS = [
    { id: '1', username: 'alice', email: 'alice@example.com', passwordHash: null, resetTokenHash: null, resetTokenExpiresAt: null },
    { id: '2', username: 'bob', email: 'bob@example.com', passwordHash: null, resetTokenHash: null, resetTokenExpiresAt: null },
    { id: '3', username: 'charlie', email: 'charlie@example.com', passwordHash: null, resetTokenHash: null, resetTokenExpiresAt: null },
];

function hashPassword(password) {
    return bcrypt.hashSync(String(password), SALT_ROUNDS);
}

function verifyPassword(password, passwordHash) {
    if (!passwordHash) return false;
    return bcrypt.compareSync(String(password), String(passwordHash));
}

function listUsers() {
    return USERS;
}

function getUserById(id) {
    return USERS.find((u) => u.id === String(id));
}

function getUserByUsername(username) {
    return USERS.find((u) => u.username === String(username));
}

function getUserByEmail(email) {
    return USERS.find((u) => u.email && u.email.toLowerCase() === String(email).toLowerCase());
}

function createUser({ username, email, password }) {
    const nextId = String(Math.max(0, ...USERS.map((u) => Number(u.id) || 0)) + 1);
    const user = {
        id: nextId,
        username,
        email,
        passwordHash: password ? hashPassword(password) : null,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
    };
    USERS.push(user);
    return user;
}

function replaceUser(id, { username, email }) {
    const index = USERS.findIndex((u) => u.id === String(id));
    if (index === -1) return null;
    const updated = { ...USERS[index], id: String(id), username, email };
    USERS[index] = updated;
    return updated;
}

function patchUser(id, patch) {
    const user = getUserById(id);
    if (!user) return null;
    if (patch.username !== undefined) user.username = patch.username;
    if (patch.email !== undefined) user.email = patch.email;
    if (patch.password !== undefined) user.passwordHash = hashPassword(patch.password);
    return user;
}

function deleteUser(id) {
    const index = USERS.findIndex((u) => u.id === String(id));
    if (index === -1) return false;
    USERS.splice(index, 1);
    return true;
}

function verifyCredentials(username, password) {
    const user = getUserByUsername(username);
    if (!user || !user.passwordHash) return null;
    return verifyPassword(password, user.passwordHash) ? user : null;
}

function verifyCredentialsByEmail(email, password) {
    const user = getUserByEmail(email);
    if (!user || !user.passwordHash) return null;
    return verifyPassword(password, user.passwordHash) ? user : null;
}

function setPasswordResetToken(userId, { tokenHash, expiresAt }) {
    const user = getUserById(userId);
    if (!user) return null;
    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expiresAt;
    return user;
}

function clearPasswordResetToken(userId) {
    const user = getUserById(userId);
    if (!user) return null;
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    return user;
}

function findUserByResetTokenHash(tokenHash) {
    const now = Date.now();
    return USERS.find((u) => u.resetTokenHash === tokenHash && u.resetTokenExpiresAt && u.resetTokenExpiresAt > now);
}


module.exports = {
    listUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUser,
    replaceUser,
    patchUser,
    deleteUser,
    verifyCredentials,
    verifyCredentialsByEmail,
    hashPassword,
    setPasswordResetToken,
    clearPasswordResetToken,
    findUserByResetTokenHash,
};
