const db = require('../config/db');

exports.prosesKembali = async (id_peminjaman, id_petugas, tgl_kembali_asli) => {
    // 1. Ambil data peminjaman beserta statusnya saat ini
    const [peminjaman] = await db.query(
        'SELECT tgl_kembali_seharusnya, status_peminjaman FROM peminjaman WHERE id_peminjaman = ?',
        [id_peminjaman]
    );

    if (peminjaman.length === 0) {
        throw new Error('Data peminjaman tidak ditemukan');
    }

    const statusSekarang = peminjaman[0].status_peminjaman;

    // VALIDASI UTAMA: Hanya status 'dipinjam' atau 'terlambat' yang boleh dikembalikan
    if (statusSekarang !== 'dipinjam' && statusSekarang !== 'terlambat') {
        throw new Error(`Alat tidak bisa dikembalikan karena status saat ini adalah '${statusSekarang}'`);
    }

    const tglSeharusnya = new Date(peminjaman[0].tgl_kembali_seharusnya);
    const tglAsli = new Date(tgl_kembali_asli);
    
    // 2. Hitung denda otomatis (Selisih hari x Rp 5.000)
    const diffTime = tglAsli - tglSeharusnya;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const denda = diffDays > 0 ? diffDays * 5000 : 0.00;

    // 3. Jalankan Database Transaction (Syarat Poin 6 Soal UKK)
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Masukkan data ke tabel pengembalian
        await connection.query(
            'INSERT INTO pengembalian (id_peminjaman, id_petugas, tgl_kembali_asli, denda) VALUES (?, ?, ?, ?)',
            [id_peminjaman, id_petugas, tgl_kembali_asli, denda]
        );

        // Update status di tabel peminjaman jadi 'dikembalikan'
        await connection.query(
            "UPDATE peminjaman SET status_peminjaman = 'dikembalikan' WHERE id_peminjaman = ?",
            [id_peminjaman]
        );

        // Pastikan semua sukses, lalu Commit!
        await connection.commit();
        return { denda };
    } catch (error) {
        // Kalau ada query yang gagal di atas, batalkan semuanya (Rollback)
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// ... kode prosesKembali yang tadi tetap biarkan di atas

exports.getAllReport = async () => {
    const query = `
        SELECT 
            pemb.id_pengembalian,
            p.id_peminjaman,
            u.username AS nama_peminjam,
            a.nama_alat,
            p.tgl_peminjaman,
            p.tgl_kembali_seharusnya,
            pemb.tgl_kembali_asli,
            pemb.denda,
            petugas.username AS nama_petugas
        FROM pengembalian pemb
        JOIN peminjaman p ON pemb.id_peminjaman = p.id_peminjaman
        JOIN user u ON p.id_user = u.id_user
        JOIN alat a ON p.id_alat = a.id_alat
        JOIN user petugas ON pemb.id_petugas = petugas.id_user
    `;
    const [rows] = await db.query(query);
    return rows;
};