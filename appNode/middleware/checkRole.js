// middleware/checkRole.js
const { checkUserRole } = require('../utils');

module.exports = (role) => {
    return (req, res, next) => {
        if (checkUserRole(req.session.user, role)) {
            next();
        } else {
            res.status(403).send('Accès interdit');
        }
    };
};