-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 08, 2015 at 09:30 PM
-- Server version: 5.5.46
-- PHP Version: 5.4.45-2+deb.sury.org~precise+2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `persuratan`
--

-- --------------------------------------------------------

--
-- Table structure for table `bagian`
--

CREATE TABLE IF NOT EXISTS `bagian` (
  `idbagian` tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  `bagian` varchar(50) DEFAULT NULL,
  `singkatan` varchar(15) NOT NULL,
  `kodettd` varchar(10) NOT NULL,
  `aktif` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`idbagian`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `bagian`
--

INSERT INTO `bagian` (`idbagian`, `bagian`, `singkatan`, `kodettd`, `aktif`) VALUES
(1, 'Kepala Kejaksaan Tinggi', 'Kajati', 'N.3', 1),
(2, 'Wakil Kepala Kejaksaan Tinggi', 'Wakajati', 'N.3.1', 1),
(3, 'Asisten Pembinaan', 'Asbin', 'N.3.2', 1),
(4, 'Asisten Intelijen', 'Asintel', 'N.3.3', 1),
(6, 'Asisten Pidana Umum', 'Aspidum', 'N.3.4', 1),
(7, 'Asisten Pidana Khusus', 'Aspidsus', 'N.3.5', 1),
(8, 'Asisten Perdata dan Tata Usaha Negara', 'Asdatun', 'N.3.6', 1),
(9, 'Asisten Pengawasan', 'Aswas', 'N.3.7', 1),
(10, 'Kepala Bagian Tata Usaha', 'Kabag TU', 'N.3.8', 1);

-- --------------------------------------------------------

--
-- Table structure for table `disposisi`
--

CREATE TABLE IF NOT EXISTS `disposisi` (
  `iddisposisi` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idsuratmasuk` int(11) unsigned NOT NULL,
  `idbagian` tinyint(4) unsigned NOT NULL,
  PRIMARY KEY (`iddisposisi`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `disposisi`
--

INSERT INTO `disposisi` (`iddisposisi`, `idsuratmasuk`, `idbagian`) VALUES
(9, 32, 4),
(10, 33, 1),
(11, 33, 2),
(14, 32, 3),
(15, 32, 6),
(16, 33, 10),
(25, 40, 3),
(26, 40, 6),
(27, 41, 10),
(28, 42, 6),
(29, 43, 10),
(30, 44, 10),
(31, 45, 9);

-- --------------------------------------------------------

--
-- Table structure for table `jenissurat`
--

CREATE TABLE IF NOT EXISTS `jenissurat` (
  `idjenissurat` tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  `jenissurat` varchar(25) NOT NULL,
  `singkatan` varchar(10) NOT NULL,
  `aktif` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`idjenissurat`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `jenissurat`
--

INSERT INTO `jenissurat` (`idjenissurat`, `jenissurat`, `singkatan`, `aktif`) VALUES
(1, 'Biasa', 'B', 1),
(2, 'Rahasia', 'R', 1),
(3, 'Perintah', 'PRINT', 1),
(4, 'Keputusan', 'KEP', 1);

-- --------------------------------------------------------

--
-- Table structure for table `kodemasalah`
--

CREATE TABLE IF NOT EXISTS `kodemasalah` (
  `idkode` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kodemasalah` varchar(10) NOT NULL,
  `keterangan` text NOT NULL,
  `aktif` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`idkode`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `kodemasalah`
--

INSERT INTO `kodemasalah` (`idkode`, `kodemasalah`, `keterangan`, `aktif`) VALUES
(1, 'Fd.1', 'Pemanggilan Saksi', 1),
(2, 'Cp.3', 'Laporan Bulanan', 1),
(3, 'Fd.2', 'Keterangan', 1),
(4, 'Cs.1', 'Persuratan', 1),
(5, 'Cs.2', 'Protokol Kamdal', 1),
(6, 'Cs.3', 'Keterangan', 1);

-- --------------------------------------------------------

--
-- Table structure for table `surat_keluar`
--

CREATE TABLE IF NOT EXISTS `surat_keluar` (
  `idsurat` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `no_idx_full` varchar(50) DEFAULT NULL,
  `no_index` varchar(10) DEFAULT NULL,
  `idjenissurat` tinyint(4) unsigned DEFAULT NULL,
  `idbagian` tinyint(4) unsigned DEFAULT NULL,
  `idkodemasalah` tinyint(4) unsigned DEFAULT NULL,
  `bulan` varchar(10) NOT NULL,
  `tahun` varchar(4) NOT NULL,
  `tgl_surat` date DEFAULT NULL,
  `no_surat` varchar(50) DEFAULT NULL,
  `dari` varchar(150) DEFAULT NULL,
  `tujuan` varchar(150) DEFAULT NULL,
  `perihal` text,
  `Penandatangan` tinyint(4) DEFAULT NULL,
  `lampiran` varchar(25) DEFAULT NULL,
  `file_document` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idsurat`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=34 ;

--
-- Dumping data for table `surat_keluar`
--

INSERT INTO `surat_keluar` (`idsurat`, `no_idx_full`, `no_index`, `idjenissurat`, `idbagian`, `idkodemasalah`, `bulan`, `tahun`, `tgl_surat`, `no_surat`, `dari`, `tujuan`, `perihal`, `Penandatangan`, `lampiran`, `file_document`) VALUES
(21, 'R-12345/N.3.1/Fd.1/10/2015', '12345', 2, 2, 1, '10', '2015', '2015-10-20', 'WKS-3/9/15', 'Instansi Lain', 'Polda Sumbar', 'Pemindahan Tahanan', 1, '2 lembar', 'odesk_chart_2012.pdf'),
(29, 'B-3333/N.3.3/Fd.1/10/2015', '3333', 1, 4, 1, '10', '2015', '2015-10-25', 'PLLPLSP', 'Asbin', 'Walikota Padang', 'Pemberitahuan', 2, '1 lembar', 'odesk_chart_2014_apr.pdf'),
(30, 'R-3334/N.3.1/Fd.2/10/2015', '3334', 2, 2, 3, '10', '2015', '2015-10-25', NULL, 'Asbin', 'Kepolisian Daerah Sumatera Barat', 'Pemberitahuan Pemindahan tahanan korupsi dari Rutan 1B Bukittinggi Ke Rutan 1A Padang', 2, '2 lembar', ''),
(31, 'R-33335/N.3.2/Fd.1/10/2015', '33335', 2, 3, 1, '10', '2015', '2015-10-26', NULL, 'Asbin', 'Polda Sumbar', 'Pemindahan tahanan dari rutan PN ke rutan 1A Padang', 4, '1 lembar', ''),
(32, 'PRINT-1/N.3.1/Cs.1/11/2015', '1', 3, 2, 4, '11', '2015', '2015-11-01', NULL, 'asbin', 'polda', 'dsds', 2, '', ''),
(33, 'PRINT-2/N.3.2/Cs.1/11/2015', '2', 3, 3, 4, '11', '2015', '2015-11-02', NULL, 'asbin', 'polda', 'ffd', 2, 'f', '');

-- --------------------------------------------------------

--
-- Table structure for table `surat_masuk`
--

CREATE TABLE IF NOT EXISTS `surat_masuk` (
  `idsurat` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `no_idx_full` varchar(50) DEFAULT NULL,
  `idjenissurat` tinyint(4) unsigned DEFAULT NULL,
  `no_index` varchar(10) DEFAULT NULL,
  `tgl_surat` date DEFAULT NULL,
  `tgl_terima` date DEFAULT NULL,
  `tgl_selesai` date DEFAULT NULL,
  `no_surat` varchar(50) DEFAULT NULL,
  `asal_surat` varchar(150) DEFAULT NULL,
  `perihal` text,
  `instruksi` text,
  `lampiran` varchar(25) DEFAULT NULL,
  `file_document` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idsurat`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=46 ;

--
-- Dumping data for table `surat_masuk`
--

INSERT INTO `surat_masuk` (`idsurat`, `no_idx_full`, `idjenissurat`, `no_index`, `tgl_surat`, `tgl_terima`, `tgl_selesai`, `no_surat`, `asal_surat`, `perihal`, `instruksi`, `lampiran`, `file_document`) VALUES
(32, 'B-515115', 1, '515115', '2015-10-24', '2015-10-24', NULL, '123545', 'Kejaksaan Negeri Padang', 'Penyerahan tersangka dan barang bukti atas nama Syafrizal', 'Segera dipenuhi permintaan laporan hasil klarifikasi tersebut. lapor kajati dan file', '2 lembar', 'surat_kejaksaan.jpg'),
(33, 'B-121212', 1, '121212', '2015-10-24', '2015-10-24', NULL, 'PENG - 001/C.4/Cp.2/11/2015', 'Kejaksaan Agung RI', 'Pengumuman Pengadaan Calon Pegawai Negeri Sipil Kejaksaan Republik Indonesia Tahun 2015', 'Segera diumumkan', '8 lembar', 'PENGUMUMAN-pns-kejaksaan.pdf'),
(40, 'PRINT-1', 3, '1', '2015-10-31', '2015-10-31', NULL, '4323232', 'sdds', 'dsds', 'dsds', '', ''),
(41, 'PRINT-2', 3, '2', '2015-10-31', '2015-10-31', NULL, 'dsds', 'ffdf', 'fdfd', 'cvcvcv', '', ''),
(42, 'PRINT-3.a', 3, '3.a', '2015-11-02', '2015-11-02', NULL, '5132', 'dsds', 'dsds', 'dsds', '', ''),
(43, 'PRINT-4', 3, '4', '2015-11-02', '2015-11-02', NULL, '4545456', 'dsdsdsd', 'dsds', 'ddsds', '', ''),
(44, 'PRINT-5', 3, '5', '2015-11-02', '2015-11-02', NULL, '5123213', 'gfddfg', 'gdfg', 'gfdgfd', '', ''),
(45, 'PRINT-6', 3, '6', '2015-11-03', '2015-11-03', NULL, '11511655', 'dffdf', 'fdfd', 'fdfd', '1', 'brief-bastardino-v2-en.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `iduser` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(50) DEFAULT NULL,
  `user` varchar(20) DEFAULT NULL,
  `password` char(64) DEFAULT NULL,
  `iduserlevel` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`iduser`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC AUTO_INCREMENT=10 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`iduser`, `nama_lengkap`, `user`, `password`, `iduserlevel`, `status`) VALUES
(1, 'Administrator', 'admin', '21232f297a57a5a743894a0e4a801fc3', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `userlevel`
--

CREATE TABLE IF NOT EXISTS `userlevel` (
  `iduserlevel` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `userlevel` varchar(25) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`iduserlevel`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC AUTO_INCREMENT=5 ;

--
-- Dumping data for table `userlevel`
--

INSERT INTO `userlevel` (`iduserlevel`, `userlevel`, `status`) VALUES
(1, 'Administrator', 1),
(2, 'Data Entry', NULL),
(4, 'Supervisor', NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
