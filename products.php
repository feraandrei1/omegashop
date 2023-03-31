<?php
// Prevent direct access to file
defined('omegashop') or exit;
// Get all the categories from the database
$stmt = $pdo->query('SELECT * FROM categories');
$stmt->execute();
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Get the current category from the GET request, if none exists set the default selected category to: all
$category = isset($_GET['category']) ? $_GET['category'] : 'all';
$category_sql = '';
if ($category != 'all') {
    $category_sql = 'JOIN products_categories pc ON pc.category_id = :category_id AND pc.product_id = p.id JOIN categories c ON c.id = pc.category_id';
}
// Get the sort from GET request, will occur if the user changes an item in the select box
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'sort3';
// The amounts of products to show on each page
$num_products_on_each_page = 12;
// The current page, in the URL this will appear as index.php?page=products&p=1, index.php?page=products&p=2, etc...
$current_page = isset($_GET['p']) && is_numeric($_GET['p']) ? (int)$_GET['p'] : 1;
// Select products ordered by the date added
if ($sort == 'sort1') {
    // sort1 = Alphabetical A-Z
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.name ASC LIMIT :page,:num_products');
} elseif ($sort == 'sort2') {
    // sort2 = Alphabetical Z-A
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.name DESC LIMIT :page,:num_products');
} elseif ($sort == 'sort3') {
    // sort3 = Newest
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.date_added DESC LIMIT :page,:num_products');
} elseif ($sort == 'sort4') {
    // sort4 = Oldest
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.date_added ASC LIMIT :page,:num_products');
} elseif ($sort == 'sort5') {
    // sort5 = Highest Price
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.price DESC LIMIT :page,:num_products');
} elseif ($sort == 'sort6') {
    // sort6 = Lowest Price
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 ORDER BY p.price ASC LIMIT :page,:num_products');
} else {
    // No sort was specified, get the products with no sorting
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p ' . $category_sql . ' WHERE p.status = 1 LIMIT :page,:num_products');
}
// bindValue will allow us to use integer in the SQL statement, we need to use for LIMIT
if ($category != 'all') {
    $stmt->bindValue(':category_id', $category, PDO::PARAM_INT);
}
$stmt->bindValue(':page', ($current_page - 1) * $num_products_on_each_page, PDO::PARAM_INT);
$stmt->bindValue(':num_products', $num_products_on_each_page, PDO::PARAM_INT);
$stmt->execute();
// Fetch the products from the database and return the result as an Array
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Get the total number of products
$stmt = $pdo->prepare('SELECT COUNT(*) FROM products p ' . $category_sql . ' WHERE p.status = 1');
if ($category != 'all') {
    $stmt->bindValue(':category_id', $category, PDO::PARAM_INT);
}
$stmt->execute();
$total_products = $stmt->fetchColumn()
?>
<?=template_header('All Products')?>

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
  <link href="filtering/filtru.css" rel="stylesheet">

  <link href="filtering/script.js" rel="stylesheet">
  <link href="filtering/components.js" rel="stylesheet">
  <link href="filtering/_1_accordion.js" rel="stylesheet">
  <link href="filtering/_1_custom-select.js" rel="stylesheet">
  <link href="filtering/js/_1_filter.js" rel="stylesheet">
  <link href="filtering/_1_number-input.js" rel="stylesheet">
  <link href="filtering/_1_read-more.js" rel="stylesheet">
  <link href="filtering/_1_responsive-sidebar.js" rel="stylesheet">
  <link href="filtering/_1_slider.js" rel="stylesheet">
  <link href="filtering/_2_slider-multi-value.js" rel="stylesheet">
  <link href="filtering/_3_advanced-filter.js" rel="stylesheet">

  <section class="adv-filter ax0-padding-y-lg js-adv-filter" style="padding-bottom: 0px !important; padding-top: 10px !important;">
    <div class="ax0-container ax0-max-width-adaptive-lg">
      <div class="ax0-margin-bottom-md ax0-hide@md ">
        <button class="ax0-btn ax0-btn--subtle ax0-width-100%" aria-controls="filter-panel">Show filters</button>
      </div>

      <div class="ax0-flex@md">
        <aside id="filter-panel" class="sidebar sidebar--static@md js-sidebar" aria-labelledby="filter-panel-title">
          <div class="sidebar__panel ax0-max-width-100% ax0-width-100%">
            <header class="sidebar__header ax0-bg ax0-padding-y-sm ax0-padding-x-md ax0-border-bottom ax0-z-index-2">
              <h1 class="ax0-text-md ax0-text-truncate" id="filter-panel-title">Filters</h1>

              <button class="sidebar__close-btn js-sidebar__close-btn js-tab-focus">
                <svg class="ax0-icon ax0-icon--xs" viewBox="0 0 16 16">
                  <title>Close panel</title>
                  <g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                    stroke-miterlimit="10">
                    <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
                    <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
                  </g>
                </svg>
              </button>
            </header>

            <div class="container976">
            <form class="ax0-position-relative ax0-z-index-1 js-adv-filter__form">
              <div class="ax0-padding-md ax0-padding-0@md ax0-margin-bottom-sm@md" id="margini2">
                <button
                  class="ax0-text-sm ax0-color-contrast-high ax0-text-underline ax0-cursor-pointer ax0-margin-bottom-sm ax0-text-xs@md js-adv-filter__reset js-tab-focus"
                  type="reset">Reset all filters</button>

                <div class="search-input search-input--icon-left ax0-text-sm@md">
                  <input class="search-input__input ax0-form-control" type="search" name="search-products"
                    id="search-products" placeholder="Search..." aria-label="Search" data-filter="searchInput"
                    aria-controls="adv-filter-gallery">

                  <button class="search-input__btn">
                    <svg class="ax0-icon" viewBox="0 0 20 20">
                      <title>Submit</title>
                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2">
                        <circle cx="8" cy="8" r="6" />
                        <line x1="12.242" y1="12.242" x2="18" y2="18" />
                      </g>
                    </svg>
                  </button>
                </div>
              </div>

              <ul class="accordion js-accordion" data-animation="on" data-multi-items="on">

                <li class="accordion__item js-accordion__item js-adv-filter__item" data-default-text="All">
                  <button class="accordion__header ax0-padding-y-sm ax0-padding-x-md ax0-padding-x-xs@md js-tab-focus"
                    type="button">
                    <div>
                      <div class="ax0-text-sm ax0-color-contrast-low"><i class="ax0-sr-only">Active filters: </i><span
                          class="js-adv-filter__selection">All</span></div>
                    </div>

                    <svg class="ax0-icon accordion__icon-arrow-v2 " viewBox="0 0 20 20">
                      <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="3" y1="3" x2="17" y2="17" />
                        <line x1="17" y1="3" x2="3" y2="17" />
                      </g>
                    </svg>
                  </button>

                  <div class="accordion__panel js-accordion__panel">
                    <div class="ax0-padding-top-3xs ax0-padding-x-md ax0-padding-bottom-md ax0-padding-x-xs@md">
                      <ul class="adv-filter__radio-list ax0-flex ax0-flex-column ax0-gap-3xs"
                        aria-controls="adv-filter-gallery">
                        <li>
                          <input class="radio" type="radio" name="radio-filter" id="radio-all" data-filter="*" checked>
                          <label for="radio-all">All</label>
                        </li>

                        <li>
                          <input class="radio" type="radio" name="radio-filter" id="radio-category-1"
                            data-filter="category-1">
                          <label for="radio-category-1">Men</label>
                        </li>

                        <li>
                          <input class="radio" type="radio" name="radio-filter" id="radio-category-2"
                            data-filter="category-2">
                          <label for="radio-category-2">Women</label>
                        </li>

                        <li>
                          <input class="radio" type="radio" name="radio-filter" id="radio-category-3"
                            data-filter="category-3">
                          <label for="radio-category-3">Accessories</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                <li class="accordion__item accordion__item--is-open js-accordion__item js-adv-filter__item"
                  data-number-format="${n}">
                  <button class="accordion__header ax0-padding-y-sm ax0-padding-x-md ax0-padding-x-xs@md js-tab-focus"
                    type="button">
                    <div>
                      <div class="ax0-text-sm@md">Price</div>
                      <div class="ax0-text-sm ax0-color-contrast-low"><i class="ax0-sr-only">Active filters: </i><span
                          class="js-adv-filter__selection">$0 - $1000</span></div>
                    </div>

                    <svg class="ax0-icon accordion__icon-arrow-v2 " viewBox="0 0 20 20">
                      <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="3" y1="3" x2="17" y2="17" />
                        <line x1="17" y1="3" x2="3" y2="17" />
                      </g>
                    </svg>
                  </button>

                  <div class="accordion__panel js-accordion__panel">
                    <div
                      class="ax0-padding-top-3xs ax0-padding-x-md ax0-padding-bottom-md ax0-padding-x-xs@md ax0-flex ax0-justify-center">
                      <div class="slider slider--multi-value js-slider js-filter__custom-control"
                        aria-controls="adv-filter-gallery" data-filter="priceRange">
                        <div class="slider__range">
                          <label class="ax0-sr-only" for="slider-min-value">Slider min value</label>
                          <input class="slider__input" type="range" id="slider-min-value" name="slider-min-value"
                            min="0" max="1000" step="1" value="0">
                        </div>

                        <div class="slider__range">
                          <label class="ax0-sr-only" for="slider-max-value">Slider max value</label>
                          <input class="slider__input" type="range" id="slider-max-value" name="slider-max-value"
                            min="0" max="1000" step="1" value="1000">
                        </div>

                        <div class="ax0-margin-top-xs ax0-text-center ax0-text-sm" aria-hidden="true">
                          <span class="slider__value">$<span class="js-slider__value">0</span> - $<span
                              class="js-slider__value">1000</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="accordion__item js-accordion__item js-adv-filter__item" data-default-text="All"
                  data-multi-select-text="{n} filters selected" data-number-format="{n}+">
                  <button class="accordion__header ax0-padding-y-sm ax0-padding-x-md ax0-padding-x-xs@md js-tab-focus"
                    type="button" style="display: none">
                    <div>
                      <div class="ax0-text-sm@md">Size</div>
                      <div class="ax0-text-sm ax0-color-contrast-low"><i class="ax0-sr-only">Active filters: </i><span
                          class="js-adv-filter__selection">All</span></div>
                    </div>

                    <svg class="ax0-icon accordion__icon-arrow-v2 " viewBox="0 0 20 20">
                      <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="3" y1="3" x2="17" y2="17" />
                        <line x1="17" y1="3" x2="3" y2="17" />
                      </g>
                    </svg>
                  </button>

                  <div class="accordion__panel js-accordion__panel">
                    <div class="ax0-padding-top-3xs ax0-padding-x-md ax0-padding-bottom-md ax0-padding-x-xs@md">
                      <div class="ax0-flex ax0-justify-between ax0-items-center">
                        <label class="ax0-text-sm" for="index-value">Search</label>

                        <div class="number-input number-input--v2 js-number-input js-filter__custom-control"
                          aria-controls="adv-filter-gallery" data-filter="indexValue">
                          <input class="ax0-form-control ax0-text-sm@md js-number-input__value" type="number"
                            name="index-value" id="index-value" min="0" max="999999" step="1" value="0">

                          <button class="number-input__btn number-input__btn--plus js-number-input__btn"
                            aria-label="Increase Number">
                            <svg class="ax0-icon" viewBox="0 0 12 12" aria-hidden="true">
                              <path
                                d="M11,5H7V1A1,1,0,0,0,5,1V5H1A1,1,0,0,0,1,7H5v4a1,1,0,0,0,2,0V7h4a1,1,0,0,0,0-2Z" />
                            </svg>
                          </button>

                          <button class="number-input__btn number-input__btn--minus js-number-input__btn"
                            aria-label="Decrease Number">
                            <svg class="ax0-icon" viewBox="0 0 12 12" aria-hidden="true">
                              <path d="M11,7H1A1,1,0,0,1,1,5H11a1,1,0,0,1,0,2Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="accordion__item accordion__item--is-open js-accordion__item js-adv-filter__item">
                  <button class="accordion__header ax0-padding-y-sm ax0-padding-x-md ax0-padding-x-xs@md js-tab-focus"
                    type="button">
                    <div>
                      <div class="ax0-text-sm@md">Size</div>
                      <div class="ax0-text-sm ax0-color-contrast-low"><i class="ax0-sr-only">Active filters: </i><span
                          class="js-adv-filter__selection">All</span></div>
                    </div>

                    <svg class="ax0-icon accordion__icon-arrow-v2 " viewBox="0 0 20 20">
                      <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="3" y1="3" x2="17" y2="17" />
                        <line x1="17" y1="3" x2="3" y2="17" />
                      </g>
                    </svg>
                  </button>

                  <div class="accordion__panel js-accordion__panel">
                    <div
                      class="ax0-padding-top-3xs ax0-padding-x-md ax0-padding-bottom-md ax0-padding-x-xs@md ax0-flex">
                      <label class="ax0-sr-only" for="select-filter-option">Select Option:</label>

                      <div class="select ax0-width-100% js-select"
                        data-trigger-class="ax0-btn ax0-btn--subtle ax0-flex-grow">
                        <!-- data-trigger-class -> custom select component 👆 -->
                        <select name="select-filter-option" id="select-filter-option" aria-controls="adv-filter-gallery"
                          data-filter="true">
                          <option value="*" selected>All</option>
                          <option value="small">S</option>
                          <option value="medium">M</option>
                          <option value="large">L</option>
                          <option value="xlarge">XL</option>
                        </select>

                        <svg class="ax0-icon ax0-icon--2xs ax0-margin-left-2xs" aria-hidden="true" viewBox="0 0 12 12">
                          <path
                            d="M10.947,3.276A.5.5,0,0,0,10.5,3h-9a.5.5,0,0,0-.4.8l4.5,6a.5.5,0,0,0,.8,0l4.5-6A.5.5,0,0,0,10.947,3.276Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </li>

              </ul>
            </form>
        </div>

          </div>
        </aside>

        <div class="container975">

        <main class="ax0-flex-grow ax0-padding-left-xl@md sidebar-loaded:show">
          <div class="ax0-flex ax0-items-center ax0-justify-between ax0-margin-bottom-sm" id="margini33">
            <p class="ax0-text-sm"><span class="js-adv-filter__results-count" style="margin-left: 15px">15</span> results</p>

            <div class="ax0-flex ax0-items-baseline">
              <label class="ax0-text-sm ax0-color-contrast-medium ax0-margin-right-xs"
                for="select-sorting">Sort:</label>

              <div class="select ax0-inline-block js-select"
                data-trigger-class="ax0-text-sm ax0-color-contrast-high ax0-text-underline ax0-inline-flex ax0-items-center ax0-cursor-pointer js-tab-focus">
                <!-- data-trigger-class -> custom select component 👆 -->
                <select name="select-sorting" id="select-sorting" aria-controls="adv-filter-gallery" data-sort="true">
                  <option value="*" selected>No sorting</option>
                  <option value="index" data-sort-number="true">Lowest Price</option>
                  <option value="index" data-sort-order="desc" data-sort-number="true">Highest Price</option>
                </select>

                <svg class="ax0-icon ax0-icon--3xs ax0-margin-left-2xs" viewBox="0 0 8 8">
                  <path
                    d="M7.934,1.251A.5.5,0,0,0,7.5,1H.5a.5.5,0,0,0-.432.752l3.5,6a.5.5,0,0,0,.864,0l3.5-6A.5.5,0,0,0,7.934,1.251Z" />
                </svg>
              </div>
            </div>
          </div>

          <div id="margini">
            <ul class="ax0-grid ax0-gap-sm js-adv-filter__gallery" id="adv-filter-gallery">
              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-contrast-lower large" data-sort-index="43" data-price="430"
                data-search="Category 1"><a href="index.php?page=product&id=5" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-4b.jpg" loading="lazy" alt="Product preview image" onmouseover="hover(this);" onmouseout="unhover(this);" id="product1">
                <h72>Travis Shoes</h72>
                <p style="font-size:15px">429.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    6</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$60</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-primary ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-primary large" data-sort-index="8" data-price="80"
                data-search="Category 1"><a href="index.php?page=product&id=6" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-2a.jpg" loading="lazy" alt="Product preview image" id="product2">
                <h72>Blue Jeans</h72>
                <p style="font-size:15px">79.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Men</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Primary</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    4</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$40</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-accent ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-2 ax0-bg-accent medium" data-sort-index="9" data-price="90"
                data-search="Category 2"><a href="index.php?page=product&id=7" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-1a.jpg" loading="lazy" alt="Product preview image" onmouseover="hoverc(this);" onmouseout="unhoverc(this);" id="product3">
                <h72>Brown Coat</h72>
                <p style="font-size:15px">89.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Women</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Accent</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    5</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$50</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Medium</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-contrast-higher ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 category-2 ax0-bg-contrast-higher xlarge" data-sort-index="5" data-price="50"
                data-search="Category 1, Category 2"><a href="index.php?page=product&id=8" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-4a.jpg" loading="lazy" alt="Product preview image" id="product4">
                <h72>Unisex Shoes</h72>
                <p style="font-size:15px">49.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Unisex</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastHigher</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    1</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$10</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">X-Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-primary ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-primary large" data-sort-index="7" data-price="70"
                data-search="Category 1"><a href="index.php?page=product&id=9" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-5a.jpg" loading="lazy" alt="Product preview image" id="product5">
                <h72>Boots</h72>
                <p style="font-size:15px">69.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Men</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Primary</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    8</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$80</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-accent ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-2 ax0-bg-accent xlarge" data-sort-index="4" data-price="40"
                data-search="Category 2"><a href="index.php?page=product&id=10" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-6b.jpg" loading="lazy" alt="Product preview image" id="product6">
                <h72>Unisex T-shirt</h72>
                <p style="font-size:15px">39.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Women</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Accent</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    2</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$20</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Medium</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-3 ax0-bg-contrast-lower small" data-sort-index="2" data-price="20"
                data-search="Category 3"><a href="index.php?page=product&id=3" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/headphones.jpg" loading="lazy" alt="Product preview image" id="product7">
                <h72>Headphones</h72>
                <p style="font-size:15px">19.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    3</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$30</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-3 ax0-bg-contrast-lower small" data-sort-index="27" data-price="270"
                data-search="Category 3"><a href="index.php?page=product&id=4" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/camera.jpg" loading="lazy" alt="Product preview image" id="product8">
                <h72>Digital Camera</h72>
                <p style="font-size:15px">269.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    5</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$55</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-primary ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-3 ax0-bg-primary small" data-sort-index="1.5" data-price="15"
                data-search="Category 3"><a href="index.php?page=product&id=2" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/wallet.jpg" loading="lazy" alt="Product preview image" id="product9">
                <h72>Wallet</h72>
                <p style="font-size:15px">14.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Men</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Primary</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    4</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$43</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-primary ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-primary xlarge" data-sort-index="4" data-price="40"
                data-search="Category 1"><a href="index.php?page=product&id=11" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-7b.jpg" loading="lazy" alt="Product preview image" id="product10">
                <h72>Unisex T-shirt</h72>
                <p style="font-size:15px">39.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Men</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Primary</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    6</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$65</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-primary ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-primary large" data-sort-index="9" data-price="90"
                data-search="Category 1"><a href="index.php?page=product&id=12" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-5b.jpg" loading="lazy" alt="Product preview image" id="product11">
                <h72>White Jacket</h72>
                <p style="font-size:15px">89.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Men</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Primary</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    3</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$31</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-contrast-higher ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-2 ax0-bg-contrast-higher xlarge" data-sort-index="3" data-price="30"
                data-search="Category 2"><a href="index.php?page=product&id=13" style="text-align: left; color: black; text-decoration: none;">
                <img src="assets/img/product-card-v2-img-8a.jpg" loading="lazy" alt="Product preview image" id="product12">
                <h72>Women Watch</h72>
                <p style="font-size:15px">29.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Unisex</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastHigher</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    1</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$10</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">X-Large</span>
                </div>
              </a>
              </li>

              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-2 ax0-bg-contrast-lower large" data-sort-index="6" data-price="60"
                data-search="Category 2"><a href="index.php?page=product&id=14" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/mega-site-nav-img-1.jpg" loading="lazy" alt="Product preview image" id="product13">
                <h72>Nike Red Shoes</h72>
                <p style="font-size:15px">59.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    6</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$60</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>
              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 ax0-bg-contrast-lower large" data-sort-index="6" data-price="60"
                data-search="Category 1"><a href="index.php?page=product&id=15" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/mega-site-nav-img-2.jpg" loading="lazy" alt="Product preview image" id="product14">
                <h72>Nike Black Shoes</h72>
                <p style="font-size:15px">59.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    6</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$60</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>
              <li
                class="ax0-col-6@xs ax0-bg-contrast-lower ax0-height-4xl ax0-flex ax0-flex-center ax0-padding-sm js-filter__item"
                data-filter="category-1 category-2 ax0-bg-contrast-lower large" data-sort-index="6" data-price="60"
                data-search="Category 1, Category 2"><a href="index.php?page=product&id=16" style="text-align: left; color: black; text-decoration: none;">
                <img src="uploads/mega-site-nav-img-3.jpg" loading="lazy" alt="Product preview image" id="product15">
                <h72>Nike Unisex Shoes</h72>
                <p style="font-size:15px">59.99$</p>
                <div class="ax0-flex ax0-gap-2xs ax0-flex-wrap ax0-justify-center" style="display: none;">
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Kids</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">ContrastLower</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Index
                    6</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">$60</span>
                  <span
                    class="ax0-bg-contrast-higher ax0-bg-opacity-70% ax0-color-bg ax0-text-sm ax0-padding-y-4xs ax0-padding-x-3xs ax0-radius-md">Small</span>
                </div>
              </a>
              </li>

            </ul>

            <div class="ax0-margin-top-md" data-fallback-gallery-id="adv-filter-gallery">
              <p class="ax0-color-contrast-medium ax0-text-center">No results</p>
            </div>
          </div>
        </main>
      </div>

      </div>
    </div>
  </section>

  <script src="filtering/script69.js"></script>
  <script src="filtering/components.js"></script>
  <script src="filtering/_1_accordion.js"></script>
  <script src="filtering/_1_custom-select.js"></script>
  <script src="filtering/_1_filter.js"></script>
  <script src="filtering/_1_number-input.js"></script>
  <script src="filtering/_1_read-more.js"></script>
  <script src="filtering/_1_responsive-sidebar.js"></script>
  <script src="filtering/_1_slider.js"></script>
  <script src="filtering/_2_slider-multi-value.js"></script>
  <script src="filtering/_3_advanced-filter.js"></script>

<?=template_footer()?>