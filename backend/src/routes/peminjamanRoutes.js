const express = require('express');
const router = express.Router();
const pinjamCtrl = require('../controllers/peminjamanControllers');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Peminjaman
router.post('/peminjaman', verifyToken, pinjamCtrl.ajukanPinjam); // Siswa meminjam
router.put('/validasi/:id', verifyToken, pinjamCtrl.validasiPinjam); // Petugas validasi
router.get('/read/peminjaman', verifyToken, pinjamCtrl.getPeminjaman); // Admin lihat semuany

module.exports = router;