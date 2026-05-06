<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
    try {
        $stmt = $pdo->prepare("INSERT INTO teachers (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$data->username, $password_hash]);
        echo json_encode(["success" => true, "message" => "Account created!"]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["success" => false, "message" => "Username already exists."]);
        } else {
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
    }
}
?>