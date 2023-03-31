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
<?=template_header('Categories')?>
<link rel="stylesheet" href="filtering/reset.css">
<link rel="stylesheet" href="ye.css">


  <!-- categories -->

    <a href="index.php?page=products" style="text-decoration: none;"> <section class="feature-v9" data-theme="dark-1">
    <div class="grid" style="--grid-columns: 6;">
      <div class="feature-v9__block col-6@md" style="background-image:url(assets/img/article-gallery-v3-img-3.jpg)">
        <div class="feature-v9__content text-component text-center max-width-xxxs">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxl color-inherit" style="color: antiquewhite">Clothes</h2>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Clothes</a></p>
          </div>
        </div>
      </div>
      </a>
  
    <a href="index.php?page=products" style="text-decoration: none;">
    <div class="feature-v9__block col-6@md" style="background-image:url(assets/img/feature-v10-img-1.jpg)">
        <div class="feature-v9__content text-component text-center max-width-xxxs">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxl color-inherit" style="color: white">Accessories</h2>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Accessories</a></p>
          </div>
        </div>
      </div>
    </div>
    </a>

    <a href="index.php?page=products" style="text-decoration: none;">
    <div class="feature-v9__block col-6@md" style="background-image:url(assets/img/banner-img-2.jpg)">
        <div class="feature-v9__content text-component text-center max-width-xxxs">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxl color-inherit" style="color: wheat">Home</h2>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Home</a></p>
          </div>
        </div>
      </div>
    </div>
    </a>
  </section>


  <!-- women/men -->
  <section class="feature-v9" data-theme="dark-1">
    <div class="grid">
      <div class="feature-v9__block col-6@md" style="background-image: url('assets/img/feature-v9-img-1.jpg');">
        <div class="feature-v9__content text-component text-center max-width-xxxs" id="da80px">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxl color-inherit">Women</h2>
            <p class="opacity-90%">Find everything you need for your beauty</p>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Women</a></p>
          </div>
        </div>
      </div>
  
      <div class="feature-v9__block col-6@md" style="background-image: url('assets/img/feature-v9-img-2.jpg');">
        <div class="feature-v9__content text-component text-center max-width-xxxs" id="da80px">
          <div class="ie:bg ie:padding-md">
            <h2 class="text-xxl color-inherit">Men</h2>
            <p class="opacity-90%">Keeping you up with the new trend</p>
            <p><a class="feature-v9__link" href="index.php?page=products">Shop Men</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>

<?=template_footer()?>