const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const data = await categoryService.getAll();
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getCategoryById = async (req, res) => {
    try {
        const data = await categoryService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        await categoryService.create(req.body.category_name);
        res.json({ message: "Category created!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateCategory = async (req, res) => {
    try {
        await categoryService.update(req.params.id, req.body.category_name);
        res.json({ message: "Category updated!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.delete(req.params.id);
        res.json({ message: "Category deleted!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};