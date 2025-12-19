<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Get all exercises
    $query = "SELECT * FROM exercises ORDER BY name";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($exercises);
} elseif ($method == 'POST') {
    // Add new exercise
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO exercises (name, description, duration, instructions) VALUES (:name, :description, :duration, :instructions)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":duration", $data->duration);
    $stmt->bindParam(":instructions", $data->instructions);
    
    if ($stmt->execute()) {
        echo json_encode(array("message" => "Exercise created successfully."));
    } else {
        echo json_encode(array("message" => "Exercise creation failed."));
    }
}
?>
