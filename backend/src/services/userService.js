const db = require('../config/db');
const argon2 = require('argon2'); // Ganti bcrypt jadi argon2 di sini!

const userService = {
    // Fungsi internal untuk hashing
    hashPassword: async (password) => {
        try {
            // Pastikan pakai argon2 sesuai yang di-require di atas
            return await argon2.hash(password);
        } catch (err) {
            console.error(err); // Biar kelihatan di terminal kalau ada error asli
            throw new Error("Gagal melakukan hashing password");
        }
    },

    // CREATE: Otomatis Hash
    create: async (data) => {
        const { username, password, id_role } = data;
        const hashedPassword = await userService.hashPassword(password);

        return await db.query(
            'INSERT INTO user (username, password, id_role) VALUES (?, ?, ?)',
            [username, hashedPassword, id_role]
        );
    },

    // UPDATE: Otomatis Hash
    update: async (id, data) => {
        const { username, password, id_role } = data;
        const hashedPassword = await userService.hashPassword(password);

        return await db.query(
            'UPDATE user SET username = ?, password = ?, id_role = ? WHERE id_user = ?',
            [username, hashedPassword, id_role, id]
        );
    },

    getAll: async () => {
        const [rows] = await db.query(`
            SELECT user.id_user, user.username, role.nama_role 
            FROM user 
            JOIN role ON user.id_role = role.id_role
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT user.id_user, user.username, role.nama_role 
            FROM user 
            JOIN role ON user.id_role = role.id_role
            WHERE id_user = ?
        `, [id]);
        return rows[0];
    },

    delete: async (id) => {
        return await db.query('DELETE FROM user WHERE id_user = ?', [id]);
    }
};

module.exports = userService;