const express = require('express');
const router = express.Router();
const pengembalianCtrl = require('../controllers/pengembalianControllers');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Pengembalian Alat
router.post('/', verifyToken, pengembalianCtrl.kembalikanAlat);

// ENDPOINT BARU: Menampilkan Laporan Pengembalian (Untuk Admin/Petugas)
router.get('/laporan', verifyToken, pengembalianCtrl.getLaporanPengembalian);

module.exports = router;