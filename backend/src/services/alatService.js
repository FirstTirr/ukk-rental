const db = require('../config/db');

const alatService = {
    getAll: async () => {
        const query = `
            SELECT alat.*, category.nama_category AS category_name
            FROM alat 
            LEFT JOIN category ON alat.id_category = category.id_category
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = `
            SELECT alat.*, category.nama_category AS category_name
            FROM alat 
            LEFT JOIN category ON alat.id_category = category.id_category
            WHERE alat.id_alat = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    create: async (data) => {
        // Tambahkan harga_sewa di sini
        const { nama_alat, deskripsi, stok, harga_sewa, category_id } = data;
        return await db.query(
            'INSERT INTO alat (nama_alat, deskripsi, stok, harga_sewa, id_category) VALUES (?, ?, ?, ?, ?)',
            [nama_alat, deskripsi, stok, harga_sewa, category_id]
        );
    },

    update: async (id, data) => {
        // Tambahkan harga_sewa di sini juga
        const { nama_alat, deskripsi, stok, harga_sewa, category_id } = data;
        return await db.query(
            'UPDATE alat SET nama_alat = ?, deskripsi = ?, stok = ?, harga_sewa = ?, id_category = ? WHERE id_alat = ?',
            [nama_alat, deskripsi, stok, harga_sewa, category_id, id]
        );
    },

    delete: async (id) => {
        return await db.query('DELETE FROM alat WHERE id_alat = ?', [id]);
    }
};

module.exports = alatService;