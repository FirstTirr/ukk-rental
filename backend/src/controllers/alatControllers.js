const alatService = require('../services/alatService');

exports.getAllAlat = async (req, res) => {
    try {
        const data = await alatService.getAll();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAlatById = async (req, res) => {
    try {
        const data = await alatService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Alat tidak ditemukan!" });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createAlat = async (req, res) => {
    try {
        await alatService.create(req.body);
        res.json({ message: "Alat berhasil ditambahkan!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateAlat = async (req, res) => {
    try {
        await alatService.update(req.params.id, req.body);
        res.json({ message: "Alat berhasil diperbarui!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteAlat = async (req, res) => {
    try {
        await alatService.delete(req.params.id);
        res.json({ message: "Alat berhasil dihapus!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};