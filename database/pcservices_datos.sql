-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-03-2020 a las 02:29:19
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pcservices`
--

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'ejemplo', 'ejemplo@mail.com', '9999', '2020-02-03 23:20:04'),
(2, 'Companiafalsa', 'fake@mail.com', '9999', '2020-02-03 23:35:26'),
(3, 'tryagani', 'just@test.com', '9999', '2020-02-03 23:36:43');

--
-- Volcado de datos para la tabla `computers`
--

INSERT INTO `computers` (`id`, `company_id`, `brand`, `serial_number`, `QR`, `created_at`) VALUES
(1, 0, 'HP', 'A000000001', NULL, '2020-02-16 20:56:46'),
(2, 0, 'Lenovo', 'A0000002', NULL, '2020-02-16 20:57:31'),
(3, 0, 'Mac', 'A0000000002', NULL, '2020-02-19 02:37:50'),
(4, 0, 'HP', 'A123123', NULL, '2020-02-19 02:38:17'),
(5, 0, 'hp', 'A02020202', NULL, '2020-02-19 02:46:06');

--
-- Volcado de datos para la tabla `reports`
--

INSERT INTO `reports` (`id`, `computer_id`, `company_id`, `user_id`, `service_id`, `visit_start_time`, `visit_end_time`, `description`, `created_at`) VALUES
(1, 1, 1, 1, 1, '2020-02-01 20:10:00', '2020-02-01 23:25:00', 'Todo excelente', '2020-02-24 23:58:38'),
(2, 1, 2, 1, 2, '2020-02-01 20:10:00', '2020-02-01 23:25:00', 'Un excelente computo', '2020-02-25 00:23:43'),
(3, 2, 2, 1, 2, '2020-02-06 12:30:00', '2020-02-03 00:26:00', 'dasdasd', '2020-02-25 00:24:37'),
(4, 5, 1, 1, 1, '2020-03-01 00:30:00', '2020-03-01 01:30:00', 'Una visita rapida', '2020-02-26 02:29:35');

--
-- Volcado de datos para la tabla `services`
--

INSERT INTO `services` (`id`, `name`, `created_at`) VALUES
(1, 'Preventivo', '2020-02-24 19:09:06'),
(2, 'Correctivo', '2020-02-24 19:09:16');

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `created_at`) VALUES
(1, 'test', 'man', 'test@mail.com', '9999', '0000-00-00 00:00:00'),
(2, 'David', 'Salazar', 'david@mail.com', '9999', '2020-02-03 06:00:00'),
(3, 'Prueba', 'numero2', 'prueba2@mail.com', '9999', '2020-02-03 06:00:00'),
(4, 'test', 'prueba3', 'prueba3@mail.com', '9999', '2020-02-03 06:00:00'),
(6, 'juanito', 'perez', 'juanito@mail.com', '9999', '2020-02-12 02:42:32');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
