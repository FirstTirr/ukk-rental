const db = require('../config/db');

const peminjamanService = {
    create: async (id_user, data) => {
        const { id_alat, tgl_kembali_seharusnya, total_bayar } = data;
        
        // -- 1. CEK STOK ALAT TERLEBIH DAHULU
        const [alat] = await db.query(
            'SELECT stok FROM alat WHERE id_alat = ?',
            [id_alat]
        );

        if (alat.length === 0) {
            throw new Error('Alat tidak ditemukan!');
        }

        // -- 2. VALIDASI: Jika stok 0 atau kurang, langsung lempar error
        if (alat[0].stok <= 0) {
            throw new Error('Maaf, stok alat ini sudah habis! Tidak bisa meminjam.');
        }
        
        // -- 3. JIKA STOK AMAN, BARU JALANKAN INSERT (Kode aslimu)
        const [result] = await db.query(
            `INSERT INTO peminjaman 
            (id_user, id_alat, tgl_kembali_seharusnya, tgl_peminjaman, status_peminjaman, total_bayar) 
            VALUES (?, ?, ?, CURDATE(), 'pending', ?)`,
            [id_user, id_alat, tgl_kembali_seharusnya, total_bayar]
        );

        return result;
    },

    validate: async (id_peminjaman, id_petugas, status) => {
        return await db.query(
            'UPDATE peminjaman SET status_peminjaman = ?, id_petugas = ? WHERE id_peminjaman = ?',
            [status, id_petugas, id_peminjaman]
        );
    },

    getAllReport: async () => {
        const query = `
            SELECT 
                p.id_peminjaman,
                u.username AS nama_peminjam,
                a.nama_alat,
                p.tgl_peminjaman,
                p.tgl_kembali_seharusnya,
                p.status_peminjaman,
                petugas.username AS nama_petugas
            FROM peminjaman p
            JOIN user u ON p.id_user = u.id_user
            JOIN alat a ON p.id_alat = a.id_alat
            LEFT JOIN user petugas ON p.id_petugas = petugas.id_user
        `;
        const [rows] = await db.query(query);
        return rows;
    }
};

module.exports = peminjamanService;