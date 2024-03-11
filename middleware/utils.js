// utils.js
exports.checkUserRole = (user, role) => {
    return user && user.role === role;
};