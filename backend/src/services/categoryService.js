const db = require('../config/db');

const categoryService = {
    getAll: async () => {
        const [rows] = await db.query('SELECT id_category, nama_category AS category_name FROM category');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM category WHERE id_category = ?', [id]);
        return rows[0];
    },
    create: async (name) => {
        return await db.query('INSERT INTO category (nama_category) VALUES (?)', [name]);
    },
    update: async (id, name) => {
        return await db.query('UPDATE category SET nama_category = ? WHERE id_category = ?', [name, id]);
    },
    delete: async (id) => {
        return await db.query('DELETE FROM category WHERE id_category = ?', [id]);
    }
};

module.exports = categoryService;