<?php
header('Content-Type: application/json');
require_once 'db.php';

if (isset($_GET['section'])) {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE section = ? ORDER BY full_name ASC");
    $stmt->execute([$_GET['section']]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $students]);
}
?>