<?php
header('Content-Type: application/json');
require_once 'db.php';

if (isset($_GET['date']) && isset($_GET['section'])) {
    $date = $_GET['date'];
    $section = $_GET['section'];

    $stmt = $pdo->prepare("
        SELECT s.student_id, s.full_name, s.section, a.status 
        FROM students s
        JOIN attendance a ON s.student_id = a.student_id
        WHERE a.date = ? AND s.section = ?
        ORDER BY s.full_name ASC
    ");
    $stmt->execute([$date, $section]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($rows) === 0) {
        echo json_encode(["success" => false, "message" => "No records found."]);
        exit;
    }

    $csvContent = "Student ID,Full Name,Section,Status,Date\n";
    foreach ($rows as $row) {
        $csvContent .= "\"{$row['student_id']}\",\"{$row['full_name']}\",\"{$row['section']}\",\"{$row['status']}\",\"{$date}\"\n";
    }

    // Return the raw CSV string to JavaScript so it can trigger the download
    echo json_encode(["success" => true, "csv_data" => $csvContent]);
}
?>