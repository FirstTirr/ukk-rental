const pengembalianService = require('../services/pengembalianService');

exports.kembalikanAlat = async (req, res) => {
    try {
        const { id_peminjaman, tgl_kembali_asli } = req.body;
        const id_petugas = req.user.id; // Otomatis dari verifyToken

        if (!id_peminjaman || !tgl_kembali_asli) {
            return res.status(400).json({ message: "Data input tidak lengkap!" });
        }

        const hasil = await pengembalianService.prosesKembali(id_peminjaman, id_petugas, tgl_kembali_asli);
        
        return res.status(200).json({
            message: "Alat berhasil dikembalikan!",
            denda_terhitung: hasil.denda,
            status_sekarang: "dikembalikan"
        });
    } catch (err) {
        // Jika trigger error dari validasi status, kirim status 400
        return res.status(400).json({ error: err.message });
    }
};

// ... kode kembalikanAlat yang tadi tetap biarkan di atas

exports.getLaporanPengembalian = async (req, res) => {
    try {
        const data = await pengembalianService.getAllReport();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};