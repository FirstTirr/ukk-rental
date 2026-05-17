const userService = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        await userService.create(req.body); 
        res.status(201).json({ message: "User berhasil dibuat!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        await userService.update(req.params.id, req.body);
        res.json({ message: "User berhasil diperbarui!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const data = await userService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const data = await userService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.delete(req.params.id);
        res.json({ message: "User berhasil dihapus!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};