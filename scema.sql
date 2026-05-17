-- 1. Tabel Role
CREATE TABLE `role` (
  `id_role` int(11) NOT NULL AUTO_INCREMENT,
  `nama_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel User
CREATE TABLE `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id_role` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username` (`username`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Category
CREATE TABLE `category` (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `nama_category` varchar(100) NOT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Alat
CREATE TABLE `alat` (
  `id_alat` int(11) NOT NULL AUTO_INCREMENT,
  `id_category` int(11) DEFAULT NULL,
  `nama_alat` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `stok` int(11) NOT NULL,
  `harga_sewa` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_alat`),
  KEY `fk_alat_category` (`id_category`),
  CONSTRAINT `fk_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Peminjaman
CREATE TABLE `peminjaman` (
  `id_peminjaman` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `id_alat` int(11) DEFAULT NULL,
  `id_petugas` int(11) DEFAULT NULL,
  `tgl_kembali_seharusnya` date NOT NULL,
  `tgl_peminjaman` date DEFAULT NULL,
  `status_peminjaman` enum('pending','disetujui','dipinjam','ditolak','dikembalikan','terlambat', 'dibatalkan') DEFAULT NULL,
  `total_bayar` int(11) DEFAULT 0,
  PRIMARY KEY (`id_peminjaman`),
  KEY `id_user` (`id_user`),
  KEY `id_alat` (`id_alat`),
  KEY `id_petugas` (`id_petugas`),
  CONSTRAINT `fk_peminjaman_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `fk_peminjaman_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `user` (`id_user`),
  CONSTRAINT `fk_peminjaman_alat` FOREIGN KEY (`id_alat`) REFERENCES `alat` (`id_alat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Detail Peminjaman
CREATE TABLE `detail_peminjaman` (
  `id_detail` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjaman` int(11) DEFAULT NULL,
  `id_alat` int(11) DEFAULT NULL,
  `jumlah` int(11) NOT NULL,
  PRIMARY KEY (`id_detail`),
  KEY `id_peminjaman` (`id_peminjaman`),
  KEY `id_alat` (`id_alat`),
  CONSTRAINT `fk_detail_peminjaman` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman` (`id_peminjaman`),
  CONSTRAINT `fk_detail_alat` FOREIGN KEY (`id_alat`) REFERENCES `alat` (`id_alat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Pengembalian
CREATE TABLE `pengembalian` (
  `id_pengembalian` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjaman` int(11) DEFAULT NULL,
  `id_petugas` int(11) DEFAULT NULL,
  `tgl_kembali_asli` date DEFAULT NULL,
  `denda` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id_pengembalian`),
  KEY `id_peminjaman` (`id_peminjaman`),
  KEY `id_petugas` (`id_petugas`),
  CONSTRAINT `fk_pengembalian_peminjaman` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman` (`id_peminjaman`),
  CONSTRAINT `fk_pengembalian_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Log Aktivitas
CREATE TABLE `log_aktivitas` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_peminjaman` int(11) DEFAULT NULL,
  `aksi` varchar(100) DEFAULT NULL,
  `waktu` date DEFAULT NULL,
  PRIMARY KEY (`id_log`),
  KEY `id_peminjaman` (`id_peminjaman`),
  CONSTRAINT `fk_log_peminjaman` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman` (`id_peminjaman`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- BAGIAN TRIGGER OTOMATIS (UNTUK STOK & LOG AKTIVITAS)
-- ========================================================
DELIMITER $$

-- 1. Pas status diubah jadi dipinjam, potong stok & catat log
CREATE TRIGGER setelah_alat_dipinjam 
AFTER UPDATE ON peminjaman FOR EACH ROW
BEGIN
    IF NEW.status_peminjaman = 'dipinjam' AND OLD.status_peminjaman <> 'dipinjam' THEN
        UPDATE alat SET stok = stok - 1 WHERE id_alat = NEW.id_alat;
        INSERT INTO log_aktivitas (id_peminjaman, aksi, waktu) 
        VALUES (NEW.id_peminjaman, 'Alat diambil. Stok berkurang 1', NOW());
    END IF;
END$$

-- 2. Pas status diubah jadi dikembalikan, balikin stok & catat log
CREATE TRIGGER setelah_alat_dikembalikan 
AFTER UPDATE ON peminjaman FOR EACH ROW
BEGIN
    IF NEW.status_peminjaman = 'dikembalikan' AND OLD.status_peminjaman <> 'dikembalikan' THEN
        UPDATE alat SET stok = stok + 1 WHERE id_alat = NEW.id_alat;
        INSERT INTO log_aktivitas (id_peminjaman, aksi, waktu) 
        VALUES (NEW.id_peminjaman, 'Alat kembali. Stok bertambah 1', NOW());
    END IF;
END$$

DELIMITER ;