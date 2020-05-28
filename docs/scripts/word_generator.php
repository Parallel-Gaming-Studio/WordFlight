<?php
// Link to the database connection string
include("../includes/db_admin.php");


$conn = $pdo;

//Retrieve variable from AJAX
$difficulty = $_GET['d'];

switch ($difficulty):
    case "easy":
        if ($conn) {
            // Select a random word and its sponsor
            // Prepare the SQL query statement
            $stmt = $conn->prepare("SELECT TOP (1) [word], [sponsor_name] FROM [FlyWithButchOhareDB_Copy].[dbo].[wordflightwords] A JOIN [FlyWithButchOhareDB_Copy].[dbo].[wordflightsponsors] B ON A.[sponsor_id]=B.[sponsor_id] WHERE LEN([word]) < 6 ORDER BY NEWID();");

            // Perform the SQL query
            $stmt->execute();

            // Save the query results
            $result = $stmt->fetchAll();

            // Pack the result with JSON and return to AJAX
            echo json_encode($result);
        } else {
            // Notify the console of any errors
            echo "<script>console.log('(" . $db_type . ")<" . $settings['database']['driver'] . "> connection to [" . $db_location . "] unsuccessful.');</script>";
        };
        break;
    case "medium":
        if ($conn) {
            // Select a random word and its sponsor
            // Prepare the SQL query statement
            $stmt = $conn->prepare("SELECT TOP (1) [word], [sponsor_name] FROM [FlyWithButchOhareDB_Copy].[dbo].[wordflightwords] A JOIN [FlyWithButchOhareDB_Copy].[dbo].[wordflightsponsors] B ON A.[sponsor_id]=B.[sponsor_id] WHERE LEN([word]) < 9 ORDER BY NEWID();");

            // Perform the SQL query
            $stmt->execute();

            // Save the query results
            $result = $stmt->fetchAll();

            // Pack the result with JSON and return to AJAX
            echo json_encode($result);
        } else {
            // Notify the console of any errors
            echo "<script>console.log('(" . $db_type . ")<" . $settings['database']['driver'] . "> connection to [" . $db_location . "] unsuccessful.');</script>";
        }
        break;
    case "hard":
        if ($conn) {
            // Select a random word and its sponsor
            // Prepare the SQL query statement
            $stmt = $conn->prepare("SELECT TOP (1) [word], [sponsor_name] FROM [FlyWithButchOhareDB_Copy].[dbo].[wordflightwords] A JOIN [FlyWithButchOhareDB_Copy].[dbo].[wordflightsponsors] B ON A.[sponsor_id]=B.[sponsor_id] ORDER BY NEWID();");

            // Perform the SQL query
            $stmt->execute();

            // Save the query results
            $result = $stmt->fetchAll();

            // Pack the result with JSON and return to AJAX
            echo json_encode($result);
        } else {
            // Notify the console of any errors
            echo "<script>console.log('(" . $db_type . ")<" . $settings['database']['driver'] . "> connection to [" . $db_location . "] unsuccessful.');</script>";
        };
        break;
    default:
        echo "<script>console.log('Error: Difficulty not set')";
endswitch;


$conn = null;
