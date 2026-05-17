const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const alatRoutes = require('./routes/alatRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');

app.use(express.json());

// Gunakan route modular
app.use('/auth/v1', authRoutes);
app.use('/user', userRoutes);
app.use('/', alatRoutes);
app.use('/', categoryRoutes);
app.use('/', peminjamanRoutes);
app.use('/pengembalian', require('./routes/pengembalianRoutes')); // Tambahkan route untuk pengembalian alat

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});