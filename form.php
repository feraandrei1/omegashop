<?php
// Prevent direct access to file
defined('omegashop') or exit;
// Remove product from cart, check for the URL param "remove", this is the product id, make sure it's a number and check if it's in the cart
if (isset($_GET['remove']) && is_numeric($_GET['remove']) && isset($_SESSION['cart']) && isset($_SESSION['cart'][$_GET['remove']])) {
    // Remove the product from the shopping cart
    array_splice($_SESSION['cart'], $_GET['remove'], 1);
    header('Location: ' . url('index.php?page=cart'));
    exit;
}
// Empty the cart
if (isset($_POST['emptycart']) && isset($_SESSION['cart'])) {
    // Remove all products from the shopping cart
    unset($_SESSION['cart']);
    header('Location: ' . url('index.php?page=cart'));
    exit;
}
// Update product quantities in cart if the user clicks the "Update" button on the shopping cart page
if ((isset($_POST['update']) || isset($_POST['checkout'])) && isset($_SESSION['cart'])) {
    // Iterate the post data and update quantities for every product in cart
    foreach ($_POST as $k => $v) {
        if (strpos($k, 'quantity') !== false && is_numeric($v)) {
            $id = str_replace('quantity-', '', $k);
            // abs() function will prevent minus quantity and (int) will ensure the value is an integer (number)
            $quantity = abs((int)$v);
            // Always do checks and validation
            if (is_numeric($id) && isset($_SESSION['cart'][$id]) && $quantity > 0) {
                // Update new quantity
                $_SESSION['cart'][$id]['quantity'] = $quantity;
            }
        }
    }
    // Send the user to the place order page if they click the Place Order button, also the cart should not be empty
    if (isset($_POST['cart']) && !empty($_SESSION['wishlist'])) {
        header('Location: ' . url('index.php?page=cart'));
        exit;
    }
    header('Location: ' . url('index.php?page=cart'));
    exit;
}
// Check the session variable for products in cart
$products_in_cart = isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : [];
$subtotal = 0.00;
// If there are products in cart
if ($products_in_cart) {
    // There are products in the cart so we need to select those products from the database
    // Products in cart array to question mark string array, we need the SQL statement to include: IN (?,?,?,...etc)
    $array_to_question_marks = implode(',', array_fill(0, count($products_in_cart), '?'));
    // Prepare SQL statement
    // $stmt = $pdo->prepare('SELECT p.id, pc.category_id, p.* FROM products p LEFT JOIN products_categories pc ON p.id = pc.product_id LEFT JOIN categories c ON c.id = pc.category_id WHERE p.id IN (' . $array_to_question_marks . ') GROUP BY p.id');
    $stmt = $pdo->prepare('SELECT p.*, (SELECT m.full_path FROM products_media pm JOIN media m ON m.id = pm.media_id WHERE pm.product_id = p.id ORDER BY pm.position ASC LIMIT 1) AS img FROM products p WHERE p.id IN (' . $array_to_question_marks . ')');
    // Leverage the array_column function to retrieve only the id's of the products
    $stmt->execute(array_column($products_in_cart, 'id'));
    // Fetch the products from the database and return the result as an Array
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Iterate the products in cart and add the meta data (product name, desc, etc)
    foreach ($products_in_cart as &$cart_product) {
        foreach ($products as $product) {
            if ($cart_product['id'] == $product['id']) {
                $cart_product['meta'] = $product;
                // Calculate the subtotal
                $subtotal += (float)$cart_product['options_price'] * (int)$cart_product['quantity'];
            }
        }
    }
}
?>

<?php
//process.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {//Check it is coming from a form
	$u_name = $_POST["user_name"]; //set PHP variables like this so we can use them anywhere in code below
	$u_email = $_POST["user_email"];
	$u_text = $_POST["user_text"];
}
?>

<?=template_header('Contact us')?>


<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.getElementsByTagName("html")[0].className += " js";</script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script type="text/javascript" src="jquery.iframe-auto-height.plugin.js"></script>
  <link href="form/css/reset.css" rel="stylesheet">
  <link href="form/css/style.css" rel="stylesheet">
  <link href="form/css/1_radios-checkboxes.css" rel="stylesheet">
  <link href="form/css/2_form-template-v3.css" rel="stylesheet">

  <link href="form/script.js" rel="stylesheet">
  <link href="form/js/components.js" rel="stylesheet">
  <link href="form/js/script69.js" rel="stylesheet">

  <link href="form/script.js" rel="stylesheet">
  <link href="form/style.css" rel="stylesheet">

  <title>Contact us</title>
</head>
<style>

.content {
    top:65px;
    overflow: hidden;
    bottom: 0px;
    width: 100%;
    position: fixed;
}

