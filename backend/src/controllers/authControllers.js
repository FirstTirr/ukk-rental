const authService = require('../services/authService');
const argon2 = require('argon2'); // Ganti ke argon2
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authService.findUserByUsername(username);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        // Pakai argon2.verify(hash_di_db, password_input)
        const isMatch = await argon2.verify(user.password, password);
        
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.id_user, role: user.nama_role },
            'RAHASIA_UKK_2026',
            { expiresIn: '1d' }
        );

        res.json({ message: "Login Berhasil", token, user: { username: user.username, role: user.nama_role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};