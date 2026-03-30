<?php
header('Content-Type: application/json');
require_once 'db.php';

$records = json_decode(file_get_contents("php://input"), true);

if (!empty($records)) {
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)");
        
        foreach ($records as $record) {
            $stmt->execute([$record['student_id'], $record['date'], $record['status']]);
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Attendance saved successfully!"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Failed to save attendance."]);
    }
}
?>