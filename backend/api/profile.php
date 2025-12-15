<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user profile
    $query = "SELECT * FROM users WHERE id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get emergency contacts
    $contact_query = "SELECT * FROM emergency_contacts WHERE user_id = :user_id";
    $contact_stmt = $db->prepare($contact_query);
    $contact_stmt->bindParam(":user_id", $user_id);
    $contact_stmt->execute();
    
    $contacts = $contact_stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "user" => $user,
        "emergency_contacts" => $contacts
    ]);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update profile
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "UPDATE users SET name = :name, age = :age, blood_type = :blood_type, allergies = :allergies WHERE id = :user_id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":age", $data->age);
    $stmt->bindParam(":blood_type", $data->blood_type);
    $stmt->bindParam(":allergies", $data->allergies);
    $stmt->bindParam(":user_id", $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Profile updated successfully"]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add emergency contact
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO emergency_contacts (user_id, name, phone, relationship) VALUES (:user_id, :name, :phone, :relationship)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":relationship", $data->relationship);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Emergency contact added successfully"]);
    }
}
?>