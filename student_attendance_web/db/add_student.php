<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->student_id)) {
    try {
        $stmt = $pdo->prepare("INSERT INTO students (student_id, full_name, section) VALUES (?, ?, ?)");
        $stmt->execute([$data->student_id, $data->full_name, $data->section]);
        echo json_encode(["success" => true, "message" => "Student registered successfully!"]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["success" => false, "message" => "Student ID already exists."]);
        } else {
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
    }
}
?>