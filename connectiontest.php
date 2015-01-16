
<?php

$db_host = "localhost";
$db_username = "djamro2_dan96";
$db_pass = "djman55!";
$db_name = "djamro2_emails";

@mysql_connect("$db_host", "$db_username", "$db_pass") or die ("Could not connect to mySQL: " . mysql_error());
@mysql_select_db("$db_name") or die ("No database of that name");

echo "Successful connection";
?>