.content > iframe {
    height: 100%;
    width : 100%;
}


    .flexbox {
      overflow: hidden;
      background-color: white;
      margin-left: 0px;
      width: auto;
      margin-top: 0px;
      display: flex;
      flex-wrap: wrap;
      align-content: stretch;
      justify-content: space-evenly;
      height: 75px;
      align-items: center;
      flex-grow: 5;
    }

    .flexbox2 {
      overflow: hidden;
      background-color: white;
      margin-left: 0px;
      width: auto;
      margin-top: 0px;
      display: flex;
      flex-wrap: wrap;
      align-content: stretch;
      justify-content: space-evenly;
      height: 75px;
      align-items: center;
      flex-grow: 5;
    }


@media only screen and (min-width: 995px){
.flexbox{
margin-top: -9px;
}

.flexbox2{
margin-top: -9px;
}
}

@media only screen and (max-width: 993px){
.flexbox{
margin-top: -5px;
}

.flexbox2{
margin-top: -5px;
}
}

@media only screen and (max-width: 993px){
.flexbox{
display: flex !important;
justify-content: space-evenly !important;
}

.flexbox2{
display: flex !important;
justify-content: space-evenly !important;
}
}

@media only screen and (max-width: 710px){
.flexbox{
display: none !important;
}

.grid.gap-lg {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
}

iframe#section{
margin-bottom: -300px;
}
}

@media only screen and (max-width: 995px){

i.far{
font-size: 14px !important;
}

i.fa{
font-size: 14px !important;
}
}

@media only screen and (max-width: 375px){
.fj3-padding-bottom-md {
    zoom: 70%;
}
}

@media only screen and (max-width: 700px){
.flexbox1 {
margin-bottom: 30px !important;
margin-top: 10px !important;
}

.fj3-btn--primary {
    width: 100%;
}

.main-footer{
display: none;
}
}

.fj3-btn--primary {
width: 100%;
}

.fj3-btn--primary:focus { 
outline: none !important;
border: 1px solid black !important;
}

@media only screen and (min-width: 990px) and (max-width: 1125px){
form.form-template-v3{
zoom: 95% !important;
}
}

@media only screen and (min-width: 1125px) and (max-width: 1230px){
form.form-template-v3{
zoom: 77% !important;
}
}

@media only screen and (min-width: 1235px) and (max-width: 1375px){
form.form-template-v3{
zoom: 87% !important;
}
}

h4{
font-weight: 500 !important;
}

</style>

<div class="flexbox1" style="display: flex; justify-content: center; margin-top: 30px; margin-bottom: 175px; ">

<form class="form-template-v3" method="post" action="process.php" >
  <fieldset class="fj3-margin-bottom-md fj3-padding-bottom-md fj3-border-bottom">
    <div class="fj3-text-component fj3-margin-bottom-md fj3-text-center">
      <h2 id="aha">Contact us</h2>
      <p>Create a ticket and our team will solve the problem</p>
    </div>

    <div class="fj3-margin-bottom-xs">
      <div class="fj3-grid fj3-gap-2xs fj3-items-center@md">
        <div class="fj3-col-4@md">
          <label class="fj3-form-label" for="user_name">Full Name:</label>
        </div>
        
        <div class="fj3-col-8@md">
          <input class="fj3-form-control fj3-width-100%" type="text" name="user_name" id="user_name">
        </div>
      </div>
    </div>

    <div class="fj3-margin-bottom-xs">
      <div class="fj3-grid fj3-gap-2xs fj3-items-center@md">
        <div class="fj3-col-4@md">
          <label class="fj3-form-label" for="user_emai">Email:</label>
          <p class="fj3-text-xs fj3-color-contrast-medium fj3-margin-top-4xs">Required</p>
        </div>
        
        <div class="fj3-col-8@md">
          <input class="fj3-form-control fj3-width-100%" type="email" name="user_email" id="user_email" required>
        </div>
      </div>
    </div>

    <div>
      <div class="fj3-grid fj3-gap-2xs fj3-items-center@md">
        <div class="fj3-col-4@md">
          <label class="fj3-form-label" for="user_text">Comment:</label>
          <p class="fj3-text-xs fj3-color-contrast-medium fj3-margin-top-4xs">Required</p>
        </div>
        
        <div class="fj3-col-8@md">
          <textarea class="fj3-form-control fj3-width-100%" name="user_text" id="user_text" required></textarea>
        </div>
      </div>
    </div>
  </fieldset>

  <div class="fj3-text-right">
    <input type="submit" value="Submit" class="fj3-btn fj3-btn--primary"></input> 
  </div>
</form>

  <script src="https://unpkg.com/codyhouse-framework/main/assets/js/util.js"></script>
  <script src="form/js/components.js"></script>
  <script src="form/script.js"></script>
</div>

</html>
<script>
  $('iframe.photo').iframeAutoHeight({
  minHeight: 240, // Sets the iframe height to this value if the calculated value is less
  heightOffset: 50 // Optionally add some buffer to the bottom
  });
</script>