const peminjamanService = require('../services/peminjamanService');

// 1. Siswa mengajukan pinjaman
exports.ajukanPinjam = async (req, res) => {
    try {
        // id_user diambil otomatis dari middleware verifyToken (req.user.id)
        const id_user = req.user.id; 
        const result = await peminjamanService.create(id_user, req.body);
        res.status(201).json({ message: "Pengajuan pinjaman berhasil dikirim!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Petugas memvalidasi (Update Status & Petugas ID)
exports.validasiPinjam = async (req, res) => {
    try {
        const id_peminjaman = req.params.id;
        const id_petugas = req.user.id; // Petugas yang lagi login
        const { status_peminjaman } = req.body;

        await peminjamanService.validate(id_peminjaman, id_petugas, status_peminjaman);
        res.json({ message: `Peminjaman berhasil di-update menjadi ${status_peminjaman}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Admin/Petugas melihat laporan lengkap
exports.getPeminjaman = async (req, res) => {
    try {
        const data = await peminjamanService.getAllReport();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};