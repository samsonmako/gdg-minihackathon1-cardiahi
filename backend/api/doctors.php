<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        // Get user diagnoses
        $query = "SELECT d.*, dr.name as doctor_name, dr.specialization 
                  FROM diagnoses d 
                  JOIN doctors dr ON d.doctor_id = dr.id 
                  WHERE d.user_id = :user_id 
                  ORDER BY d.diagnosis_date DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $_GET['user_id']);
        $stmt->execute();
        $diagnoses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($diagnoses);
    } else {
        // Get all doctors
        $query = "SELECT * FROM doctors";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($doctors);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO diagnoses (user_id, doctor_id, diagnosis, prescriptions, suggestions, diagnosis_date) 
              VALUES (:user_id, :doctor_id, :diagnosis, :prescriptions, :suggestions, :diagnosis_date)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":doctor_id", $data->doctor_id);
    $stmt->bindParam(":diagnosis", $data->diagnosis);
    $stmt->bindParam(":prescriptions", $data->prescriptions);
    $stmt->bindParam(":suggestions", $data->suggestions);
    $stmt->bindParam(":diagnosis_date", $data->diagnosis_date);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Diagnosis added successfully"]);
    }
}
?>