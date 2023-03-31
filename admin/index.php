<?php
define('admin', true);

$base_url = isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === 1) || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ? 'https' : 'http';
$base_url .= '://' . rtrim($_SERVER['HTTP_HOST'], '/');
$base_url .= $_SERVER['SERVER_PORT'] == 80 || $_SERVER['SERVER_PORT'] == 443 || strpos($_SERVER['HTTP_HOST'], ':') !== false ? '' : ':' . $_SERVER['SERVER_PORT'];
$base_url .= '/' . ltrim(substr(str_replace('\\', '/', realpath(__DIR__)), strlen($_SERVER['DOCUMENT_ROOT'])), '/');
define('base_url', rtrim($base_url, '/') . '/');
session_start();

include '../config.php';

include '../functions.php';

$pdo = pdo_connect_mysql();

if (!isset($_SESSION['account_loggedin'])) {
    header('Location: ' . url('../index.php?page=myaccount'));
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM accounts WHERE id = ?');
$stmt->execute([ $_SESSION['account_id'] ]);
$account = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$account || $account['role'] != 'Admin') {
    header('Location: ' . url('../index.php'));
    exit;
}

$page = isset($_GET['page']) && file_exists($_GET['page'] . '.php') ? $_GET['page'] : 'dashboard';
if (isset($_GET['page']) && $_GET['page'] == 'logout') {
    session_destroy();
    header('Location: ' . url('../index.php'));
    exit;
}

$error = '';

include $page . '.php';
?>