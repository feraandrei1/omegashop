<?php
// Function that will connect to the MySQL database
function pdo_connect_mysql()
{
    try {
        // Connect to the MySQL database using the PDO interface
        $pdo = new PDO('mysql:host=' . db_host . ';dbname=' . db_name . ';charset=utf8', db_user, db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }
    catch (PDOException $exception) {
        // Could not connect to the MySQL database! If you encounter this error, ensure your db settings are correct in the config file!
        exit('Failed to connect to database!');
    }
}
// Function to retrieve a product from cart by the ID and options string
function &get_cart_product($id, $options)
{
    $p = null;
    if (isset($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as &$product) {
            if ($product['id'] == $id && $product['options'] == $options) {
                $p = & $product;
                return $p;
            }
        }
    }
    return $p;
}
// Populate categories function
function populate_categories($categories, $selected = 0, $parent_id = 0, $n = 0)
{
    $html = '';
    foreach ($categories as $category) {
        if ($parent_id == $category['parent_id']) {
            $html .= '<option value="' . $category['id'] . '"' . ($selected == $category['id'] ? ' selected' : '') . '>' . str_repeat('--', $n) . ' ' . $category['name'] . '</option>';
            $html .= populate_categories($categories, $selected, $category['id'], $n + 1);
        }
    }
    return $html;
}
// Get country list
function get_countries()
{
    return ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
}
// Send order details email function
function send_order_details_email($email, $products, $first_name, $last_name, $address_street, $address_city, $address_state, $address_zip, $address_country, $subtotal, $order_id)
{
    // Send payment notification to webmaster
    if (email_notifications) {
        $subject = 'You have received a new order!';
        $headers = 'From: ' . mail_from . "\r\n" . 'Reply-To: ' . $email . "\r\n" . 'Return-Path: ' . mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion() . "\r\n" . 'MIME-Version: 1.0' . "\r\n" . 'Content-Type: text/html; charset=UTF-8' . "\r\n";
        ob_start();
        include 'order-notification-template.php';
        $order_notification_template = ob_get_clean();
        mail(email, $subject, $order_notification_template, $headers);
    }
    if (!mail_enabled) {
        return;
    }
    $subject = 'Order Details';
    $headers = 'From: ' . mail_from . "\r\n" . 'Reply-To: ' . mail_from . "\r\n" . 'Return-Path: ' . mail_from . "\r\n" . 'X-Mailer: PHP/' . phpversion() . "\r\n" . 'MIME-Version: 1.0' . "\r\n" . 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    ob_start();
    include 'order-details-template.php';
    $order_details_template = ob_get_clean();
    mail($email, $subject, $order_details_template, $headers);
}

// Template header, feel free to customize this
function template_header($title, $head = '')
{    // Get the amount of items in the cart, this will be displayed in the header.    
$num_items_in_cart = isset($_SESSION['cart']) ? array_sum(array_column($_SESSION['cart'], 'quantity')) : 0;    
$home_link = url('index.php');    
$products_link = url('index.php?page=products');    
$myaccount_link = url('index.php?page=myaccount');    
$cart_link = url('index.php?page=cart');    
$admin_link = isset($_SESSION['account_loggedin'], $_SESSION['account_role']) && $_SESSION['account_role'] == 'Admin' ? '<a href="' . base_url . 'admin/index.php" target="_blank">Admin</a>' : '';    
$logout_link = isset($_SESSION['account_loggedin']) ? '<a title="Logout" href="' . url('index.php?page=logout') . '"><i class="fas fa-sign-out-alt"></i></a>' : '';

$appear_just_when_logged_in = isset($_SESSION['account_loggedin']) ?
                    '<ul class="dropdown__menu" aria-label="submenu" data-theme="default">
                    <li><a href="index.php?page=myaccount" class="dropdown__item">Orders</a></li>
                    <li><a href="index.php?page=myaccount&tab=settings" class="dropdown__item">Account Settings</a></li>
                    <li><a href="index.php?page=logout" class="dropdown__item">Log out</a></li>
                    </ul>' 

                    :

                    '<ul class="dropdown__menu" aria-label="submenu" data-theme="default"></ul>';

$site_name = site_name;    
$base_url = base_url;    
// DO NOT INDENT THE BELOW CODE
echo <<<EOT
<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,minimum-scale=1">
	<title>$title</title>

  <link rel="icon" type="image/png" href="omega.png">
	<link href="{$base_url}style.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="assets/css/style.css">

  <link href="filtering/reset.css" rel="stylesheet">
  <link href="filtering/style.css" rel="stylesheet">
  <link href="filtering/1_accordion.css" rel="stylesheet">
  <link href="filtering/1_custom-select.css" rel="stylesheet">
  <link href="filtering/1_filter.css" rel="stylesheet">
  <link href="filtering/1_number-input.css" rel="stylesheet">
  <link href="1_radios-checkboxes.css" rel="stylesheet">
  <link href="filtering/1_read-more.css" rel="stylesheet">
  <link href="filtering/1_responsive-sidebar.css" rel="stylesheet">
  <link href="filtering/1_search-input.css" rel="stylesheet">
  <link href="filtering/1_slider.css" rel="stylesheet">
  <link href="filtering/2_slider-multi-value.css" rel="stylesheet">
  <link href="filtering/3_advanced-filter.css" rel="stylesheet">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.0.0/css/all.css">
  <link href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" rel="stylesheet">

  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Zilla+Slab">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Space+Mono">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono">

  $head
	</head>

	<body>
  <header
    class="mega-nav mega-nav--border-bottom mega-nav--mobile mega-nav--desktop@md bg position-relative hide-nav ie:bg js-mega-nav js-hide-nav js-hide-nav--main"
    data-nav-target-class="mega-nav--expanded">
    <div class="mega-nav__container">
      <!-- 👇 logo -->
      <a href="index.php" class="mega-nav__logo">
        <img src="omega.png">
      </a>

      <!-- 👇 icon buttons --mobile -->
      <div class="mega-nav__icon-btns mega-nav__icon-btns--mobile">
        <a href="$cart_link" class="mega-nav__icon-btn">
          <svg class="icon" viewBox="0 0 24 24">
            <title>Go to cart page</title>
            <g class="icon__group" fill="none" stroke-linecap="square" stroke-linejoin="miter" stroke="currentColor">
              <polyline points="4,4 22,4 19,14 4,14 "></polyline>
              <circle cx="4" cy="22" r="2" fill="currentColor" stroke="none"></circle>
              <circle cx="20" cy="22" r="2" fill="currentColor" stroke="none"></circle>
              <polyline points="1,1 4,4 4,14 2,18 23,18 " stroke-linecap="butt"></polyline>
            </g>
          </svg>
        </a>

        <button class="reset mega-nav__icon-btn mega-nav__icon-btn--menu js-mega-nav-trigger js-tab-focus"
          aria-label="Toggle menu" aria-controls="mega-nav-navigation">
          <svg class="icon" viewBox="0 0 24 24">
            <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10">
              <path d="M1 6h22" />
              <path d="M1 12h22" />
              <path d="M1 18h22" />
            </g>
          </svg>
        </button>
      </div>

      <div class="mega-nav__nav js-mega-nav__nav" id="mega-nav-navigation" role="navigation" aria-label="Main">
        <div class="mega-nav__nav-inner">
          <ul class="mega-nav__items">
            <li class="mega-nav__label">Menu</li>

            <!-- 👇 layout 1 -> tabbed content -->
            <li class="mega-nav__item js-mega-nav__item">
              <button class="reset mega-nav__control js-mega-nav__control js-tab-focus">
                New
                <i class="mega-nav__arrow-icon" aria-hidden="true">
                  <svg class="icon" viewBox="0 0 16 16">
                    <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                      stroke-miterlimit="10">
                      <path d="M2 2l12 12" />
                      <path d="M14 2L2 14" />
                    </g>
                  </svg>
                </i>
              </button>

              <div class="mega-nav__sub-nav-wrapper">
                <div class="mega-nav__sub-nav mega-nav__sub-nav--layout-1">
                  <!-- 👇 links - visible on mobile -->
                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__sub-item">
                      <a href="index.php?page=product&id=14" class="mega-nav__sub-link">
                        <span class="flex items-center gap-xs">
                          <img class="block width-lg height-lg radius-50% object-cover"
                            src="assets/img/mega-site-nav-img-1.jpg" alt="Image description">
                          <i>Nike Red Shoes</i>
                        </span>
                      </a>
                    </li>

                    <li class="mega-nav__sub-item">
                      <a href="index.php?page=product&id=15" class="mega-nav__sub-link">
                        <span class="flex items-center gap-xs">
                          <img class="block width-lg height-lg radius-50% object-cover"
                            src="assets/img/mega-site-nav-img-2.jpg" alt="Image description">
                          <i>Nike Black Shoes</i>
                        </span>
                      </a>
                    </li>

                    <li class="mega-nav__sub-item">
                      <a href="index.php?page=product&id=16" class="mega-nav__sub-link">
                        <span class="flex items-center gap-xs">
                          <img class="block width-lg height-lg radius-50% object-cover"
                            src="assets/img/mega-site-nav-img-3.jpg" alt="Image description">
                          <i>Nike Unisex Shoes</i>
                        </span>
                      </a>
                    </li>
                  </ul>

                  <!-- 👇 tabs - visible on desktop -->
                  <div class="mega-nav__tabs grid gap-lg js-tabs">
                    <ul class="col-4 mega-nav__tabs-controls js-tabs__controls" aria-label="Select a product">
                      <li>
                        <a href="index.php?page=product&id=14" class="mega-nav__tabs-control js-tab-focus" aria-selected="true">
                          <span class="flex items-center gap-xs">
                            <img class="block width-lg height-lg radius-50% object-cover"
                              src="assets/img/mega-site-nav-img-1.jpg" alt="Image description">

                            <i class="margin-right-xxxs">Nike Red Shoes</i>

                            <svg class="icon icon--xs margin-left-auto" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M5,2l6,6L5,14" fill="none" stroke="currentColor" stroke-linecap="square"
                                stroke-miterlimit="10" stroke-width="1" />
                            </svg>
                          </span>
                        </a>
                      </li>

                      <li>
                        <a href="index.php?page=product&id=15" class="mega-nav__tabs-control js-tab-focus" aria-selected="true">
                          <span class="flex items-center gap-xs">
                            <img class="block width-lg height-lg radius-50% object-cover"
                              src="assets/img/mega-site-nav-img-2.jpg" alt="Image description">

                            <i class="margin-right-xxxs">Nike Black Shoes</i>

                            <svg class="icon icon--xs margin-left-auto" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M5,2l6,6L5,14" fill="none" stroke="currentColor" stroke-linecap="square"
                                stroke-miterlimit="10" stroke-width="1" />
                            </svg>
                          </span>
                        </a>
                      </li>

                      <li>
                        <a href="index.php?page=product&id=16" class="mega-nav__tabs-control js-tab-focus" aria-selected="true">
                          <span class="flex items-center gap-xs">
                            <img class="block width-lg height-lg radius-50% object-cover"
                              src="assets/img/mega-site-nav-img-3.jpg" alt="Image description">

                            <i class="margin-right-xxxs">Nike Unisex Shoes</i>

                            <svg class="icon icon--xs margin-left-auto" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M5,2l6,6L5,14" fill="none" stroke="currentColor" stroke-linecap="square"
                                stroke-miterlimit="10" stroke-width="1" />
                            </svg>
                          </span>
                        </a>
                      </li>
                    </ul>

                    <div class="col-8 js-tabs__panels">
                      <section id="tabProduct1" class="mega-nav__tabs-panel js-tabs__panel">
                        <a href="index.php?page=product&id=14" class="mega-nav__tabs-img margin-bottom-md">
                          <img class="block width-100%" src="assets/img/mega-site-nav-img-1.jpg"
                            alt="Image description">
                        </a>

                        <div class="text-component">
                          <h1 class="text-xl">Nike Red Shoes</h1>
                          <p class="color-contrast-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Amet, quaerat.</p>
                          <p><a href="index.php?page=product&id=14" class="btn btn--subtle">Shop Now</a></p>
                        </div>
                      </section>

                      <section id="tabProduct2" class="mega-nav__tabs-panel js-tabs__panel">
                        <a href="index.php?page=product&id=15" class="mega-nav__tabs-img margin-bottom-md">
                          <img class="block width-100%" src="assets/img/mega-site-nav-img-2.jpg"
                            alt="Image description">
                        </a>

                        <div class="text-component">
                          <h1 class="text-xl">Nike Black Shoes</h1>
                          <p class="color-contrast-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Amet, quaerat.</p>
                          <p><a href="index.php?page=product&id=15" class="btn btn--subtle">Shop Now</a></p>
                        </div>
                      </section>

                      <section id="tabProduct3" class="mega-nav__tabs-panel js-tabs__panel">
                        <a href="index.php?page=product&id=16" class="mega-nav__tabs-img margin-bottom-md">
                          <img class="block width-100%" src="assets/img/mega-site-nav-img-3.jpg"
                            alt="Image description">
                        </a>

                        <div class="text-component">
                          <h1 class="text-xl">Nike Unisex Shoes</h1>
                          <p class="color-contrast-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Amet, quaerat.</p>
                          <p><a href="index.php?page=product&id=16" class="btn btn--subtle">Shop Now</a></p>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- 👇 layout 2 -> multiple lists -->
            <li class="mega-nav__item js-mega-nav__item">
              <button class="reset mega-nav__control js-mega-nav__control js-tab-focus">
                Products
                <i class="mega-nav__arrow-icon" aria-hidden="true">
                  <svg class="icon" viewBox="0 0 16 16">
                    <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                      stroke-miterlimit="10">
                      <path d="M2 2l12 12" />
                      <path d="M14 2L2 14" />
                    </g>
                  </svg>
                </i>
              </button>

              <div class="mega-nav__sub-nav-wrapper">
                <div class="mega-nav__sub-nav mega-nav__sub-nav--layout-2">
                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__label">Shop</li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=products" class="mega-nav__sub-link">All Products</a>
                    </li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=categories"
                        class="mega-nav__sub-link">Categories</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=products" class="mega-nav__sub-link">Women</a>
                    </li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=products" class="mega-nav__sub-link">Men</a>
                    </li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=products" class="mega-nav__sub-link">Kids</a>
                    </li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=products" class="mega-nav__sub-link">Pets</a>
                    </li>
                  </ul>

                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__label">Others</li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Inspirational</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Desingners</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Locations</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Releases</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Brands</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Sales</a>
                    </li>
                  </ul>

                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__label">Blog</li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Omega Club</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Connections</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Sustainability</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">About us</a></li>
                    <li class="mega-nav__sub-item"><a href="" class="mega-nav__sub-link">Related</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=blog" class="mega-nav__sub-link">Blog</a></li>
                  </ul>

                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__label">Account</li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=myaccount" class="mega-nav__sub-link">Log In</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=register"
                        class="mega-nav__sub-link">Register</a></li>
                    <li class="mega-nav__sub-item"><a href="#0" class="mega-nav__sub-link">Wishlist</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=myaccount" class="mega-nav__sub-link">Orders</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=myaccount&tab=settings"
                        class="mega-nav__sub-link">Account Settings</a></li>
                    <li class="mega-nav__sub-item"><a href="#0"
                        class="mega-nav__sub-link">Payment Methods</a></li>
                  </ul>

                  <div class="mega-nav__card width-100% max-width-xs margin-x-auto">
                    <a href="index.php?page=products" class="block overflow-hidden">
                      <figure class="aspect-ratio-4:3">
                        <img class="block width-100%" src="assets/img/mega-site-nav-img-1.jpg" alt="Image description">
                      </figure>
                    </a>

                    <div class="margin-top-sm">
                      <h3 class="text-base"><a href="index.php?page=products" class="mega-nav__card-title">Browse all →</a></h3>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- 👇 layout 3 -> gallery -->
            <li class="mega-nav__item js-mega-nav__item">
              <button class="reset mega-nav__control js-mega-nav__control js-tab-focus">
                Gallery
                <i class="mega-nav__arrow-icon" aria-hidden="true">
                  <svg class="icon" viewBox="0 0 16 16">
                    <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                      stroke-miterlimit="10">
                      <path d="M2 2l12 12" />
                      <path d="M14 2L2 14" />
                    </g>
                  </svg>
                </i>
              </button>

              <div class="mega-nav__sub-nav-wrapper">
                <div class="mega-nav__sub-nav mega-nav__sub-nav--layout-3">
                  <div class="mega-nav__card">
                    <a href="index.php?page=products" class="block overflow-hidden">
                      <figure class="aspect-ratio-4:3">
                        <img class="block width-100%" src="assets/img/mega-site-nav-img-4.jpg" alt="Image description">
                      </figure>
                    </a>

                    <div class="margin-top-sm">
                      <h3 class="text-base"><a href="index.php?page=products" class="mega-nav__card-title">Clothing</a></h3>
                    </div>
                  </div>

                  <div class="mega-nav__card">
                    <a href="index.php?page=products" class="block overflow-hidden">
                      <figure class="aspect-ratio-4:3">
                        <img class="block width-100%" src="assets/img/mega-site-nav-img-5.jpg" alt="Image description">
                      </figure>
                    </a>

                    <div class="margin-top-sm">
                      <h3 class="text-base"><a href="index.php?page=products" class="mega-nav__card-title">Shoes</a></h3>
                    </div>
                  </div>

                  <div class="mega-nav__card">
                    <a href="index.php?page=products" class="block overflow-hidden">
                      <figure class="aspect-ratio-4:3">
                        <img class="block width-100%" src="assets/img/mega-site-nav-img-6.jpg" alt="Image description">
                      </figure>
                    </a>

                    <div class="margin-top-sm">
                      <h3 class="text-base"><a href="index.php?page=products" class="mega-nav__card-title">Home</a></h3>
                    </div>
                  </div>

                  <div class="mega-nav__card">
                    <a href="index.php?page=products" class="block overflow-hidden">
                      <figure class="aspect-ratio-4:3">
                        <img class="block width-100%" src="assets/img/mega-site-nav-img-7.jpg" alt="Image description">
                      </figure>
                    </a>

                    <div class="margin-top-sm">
                      <h3 class="text-base"><a href="index.php?page=products" class="mega-nav__card-title">Accessories</a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- 👇 layout 4 -> single list -->
            <li class="mega-nav__item js-mega-nav__item">
              <button class="reset mega-nav__control js-mega-nav__control js-tab-focus">
                Support
                <i class="mega-nav__arrow-icon" aria-hidden="true">
                  <svg class="icon" viewBox="0 0 16 16">
                    <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                      stroke-miterlimit="10">
                      <path d="M2 2l12 12" />
                      <path d="M14 2L2 14" />
                    </g>
                  </svg>
                </i>
              </button>

              <div class="mega-nav__sub-nav-wrapper">
                <div class="mega-nav__sub-nav mega-nav__sub-nav--layout-4">
                  <ul class="mega-nav__sub-items">
                    <li class="mega-nav__label">Help &amp; Support</li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=support" style="font-size: 24px;" class="mega-nav__sub-link">Help
                        Center</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=FAQ" style="font-size: 24px;" class="mega-nav__sub-link">FAQ</a></li>
                    <li class="mega-nav__sub-item"><a href="index.php?page=form" style="font-size: 24px;" class="mega-nav__sub-link">Contact us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>

            <li class="mega-nav__label">Other</li>

            <!-- 👇 Account link --mobile -->
            <li class="mega-nav__item hide@md">
              <a href="index.php?page=myaccount&tab=settings" class="mega-nav__control">Account</a>
            </li>
          </ul>

          <ul class="mega-nav__items">
            <!-- 👇 icon buttons --desktop -->
            <li class="mega-nav__icon-btns mega-nav__icon-btns--desktop">
              <a href="$cart_link" class="mega-nav__icon-btn" aria-controls="cart-drawer">
                <svg class="icon" viewBox="0 0 24 24">
                  <title>Go to cart page</title>
                  <g class="icon__group" fill="none" stroke-linecap="square" stroke-linejoin="miter"
                    stroke="currentColor">
                    <polyline points="4,4 22,4 19,14 4,14 "></polyline>
                    <circle cx="4" cy="22" r="2" fill="currentColor" stroke="none"></circle>
                    <circle cx="20" cy="22" r="2" fill="currentColor" stroke="none"></circle>
                    <polyline points="1,1 4,4 4,14 2,18 23,18 " stroke-linecap="butt"></polyline>
                  </g>
                </svg>

                <span class="counter counter--critical">$num_items_in_cart<i class="sr-only">items in cart</i></span>
              </a>

              <div class="dropdown js-dropdown">
                <div class="mega-nav__icon-btn dropdown__wrapper inline-block">
                  <a href="index.php?page=myaccount&tab=settings"
                    class="color-inherit flex height-100% width-100% flex-center dropdown__trigger">
                    <svg class="icon" viewBox="0 0 24 24">
                      <title>Go to account settings</title>
                      <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                        stroke-miterlimit="10">
                        <circle cx="12" cy="6" r="4" />
                        <path d="M12 13a8 8 0 00-8 8h16a8 8 0 00-8-8z" />
                      </g>
                    </svg>
                  </a>

                  $appear_just_when_logged_in

                </div>
              </div>

        <button class="reset mega-nav__icon-btn mega-nav__icon-btn--search js-tab-focus" aria-label="Toggle search"
          aria-controls="mega-nav-search">
          <svg class="icon" viewBox="0 0 24 24">
            <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10">
              <path d="M4.222 4.222l15.556 15.556" />
              <path d="M19.778 4.222L4.222 19.778" />
              <circle cx="9.5" cy="9.5" r="6.5" />
            </g>
          </svg>
        </button>

            </li>

          </ul>
        </div>
      </div>

      <!-- 👇 search -->
      <div class="mega-nav__search js-mega-nav__search" id="mega-nav-search">
        <div class="mega-nav__search-inner">
          <div class="search">
          <i title="Search"></i>
          <input class="form-control width-100%" type="text" name="megasite-search" id="megasite-search"
            placeholder="Search..." aria-label="Search">
          </div>

          <div class="margin-top-lg" style="display: none">
            <p class="mega-nav__label">Quick Links</p>
            <ul>
              <li><a href="help-center.html" class="mega-nav__quick-link">Help Center</a></li>
              <li><a href="account-order-history.html" class="mega-nav__quick-link">Your Orders</a></li>
              <li><a href="account-wishlist.html" class="mega-nav__quick-link">Wishlist</a></li>
              <li><a href="faq.html" class="mega-nav__quick-link">Frequently Asked
                  Questions</a></li>
              <li><a href="contact.html" class="mega-nav__quick-link">Contact Us</a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </header>

  <script src="assets/js/scripts.js"></script>

  <script>
  document.getElementsByTagName("html")[0].className += "js";
  </script>

  <main>

EOT;
}
// Template footer
function template_footer()
{    
$base_url = base_url;    
$rewrite_url = rewrite_url ? 'true' : 'false';    
$year = date('Y');    
$currency_code = currency_code;    
// DO NOT INDENT THE BELOW CODE    
echo <<<EOT
  </main>
  <footer class="main-footer bg-contrast-lower bg-opacity-30% padding-top-xl padding-bottom-md" id="footerul">
    <div class="container max-width-lg reveal-fx reveal-fx--translate-up" data-reveal-fx-delta="50">
      <div class="grid gap-lg"  id="haha" style="margin-bottom: -70px; text-align: left; zoom: 85%; padding-bottom: 3%; padding-top: 3%;">
        <nav class="col-9@lg order-1@lg">

          <ul class="grid gap-lg" id="schimba2" style="--grid-columns: 1; display: flex; flex-wrap: nowrap;">

            <li class="col-6@sm col-3@md" id="ahaaa" style="display: flex; justify-content: space-around;">
              <div class="main-footer__items" id="stergebottom">
                <h4 data-target="#collapse_4" style="padding-bottom: 10%;">Shop</h4>
                <div class="main-footer__item"><a href="index.php?page=products" class="main-footer__link">All Products</a></div>
                <div class="main-footer__item"><a href="index.php?page=categories" class="main-footer__link">Categories</a>
                </div>
                <div class="main-footer__item"><a href="index.php?page=products" class="main-footer__link">Clothes</a></div>
                <div class="main-footer__item"><a href="index.php?page=products" class="main-footer__link">Shoes</a></div>
                <div class="main-footer__item"><a href="index.php?page=products" class="main-footer__link">Home</a></div>
              </div>
            </li>

            <li class="col-6@sm col-3@md" id="ahaya" style="display: flex; justify-content: space-around;">
              <div class="main-footer__items">
                <h4 data-target="#collapse_4" style="padding-bottom: 10%;">Help</h4>
                <div class="main-footer__item"><a href="index.php?page=support" class="main-footer__link">Support</a></div>
                <div class="main-footer__item"><a href="index.php?page=FAQ" class="main-footer__link">FAQ</a></div>
                <div class="main-footer__item"><a href="index.php?page=form" class="main-footer__link">Contact us</a></div>
                <div class="main-footer__item"><a href="index.php?page=FAQ" class="main-footer__link">Size Chart</a></div>
                <div class="main-footer__item"><a href="index.php?page=FAQ" class="main-footer__link">Payment Methods</a></div>
              </div>
            </li>

            <li class="col-6@sm col-3@md" id="stergedepetelefonye" style="display: flex; justify-content: space-around;">
              <div class="main-footer__items">
                <h4 data-target="#collapse_4" style="padding-bottom: 10%;">Contact</h4>
                <div class="main-footer__item" style=" padding-bottom: 11%; padding-top: 0px;
                margin-top: var(--space-sm);"><i class="fa fa-home"></i>&nbsp; Str. Eroilor, 115</br><i class="fa-solid fa-house" style="color: transparent"></i>&nbsp; Bucharest, Romania</div>
                <div class="main-footer__item" style=" padding-bottom: 11%;"><i class="fas fa-headphones"></i> &nbsp; <a href="tel:0760231025"> 0760231025</a></div>
                <div class="main-footer__item"><i class="far fa-envelope"></i> &nbsp; <a href="mailto:feraandrei1@gmail.com"> feraandrei1@gmail.com</a></div>
              </div>
            </li>

            <li class="col-6@sm col-3@md" id="stergeleft" style="display: flex; justify-content: center;" >
              <div class="main-footer__items">

            <div class="col-lg-3 col-md-6">
                <h4 data-target="#collapse_4" style="padding-bottom: 10%;">Subscribe</h4>
              <div class="collapse dont-collapse-sm" id="collapse_4">

            <form class="margin-bottom-sm" name="signup" action="/omegashop/index.php" method="post">
                          <div class="flex flex-column flex-row@md gap-xxxs">
                            <input aria-label="Email" class="form-control flex-grow" name="email" type="email" placeholder="Your Email">
                            <input type="submit" class="btn btn--primary">
                          </div>
              </form>

						<div class="follow_us">
							<ul>
								<li><a href="https://twitter.com/FeraruAndrei7/"><img src="img/twitter_icon.svg" data-src="img/twitter_icon.svg" alt="" class="lazy"></a></li>
								<li><a href="https://www.facebook.com/andrei.fera.3"><img src="img/facebook_icon.svg" data-src="img/facebook_icon.svg" alt="" class="lazy"></a></li>
								<li><a href="https://www.instagram.com/feraandrei/"><img src="img/instagram_icon.svg" data-src="img/instagram_icon.svg" alt="" class="lazy"></a></li>
							</ul>
						</div>

              </div>
            </li>

          </ul>
        </nav>
      </div>

      <div class="main-footer__colophon border-top padding-top-xs margin-top-lg">

        <div class="text-sm text-xs@md color-contrast-medium flex gap-xs" id="stergedintelefon" style="padding: 10px; padding-top: 0px; padding-right: 15px">
					<ul class="footer-selector clearfix" style="display: flex; align-items: center;">
						<li>
							<div class="styled-select lang-selector">
								<select  style="background-color: transparent  !important;">
									<option value="English" selected>English</option>
									<option value="French">French</option>
									<option value="Spanish">Spanish</option>
									<option value="Russian">Russian</option>
								</select>
							</div>
						</li>
						<li>
							<div class="styled-select currency-selector">
								<select  style="background-color: transparent  !important;">
									<option value="US Dollars" selected>US Dollars</option>
									<option value="Euro">Euro</option>
								</select>
							</div>
						</li>
						<li><img src="img/cards_all.svg" data-src="img/cards_all.svg" alt="" width="198" height="30" class="lazy"></li>
					</ul>
        </div>

        <div class="text-sm text-xs@md color-contrast-medium flex gap-xs" style="padding: 10px; padding-top: 5px; padding-right: 15px">
          <span>&copy; Omega Shop</span>
          <a href="" class="color-contrast-high">Terms</a>
          <a href="" class="color-contrast-high">Privacy</a>

        </div>
      </div>
    </div>

  </footer>

        <script src="script.js"></script>

        <script>
        const currency_code = "$currency_code", base_url = "$base_url", rewrite_url = $rewrite_url;
        </script>
        <script src="{$base_url}script.js"></script>

    </body>
</html>
EOT;
}
// Template admin header
function template_admin_header($title, $selected = 'orders', $selected_child = 'view')
{
    $admin_links = '
        <a href="index.php?page=dashboard"' . ($selected == 'dashboard' ? ' class="selected"' : '') . '><i class="fas fa-tachometer-alt"></i>Dashboard</a>
        <a href="index.php?page=orders"' . ($selected == 'orders' ? ' class="selected"' : '') . '><i class="fas fa-shopping-cart"></i>Orders</a>
        <div class="sub">
            <a href="index.php?page=orders"' . ($selected == 'orders' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Orders</a>
            <a href="index.php?page=order_manage"' . ($selected == 'orders' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Order</a>
        </div>
        <a href="index.php?page=products"' . ($selected == 'products' ? ' class="selected"' : '') . '><i class="fas fa-box-open"></i>Products</a>
        <div class="sub">
            <a href="index.php?page=products"' . ($selected == 'products' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Products</a>
            <a href="index.php?page=product"' . ($selected == 'products' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Product</a>
        </div>
        <a href="index.php?page=categories"' . ($selected == 'categories' ? ' class="selected"' : '') . '><i class="fas fa-list"></i>Categories</a>
        <div class="sub">
            <a href="index.php?page=categories"' . ($selected == 'categories' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Categories</a>
            <a href="index.php?page=category"' . ($selected == 'categories' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Category</a>
        </div>
        <a href="index.php?page=accounts"' . ($selected == 'accounts' ? ' class="selected"' : '') . '><i class="fas fa-users"></i>Accounts</a>
        <div class="sub">
            <a href="index.php?page=accounts"' . ($selected == 'accounts' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Accounts</a>
            <a href="index.php?page=account"' . ($selected == 'accounts' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Account</a>
        </div>
        <a href="index.php?page=shipping"' . ($selected == 'shipping' ? ' class="selected"' : '') . '><i class="fas fa-shipping-fast"></i>Shipping</a>
        <div class="sub">
            <a href="index.php?page=shipping"' . ($selected == 'shipping' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Shipping Methods</a>
            <a href="index.php?page=shipping_process"' . ($selected == 'shipping' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Shipping Method</a>
        </div>
        <a href="index.php?page=discounts"' . ($selected == 'discounts' ? ' class="selected"' : '') . '><i class="fas fa-tag"></i>Discounts</a>
        <div class="sub">
            <a href="index.php?page=discounts"' . ($selected == 'discounts' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Discounts</a>
            <a href="index.php?page=discount"' . ($selected == 'discounts' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Discount</a>
        </div>
        <a href="index.php?page=taxes"' . ($selected == 'taxes' ? ' class="selected"' : '') . '><i class="fa-solid fa-percent"></i>Taxes</a>
        <div class="sub">
            <a href="index.php?page=taxes"' . ($selected == 'taxes' && $selected_child == 'view' ? ' class="selected"' : '') . '><span>&#9724;</span>View Taxes</a>
            <a href="index.php?page=tax"' . ($selected == 'taxes' && $selected_child == 'manage' ? ' class="selected"' : '') . '><span>&#9724;</span>Create Tax</a>
        </div>
        <a href="index.php?page=media"' . ($selected == 'media' ? ' class="selected"' : '') . '><i class="fas fa-images"></i>Media</a>
        <a href="index.php?page=emailtemplates"' . ($selected == 'emailtemplates' ? ' class="selected"' : '') . '><i class="fas fa-envelope"></i>Email Templates</a>
        <a href="index.php?page=settings"' . ($selected == 'settings' ? ' class="selected"' : '') . '><i class="fas fa-tools"></i>Settings</a>
    ';    // DO NOT INDENT THE BELOW CODE    
echo <<<EOT
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,minimum-scale=1">
		<title>$title</title>
    <link rel="icon" type="image/png" href="omega.png">
		<link href="admin.css" rel="stylesheet" type="text/css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.0.0/css/all.css">
	</head>
	<body class="admin">
        <aside class="responsive-width-100 responsive-hidden">
            <h1>Omega Shop Admin</h1>
            $admin_links
            <div class="footer">
                <a href="" target="_blank">Omega Shop</a>
                Version 2.0.1
            </div>
        </aside>
        <main class="responsive-width-100">
            <header>
                <a class="responsive-toggle" href="#">
                    <i class="fas fa-bars"></i>
                </a>
                <div class="space-between"></div>
                <div class="dropdown right">
                    <i class="fas fa-user-circle"></i>
                    <div class="list">
                        <a href="index.php?page=account&id={$_SESSION['account_id']}">Edit Profile</a>
                        <a href="index.php?page=logout">Logout</a>
                    </div>
                </div>
            </header>
EOT;
}
// Template admin footer
function template_admin_footer($js_script = '')
{
    $js_script = $js_script ? '<script>' . $js_script . '</script>' : '';    // DO NOT INDENT THE BELOW CODE    
echo <<<EOT
        </main>
        <script src="admin.js"></script>
        {$js_script}
    </body>
</html>
EOT;
}
// Determine URL function
function url($url)
{
    if (rewrite_url) {
        $url = preg_replace('/\&(.*?)\=/', '/', str_replace(['index.php?page=', 'index.php'], '', $url));
    }
    return base_url . $url;
}
// Routeing function
function routes($urls)
{
    foreach ($urls as $url => $file_path) {
        $url = '/' . ltrim($url, '/');
        $prefix = dirname($_SERVER['PHP_SELF']);
        $uri = $_SERVER['REQUEST_URI'];
        if (substr($uri, 0, strlen($prefix)) == $prefix) {
            $uri = substr($uri, strlen($prefix));
        }
        $uri = '/' . ltrim($uri, '/');
        $path = explode('/', parse_url($uri)['path']);
        $routes = explode('/', $url);
        $values = [];
        foreach ($path as $pk => $pv) {
            if (isset($routes[$pk]) && preg_match('/{(.*?)}/', $routes[$pk])) {
                $var = str_replace(['{', '}'], '', $routes[$pk]);
                $routes[$pk] = preg_replace('/{(.*?)}/', $pv, $routes[$pk]);
                $values[$var] = $pv;
            }
        }
        if ($routes === $path && rewrite_url) {
            foreach ($values as $k => $v) {
                $_GET[$k] = $v;
            }
            return file_exists($file_path) ? $file_path : 'home.php';
        }
    }
    if (rewrite_url) {
        header('Location: ' . url('index.php'));
        exit;
    }
    return null;
}
// Format bytes to human-readable format
function format_bytes($bytes)
{
    $i = floor(log($bytes, 1024));
    return round($bytes / pow(1024, $i), [0, 0, 2, 2, 3][$i]) . ['B', 'KB', 'MB', 'GB', 'TB'][$i];
}
?>