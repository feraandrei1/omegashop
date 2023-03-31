<?php
define('shoppingcart', true);
include '../config.php';
include '../functions.php';
// Include stripe lib
require_once('../lib/stripe/init.php');
\Stripe\Stripe::setApiKey(stripe_secret_key);
if (!isset($_GET['key'], $_SERVER['HTTP_STRIPE_SIGNATURE'])) {
    exit('No key and/or signature specified!');
}
$endpoint_secret = $_GET['key'];
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;
try {
    $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
} catch(\UnexpectedValueException $e) {
    http_response_code(400);
    exit;
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit;
}
// Retrieve all items
function get_line_items_data($id, $sessions, $starting_after = null) {
    $data = [];
    if ($starting_after != null) {
        $line_items = $sessions->allLineItems($id, ['limit' => 99, 'starting_after' => $starting_after]);
    } else {
        $line_items = $sessions->allLineItems($id, ['limit' => 99]);
    }
    $data = $line_items->data;
    if ($line_items->has_more) {
        $item = end($data);
        $data = $data + get_line_items_data($id, $sessions, $item->id);
    }
    return $data;
}
// Check whether the customer completed the checkout process
if ($event->type == 'checkout.session.completed') {
    $intent = $event->data->object;
    $stripe = new \Stripe\StripeClient(stripe_secret_key);
    // Transaction is verified and successful...
    $pdo = pdo_connect_mysql();
    $products_in_cart = [];
    $subtotal = 0.00;
    $shippingtotal = 0.00;
    $shippingmethod = '';
    $line_items = get_line_items_data($intent->id, $stripe->checkout->sessions);
    $discount_code = isset($intent->metadata->discount_code) ? $intent->metadata->discount_code : '';
    // Iterate the cart items and insert the transaction items into the MySQL database
    foreach ($line_items as $line_item) {
        // Retrieve product metadata
        $product = $stripe->products->retrieve($line_item->price->product);
        // Product related variables
        $item_options = isset($product->metadata->item_options) ? $product->metadata->item_options : '';
        $item_shipping = isset($product->metadata->item_shipping) ? $product->metadata->item_shipping : 0.00;
        // Update shipping variables if item is shipping
        if ($product->metadata->item_id == 'shipping') {
            $shippingtotal = floatval($line_item->price->unit_amount) / 100;
            $shippingmethod = isset($product->metadata->shipping_method) ? $product->metadata->shipping_method : '';
            continue;
        }
        // Update product quantity in the products table
        $stmt = $pdo->prepare('UPDATE products SET quantity = quantity - ? WHERE quantity > 0 AND id = ?');
        $stmt->execute([ $line_item->quantity, $product->metadata->item_id ]);
        // Deduct option quantities
        if ($item_options) {
            $options = explode(',', $item_options);
            foreach ($options as $opt) {
                $option_name = explode('-', $opt)[0];
                $option_value = explode('-', $opt)[1];
                $stmt = $pdo->prepare('UPDATE products_options SET quantity = quantity - ? WHERE quantity > 0 AND title = ? AND (name = ? OR name = "")');
                $stmt->execute([ $line_item->quantity, $option_name, $option_value ]);                
            }
        }
        // Insert product into the "transactions_items" table
        $stmt = $pdo->prepare('INSERT INTO transactions_items (txn_id, item_id, item_price, item_quantity, item_options) VALUES (?,?,?,?,?)');
        $stmt->execute([ $intent->payment_intent, $product->metadata->item_id, floatval($line_item->price->unit_amount) / 100, $line_item->quantity, $item_options ]);
        // Add product to array
        $products_in_cart[] = [
            'id' => $product->metadata->item_id,
            'quantity' => $line_item->quantity,
            'options' => $item_options,
            'final_price' => floatval($line_item->price->unit_amount) / 100,
            'meta' => [
                'name' => $line_item->description,
                'price' => floatval($line_item->price->unit_amount) / 100
            ]
        ];
        // Add product price to the subtotal variable
        $subtotal += (floatval($line_item->price->unit_amount) / 100) * intval($line_item->quantity);
    }
    // Insert the transaction into our transactions table
    $stmt = $pdo->prepare('INSERT INTO transactions (txn_id, payment_amount, payment_status, created, payer_email, first_name, last_name, address_street, address_city, address_state, address_zip, address_country, account_id, payment_method, shipping_method, shipping_amount, discount_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE payment_status = VALUES(payment_status)');
    $stmt->execute([
        $intent->payment_intent,
        $subtotal+$shippingtotal,
        default_payment_status,
        date('Y-m-d H:i:s'),
        $intent->customer_email,
        $intent->metadata->first_name,
        $intent->metadata->last_name,
        $intent->metadata->address_street,
        $intent->metadata->address_city,
        $intent->metadata->address_state,
        $intent->metadata->address_zip,
        $intent->metadata->address_country,
        $intent->metadata->account_id,
        'stripe',
        $shippingmethod,
        $shippingtotal,
        $discount_code
    ]);
    $order_id = $pdo->lastInsertId();
    // Send order details to the customer's email address
    send_order_details_email(
        $intent->customer_email,
        $products_in_cart,
        $intent->metadata->first_name,
        $intent->metadata->last_name,
        $intent->metadata->address_street,
        $intent->metadata->address_city,
        $intent->metadata->address_state,
        $intent->metadata->address_zip,
        $intent->metadata->address_country,
        $subtotal+$shippingtotal,
        $order_id
    );
}
?>