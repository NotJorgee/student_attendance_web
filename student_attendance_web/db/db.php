<?php
$host = 'localhost';
$db_name = 'student_attendance_web';
$username = 'root'; // Default XAMPP username
$password = '';     // Default XAMPP password

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database and tables automatically on first run
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
    $pdo->exec("USE `$db_name`");

    $pdo->exec("CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        section VARCHAR(50) NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    )");
} catch(PDOException $e) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]));
}
?>