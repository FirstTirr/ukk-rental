const db = require('../config/db');

const authService = {
    findUserByUsername: async (username) => {
        const [users] = await db.query(
            `SELECT user.*, role.nama_role FROM user 
             JOIN role ON user.id_role = role.id_role 
             WHERE username = ?`, [username]
        );
        return users[0];
    }
};

module.exports = authService;