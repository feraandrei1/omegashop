<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {//Check it is comming from a form

	//mysql credentials
	$mysql_host = "localhost";
	$mysql_username = "username";
	$mysql_password = "password";
	$mysql_database = "omegashopdatabase";
	
	$u_name = filter_var($_POST["user_name"], FILTER_UNSAFE_RAW); //set PHP variables like this so we can use them anywhere in code below
	$u_email = filter_var($_POST["user_email"], FILTER_SANITIZE_EMAIL);
	$u_text = filter_var($_POST["user_text"], FILTER_UNSAFE_RAW);

	if (empty($u_name)){
		die("Please enter your name");
	}
	if (empty($u_email) || !filter_var($u_email, FILTER_VALIDATE_EMAIL)){
		die("Please enter valid email address");
	}
		
	if (empty($u_text)){
		die("Please enter text");
	}

	//Open a new connection to the MySQL server
	//see https://www.sanwebe.com/2013/03/basic-php-mysqli-usage for more info
	$mysqli = new mysqli($mysql_host, $mysql_username, $mysql_password, $mysql_database);
	
	//Output any connection error
	if ($mysqli->connect_error) {
		die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
	}	
	
	$statement = $mysqli->prepare("INSERT INTO tickets (user_name, user_email, user_message) VALUES(?, ?, ?)"); //prepare sql insert query
	//bind parameters for markers, where (s = string, i = integer, d = double,  b = blob)
	$statement->bind_param('sss', $u_name, $u_email, $u_text); //bind values and execute insert query

	if($statement->execute()){

	$done = "Hello " . $u_name . ", your message has been sent.";

	echo $done;

    echo '<style>
        body {
		display: flex;
		align-items: center;
    	justify-content: center;
		font-weight: normal;
		font-size: 24px;
        }
        </style>';

	}
}
?>