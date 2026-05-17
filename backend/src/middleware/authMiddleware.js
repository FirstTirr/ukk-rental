const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Ambil token dari header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
        return res.status(403).json({ message: "Akses ditolak, token tidak ada!" });
    }

    try {
        const decoded = jwt.verify(token, 'RAHASIA_UKK_2026');
        req.user = decoded; // Data user (id & role) disimpan ke req biar bisa dipake nanti
        next(); // Lanjut ke proses berikutnya
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid atau sudah expired!" });
    }
};

// Middleware tambahan untuk cek Role (Contoh: khusus Petugas)
const isPetugas = (req, res, next) => {
    if (req.user.role !== 'petugas' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses dilarang! Khusus Petugas/Admin." });
    }
    next();
};

module.exports = { verifyToken, isPetugas };