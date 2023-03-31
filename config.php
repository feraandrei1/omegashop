<?php
// Database hostname, don't change this unless your hostname is different
define('db_host','localhost');
// Database username
define('db_user','root');
// Database password
define('db_pass','');
// Database name
define('db_name','omegashopdatabase');
// This will change the title on the website
define('site_name','Omega Shop');
// Currency code, default is USD, you can view the list here: http://cactus.io/resources/toolbox/html-currency-symbol-codes
define('currency_code','&dollar;');
// Featured image URL
define('featured_image','uploads/featured-image.jpg');
// Default payment status
define('default_payment_status','Completed');
// Account required for checkout?
define('account_required',false);
// The from email that will appear on the customer's order details email
define('mail_from','noreply@yourwebsite.com');
// Send mail to the customers, etc?
define('mail_enabled',true);
// Your email
define('email','you@yourwebsite.com');
// Receive email notifications?
define('email_notifications',true);
// Rewrite URL?
define('rewrite_url',false);

/* Pay on Delivery */
define('pay_on_delivery_enabled',true);

/* PayPal */
// Accept payments with PayPal?
define('paypal_enabled',false);
// Your business email account, this is where you'll receive the money
define('paypal_email','yourpaypal@email.com');
// If the test mode is set to true it will use the PayPal sandbox website, which is used for testing purposes.
// Read more about PayPal sandbox here: https://developer.paypal.com/developer/accounts/
// Set this to false when you're ready to start accepting payments on your business account
define('paypal_testmode',true);
// Currency to use with PayPal, default is USD
define('paypal_currency','USD');
// PayPal IPN url, this should point to the IPN file located in the "ipn" directory
define('paypal_ipn_url','https://yourwebsite.com/ipn/paypal.php');
// PayPal cancel URl, the page the customer returns to when they cancel the payment
define('paypal_cancel_url','https://yourwebsite.com/cart');
// PayPal return URL, the page the customer returns to after the payment has been made:
define('paypal_return_url','https://yourwebsite.com/placeorder');

/* Stripe */
// Accept payments with Stripe?
define('stripe_enabled',true);
// Stripe Secret API Key
define('stripe_secret_key','');
// Stripe Publishable API Key
define('stripe_publish_key','');
// Stripe currency
define('stripe_currency','USD');
// Stripe IPN url, this should point to the IPN file located in the "ipn" directory
define('stripe_ipn_url','https://yourwebsite.com/ipn/stripe.php');
// Stripe cancel URl, the page the customer returns to when they cancel the payment
define('stripe_cancel_url','https://yourwebsite.com/cart');
// Stripe return URL, the page the customer returns to after the payment has been made
define('stripe_return_url','https://yourwebsite.com/placeorder');

/* Coinbase */
// Create a new webhook endpoint in the coinbase commerce dashboard and add the full url to the IPN file along with the key parameter
// Webhook endpoint URL example: https://yourwebsite.com/omegashop/ipn/coinbase.php?key=SAME_AS_COINBASE_SECRET
// Accept payments with coinbase?
define('coinbase_enabled',false);
// Coinbase API Key
define('coinbase_key','');
// Coinbase Secret
define('coinbase_secret','');
// Coinbase currency
define('coinbase_currency','USD');
// Coinbase cancel URl, the page the customer returns to when they cancel the payment
define('coinbase_cancel_url','https://yourwebsite.com/cart');
// Coinbase return URL, the page the customer returns to after the payment has been made
define('coinbase_return_url','https://yourwebsite.com/placeorder');
?>