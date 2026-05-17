const express = require('express');
const router = express.Router();
const alatControllers = require('../controllers/alatControllers');
const { verifyToken, isPetugas } = require('../middleware/authMiddleware');

// Siapa saja yang login bisa lihat
router.get('/read/alat', verifyToken, alatControllers.getAllAlat);
router.get('/read/alat/:id', verifyToken, alatControllers.getAlatById);

// Cuma Petugas/Admin yang bisa tambah, edit, hapus
router.post('/alat', verifyToken, isPetugas, alatControllers.createAlat);
router.put('/alat/:id', verifyToken, isPetugas, alatControllers.updateAlat);
router.delete('/alat/:id', verifyToken, isPetugas, alatControllers.deleteAlat);

module.exports = router;