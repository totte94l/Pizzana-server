-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 08 maj 2020 kl 09:15
-- Serverversion: 10.1.35-MariaDB
-- PHP-version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `pizzana`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `menuitems`
--

CREATE TABLE `menuitems` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `ingredients` text NOT NULL,
  `glutenFree` tinyint(1) NOT NULL,
  `lactoseFree` tinyint(1) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `menuitems`
--

INSERT INTO `menuitems` (`id`, `name`, `ingredients`, `glutenFree`, `lactoseFree`, `price`) VALUES
(2, 'Vesuvio', 'Tomatsås, Ost, Skinka', 0, 0, 76),
(3, 'Hawaii', 'Ost, Skinka, Annanas', 0, 0, 119),
(4, 'Capricciosa', 'Tomatsås, Ost, Skinka, Champinjoner (färska)', 0, 0, 119),
(5, 'Vesuvioddsd', 'Ost, Skinka', 0, 0, 76),
(6, 'Vesuvioddsd', 'Ost, Skinka', 0, 0, 76);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered` date NOT NULL,
  `last_login` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `registered`, `last_login`) VALUES
(2, 'admin', '$2a$10$RJ1SKmMx5lfRUHGRTr9wfuJRxzhFnABbg6w36iTHoEmKLlzL4sDJm', '2020-04-30', '2020-05-07');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `menuitems`
--
ALTER TABLE `menuitems`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `menuitems`
--
ALTER TABLE `menuitems`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
