<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'register') {
    $query = "INSERT INTO users (name, email, password, age, blood_type, allergies) VALUES (:name, :email, :password, :age, :blood_type, :allergies)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":email", $data->email);
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":age", $data->age);
    $stmt->bindParam(":blood_type", $data->bloodType);
    $stmt->bindParam(":allergies", $data->allergies);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "User registered successfully.", "userId" => $db->lastInsertId()]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Registration failed."]);
    }
} elseif ($action === 'login') {
    $query = "SELECT id, name, email, password FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($data->password, $user['password'])) {
        http_response_code(200);
        echo json_encode([
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
    }
}
?>
