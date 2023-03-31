-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2023 at 06:48 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `omegashopdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Member','Admin') NOT NULL DEFAULT 'Member',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address_street` varchar(255) NOT NULL,
  `address_city` varchar(100) NOT NULL,
  `address_state` varchar(100) NOT NULL,
  `address_zip` varchar(50) NOT NULL,
  `address_country` varchar(100) NOT NULL,
  `registered` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `email`, `password`, `role`, `first_name`, `last_name`, `address_street`, `address_city`, `address_state`, `address_zip`, `address_country`, `registered`) VALUES
(1, 'admin@website.com', '$2y$10$tP0LqqfIrf6xf23MTWnrFuxGNnkdx7Fue5Zb3MnnMNidjNPg23vXO', 'Admin', 'Admin', 'Admin', 'Highway To Success', 'Highway', 'Top', '369321', 'USA', '2023-03-31 19:41:10'),
(2, 'member@website.com', '$2y$10$CLKulh.a/oQW9hZ4h1ZkPuC4CZuT1/2I7O17HlEANPmBG7HO9LmrW', 'Member', 'Member', 'Member', 'Highway To Success', 'Highway', 'Top', '369321', 'USA', '2023-03-31 19:44:11');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `parent_id`) VALUES
(3, 'Sale', 0),
(4, 'Accessories', 0),
(5, 'Women', 0),
(6, 'Men', 0);

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE `discounts` (
  `id` int(11) NOT NULL,
  `category_ids` varchar(50) NOT NULL,
  `product_ids` varchar(50) NOT NULL,
  `discount_code` varchar(50) NOT NULL,
  `discount_type` enum('Percentage','Fixed') NOT NULL,
  `discount_value` decimal(7,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `discounts`
--

INSERT INTO `discounts` (`id`, `category_ids`, `product_ids`, `discount_code`, `discount_type`, `discount_value`, `start_date`, `end_date`) VALUES
(1, '', '', 'aredeundearevaloare', 'Percentage', '5.00', '2022-01-01 00:00:00', '2022-12-31 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `date_uploaded` datetime NOT NULL DEFAULT current_timestamp(),
  `full_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `title`, `caption`, `date_uploaded`, `full_path`) VALUES
(1, 'Watch Front', '', '2022-02-14 15:58:10', 'uploads/watch.jpg'),
(2, 'Watch Side', '', '2022-02-14 15:58:10', 'uploads/watch-2.jpg'),
(3, 'Watch Back', '', '2022-02-14 15:58:10', 'uploads/watch-3.jpg'),
(4, 'Wallet', '', '2022-02-15 02:06:00', 'uploads/wallet.jpg'),
(5, 'Camera', '', '2022-03-04 16:03:37', 'uploads/camera.jpg'),
(6, 'Headphones', '', '2022-03-04 16:03:37', 'uploads/headphones.jpg'),
(7, 'Travis Shoes', '', '2022-09-13 15:22:23', 'uploads/product-card-v2-img-4b.jpg'),
(8, '2-product-card-v2-img-2a.jpg', '', '2022-09-13 16:14:51', 'uploads/product-card-v2-img-2a.jpg'),
(9, '2-product-card-v2-img-1a.jpg', '', '2022-09-13 16:15:22', 'uploads/product-card-v2-img-1a.jpg'),
(10, '2-gallery-img-2.jpg', '', '2022-09-13 16:16:10', 'uploads/gallery-img-2.jpg'),
(11, '2-product-card-v2-img-5a.jpg', '', '2022-09-13 16:16:49', 'uploads/product-card-v2-img-5a.jpg'),
(12, '2-product-card-v2-img-6b.jpg', '', '2022-09-13 16:17:26', 'uploads/product-card-v2-img-6b.jpg'),
(13, '2-product-card-v2-img-7b.jpg', '', '2022-09-13 16:18:21', 'uploads/product-card-v2-img-7b.jpg'),
(14, '2-gallery-img-6.jpg', '', '2022-09-13 16:18:44', 'uploads/gallery-img-6.jpg'),
(15, '2-product-card-v2-img-8a.jpg', '', '2022-09-13 16:19:09', 'uploads/product-card-v2-img-8a.jpg'),
(16, '3-mega-site-nav-img-1.jpg', '', '2022-09-13 16:19:35', 'uploads/mega-site-nav-img-1.jpg'),
(17, '2-mega-site-nav-img-2.jpg', '', '2022-09-13 16:20:07', 'uploads/mega-site-nav-img-2.jpg'),
(18, '2-mega-site-nav-img-3.jpg', '', '2022-09-13 16:20:37', 'uploads/mega-site-nav-img-3.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `rrp` decimal(7,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL,
  `date_added` datetime NOT NULL DEFAULT current_timestamp(),
  `weight` decimal(7,2) NOT NULL DEFAULT 0.00,
  `url_slug` varchar(255) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `rrp`, `quantity`, `date_added`, `weight`, `url_slug`, `status`) VALUES
(1, 'Watch', '<p>Unique watch made with stainless steel.</p>\r\n</br>\r\n<ul>\r\n<li style=\"font-size: 18px;\">• Powered by Android with built-in apps.</li>\r\n<li style=\"font-size: 18px;\">• Adjustable to fit most.</li>\r\n<li style=\"font-size: 18px;\">• Long battery life, continuous wear for up to 2 days.</li>\r\n<li style=\"font-size: 18px;\">• Lightweight design, comfort on your wrist.</li>\r\n</ul>', '29.99', '0.00', -1, '2022-01-01 00:00:00', '0.00', 'smart-watch', 1),
(2, 'Wallet', '', '14.99', '19.99', -1, '2022-01-01 00:00:00', '0.00', '', 1),
(3, 'Headphones', '', '19.99', '0.00', -1, '2022-01-01 00:00:00', '34.00', '', 1),
(4, 'Digital Camera', '', '269.99', '0.00', -1, '2022-01-01 00:00:00', '0.00', '', 1),
(5, 'Travis Shoes', '', '429.99', '0.00', -1, '2022-09-13 15:32:00', '0.00', '', 1),
(6, 'Blue Jeans', '', '79.99', '0.00', -1, '2022-09-13 16:14:00', '0.00', '', 1),
(7, 'Brown Coat', '', '89.99', '0.00', -1, '2022-09-13 16:14:00', '0.00', '', 1),
(8, 'Unisex Shoes', '', '49.99', '0.00', -1, '2022-09-13 16:15:00', '0.00', '', 1),
(9, 'Boots', '', '69.99', '0.00', -1, '2022-09-13 16:16:00', '0.00', '', 1),
(10, 'Unisex T-shirt', '', '39.99', '0.00', -1, '2022-09-13 16:16:00', '0.00', '', 1),
(11, 'Unisex T-shirt', '', '39.99', '0.00', -1, '2022-09-13 16:17:00', '0.00', '', 1),
(12, 'White Jacket', '', '89.99', '0.00', -1, '2022-09-13 16:18:00', '0.00', '', 1),
(13, 'Women Watch', '', '29.99', '0.00', -1, '2022-09-13 16:18:00', '0.00', '', 1),
(14, 'Nike Red Shoes', '', '59.99', '0.00', -1, '2022-09-13 16:19:00', '0.00', '', 1),
(15, 'Nike Black Shoes', '', '59.99', '0.00', -1, '2022-09-13 16:19:00', '0.00', '', 1),
(16, 'Nike Unisex Shoes', '', '59.99', '0.00', -1, '2022-09-13 16:20:00', '0.00', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products_categories`
--

CREATE TABLE `products_categories` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products_categories`
--

INSERT INTO `products_categories` (`id`, `product_id`, `category_id`) VALUES
(17, 1, 4),
(19, 2, 3),
(20, 2, 4),
(21, 3, 4),
(23, 4, 4),
(24, 5, 6),
(25, 6, 6),
(26, 7, 5),
(29, 8, 5),
(30, 8, 6),
(31, 9, 6),
(32, 10, 5),
(33, 10, 6),
(34, 11, 5),
(35, 11, 6),
(36, 12, 6),
(37, 13, 5),
(38, 14, 5),
(39, 14, 6),
(40, 15, 5),
(41, 15, 6),
(42, 16, 5),
(43, 16, 6);

-- --------------------------------------------------------

--
-- Table structure for table `products_downloads`
--

CREATE TABLE `products_downloads` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `products_media`
--

CREATE TABLE `products_media` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products_media`
--

INSERT INTO `products_media` (`id`, `product_id`, `media_id`, `position`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 1, 3, 3),
(4, 2, 4, 1),
(5, 3, 6, 1),
(6, 4, 5, 1),
(7, 5, 7, 1),
(13, 7, 9, 1),
(14, 8, 10, 1),
(15, 9, 11, 1),
(16, 10, 12, 1),
(17, 11, 13, 1),
(18, 12, 14, 1),
(19, 13, 15, 1),
(20, 14, 16, 1),
(21, 15, 17, 1),
(22, 16, 18, 1),
(24, 6, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products_options`
--

CREATE TABLE `products_options` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `price_modifier` enum('add','subtract') NOT NULL,
  `weight` decimal(7,2) NOT NULL,
  `weight_modifier` enum('add','subtract') NOT NULL,
  `type` enum('select','radio','checkbox','text','datetime') NOT NULL,
  `required` tinyint(1) NOT NULL,
  `position` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products_options`
--

INSERT INTO `products_options` (`id`, `title`, `name`, `quantity`, `price`, `price_modifier`, `weight`, `weight_modifier`, `type`, `required`, `position`, `product_id`) VALUES
(1, 'Size', 'Small', -1, '0.00', 'add', '0.00', 'add', 'select', 1, 1, 1),
(2, 'Size', 'Large', -1, '10.00', 'add', '0.00', 'add', 'select', 1, 1, 1),
(3, 'Type', 'Standard', -1, '0.00', 'add', '0.00', 'add', 'radio', 1, 2, 1),
(4, 'Type', 'Deluxe', -1, '10.00', 'add', '0.00', 'add', 'radio', 1, 2, 1),
(33, 'Color', 'Black', -1, '0.00', 'add', '0.00', 'add', 'radio', 0, 3, 1),
(34, 'Color', 'White', -1, '0.00', 'add', '0.00', 'add', 'radio', 0, 3, 1),
(35, 'Color', 'Red', -1, '0.00', 'add', '0.00', 'add', 'radio', 0, 3, 1),
(36, 'Color', 'Blue', -1, '0.00', 'add', '0.00', 'add', 'radio', 0, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Single Product','Entire Order') NOT NULL DEFAULT 'Single Product',
  `countries` varchar(255) NOT NULL DEFAULT '',
  `price_from` decimal(7,2) NOT NULL,
  `price_to` decimal(7,2) NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `weight_from` decimal(7,2) NOT NULL DEFAULT 0.00,
  `weight_to` decimal(7,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`id`, `name`, `type`, `countries`, `price_from`, `price_to`, `price`, `weight_from`, `weight_to`) VALUES
(1, 'Standard', 'Entire Order', '', '0.00', '999.00', '3.99', '0.00', '999.00'),
(2, 'Express', 'Entire Order', '', '0.00', '999.00', '7.99', '0.00', '999.00');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `user_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`user_id`, `email`) VALUES
(1, 'andrewblacksmith1@gmail.com'),
(2, 'admin@website.com'),
(3, 'andrewblacksmith2@yahoo.com');

-- --------------------------------------------------------

--
-- Table structure for table `taxes`
--

CREATE TABLE `taxes` (
  `id` int(11) NOT NULL,
  `country` varchar(255) NOT NULL,
  `rate` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxes`
--

INSERT INTO `taxes` (`id`, `country`, `rate`) VALUES
(1, 'Romania', '19.00');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `user_name` varchar(60) NOT NULL,
  `user_email` varchar(60) NOT NULL,
  `user_message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `user_name`, `user_email`, `user_message`) VALUES
(1, 'Andrew', 'andrewblacksmith1@gmail.com', 'aha'),
(2, 'Admin', 'admin@website.com', 'ye. yaya'),
(3, 'Andrew', 'andrewblacksmith@yahoo.com', 'ye');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `txn_id` varchar(255) NOT NULL,
  `payment_amount` decimal(7,2) NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `created` datetime NOT NULL,
  `payer_email` varchar(255) NOT NULL DEFAULT '',
  `first_name` varchar(100) NOT NULL DEFAULT '',
  `last_name` varchar(100) NOT NULL DEFAULT '',
  `address_street` varchar(255) NOT NULL DEFAULT '',
  `address_city` varchar(100) NOT NULL DEFAULT '',
  `address_state` varchar(100) NOT NULL DEFAULT '',
  `address_zip` varchar(50) NOT NULL DEFAULT '',
  `address_country` varchar(100) NOT NULL DEFAULT '',
  `account_id` int(11) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'website',
  `shipping_method` varchar(255) NOT NULL DEFAULT '',
  `shipping_amount` decimal(7,2) NOT NULL DEFAULT 0.00,
  `discount_code` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `txn_id`, `payment_amount`, `payment_status`, `created`, `payer_email`, `first_name`, `last_name`, `address_street`, `address_city`, `address_state`, `address_zip`, `address_country`, `account_id`, `payment_method`, `shipping_method`, `shipping_amount`, `discount_code`) VALUES
(1, 'SC63363112EFB964D907', '23.98', 'Completed', '2022-09-30 01:58:10', 'admin@website.com', 'John', 'Doe', '98 High Street', 'New York', 'NY', '10001', 'Tuvalu', 1, 'website', 'Standard', '3.99', ''),
(2, 'SC6336313040C64DF3A6', '519.68', 'Completed', '2022-09-30 01:58:40', 'andrewblacksmith@yahoo.com', 'Andrew', 'Blacksmith', '55 Muncii', 'Bucharest', 'Ialomiţa', '925300', 'Uganda', 2, 'website', 'Express', '7.99', ''),
(3, 'SC633632503C4BCD4953', '93.98', 'Completed', '2022-09-30 02:03:28', 'admin@website.com', 'John', 'Doe', '98 High Street', 'New York', 'NY', '10001', 'Tuvalu', 1, 'website', 'Standard', '3.99', ''),
(4, 'SC6340722E0469FF43E9', '63.48', 'Completed', '2022-10-07 20:38:38', 'andrewblacksmith1@gmail.com', 'Andrew', 'Blacksmith', '4 Muncii', 'Bucharest', 'Bucharest', '925300', 'Florida', NULL, 'website', 'Standard', '3.99', '');

-- --------------------------------------------------------

--
-- Table structure for table `transactions_items`
--

CREATE TABLE `transactions_items` (
  `id` int(11) NOT NULL,
  `txn_id` varchar(255) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_price` decimal(7,2) NOT NULL,
  `item_quantity` int(11) NOT NULL,
  `item_options` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions_items`
--

INSERT INTO `transactions_items` (`id`, `txn_id`, `item_id`, `item_price`, `item_quantity`, `item_options`) VALUES
(1, 'SC63363112EFB964D907', 3, '19.99', 1, ''),
(2, 'SC6336313040C64DF3A6', 5, '511.69', 1, ''),
(3, 'SC633632503C4BCD4953', 7, '89.99', 1, ''),
(4, 'SC6340722E0469FF43E9', 1, '59.49', 1, 'Size-Large,Type-Deluxe,Color-White');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_categories`
--
ALTER TABLE `products_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`,`category_id`);

--
-- Indexes for table `products_downloads`
--
ALTER TABLE `products_downloads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`,`file_path`);

--
-- Indexes for table `products_media`
--
ALTER TABLE `products_media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_options`
--
ALTER TABLE `products_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`,`title`,`name`) USING BTREE;

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `taxes`
--
ALTER TABLE `taxes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `txn_id` (`txn_id`);

--
-- Indexes for table `transactions_items`
--
ALTER TABLE `transactions_items`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products_categories`
--
ALTER TABLE `products_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `products_downloads`
--
ALTER TABLE `products_downloads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_media`
--
ALTER TABLE `products_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `products_options`
--
ALTER TABLE `products_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transactions_items`
--
ALTER TABLE `transactions_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
