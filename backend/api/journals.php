<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM journals WHERE user_id = :user_id ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    $journals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($journals);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO journals (user_id, content, type) VALUES (:user_id, :content, :type)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":content", $data->content);
    $stmt->bindParam(":type", $data->type);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Journal entry saved successfully", "id" => $db->lastInsertId()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "DELETE FROM journals WHERE id = :id AND user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id);
    $stmt->bindParam(":user_id", $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Journal entry deleted successfully"]);
    }
}
?>