<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        // Get food entries for specific date
        $query = "SELECT * FROM food_entries WHERE user_id = :user_id AND entry_date = :date";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":date", $_GET['date']);
        $stmt->execute();
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate totals
        $total_calories = array_sum(array_column($entries, 'calories'));
        $total_sodium = array_sum(array_column($entries, 'sodium'));
        
        echo json_encode([
            "entries" => $entries,
            "totals" => [
                "calories" => $total_calories,
                "sodium" => $total_sodium
            ]
        ]);
    } else {
        // Get recent food entries
        $query = "SELECT * FROM food_entries WHERE user_id = :user_id ORDER BY entry_date DESC LIMIT 10";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($entries);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO food_entries (user_id, food_name, calories, sodium, entry_date) 
              VALUES (:user_id, :food_name, :calories, :sodium, :entry_date)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":food_name", $data->food_name);
    $stmt->bindParam(":calories", $data->calories);
    $stmt->bindParam(":sodium", $data->sodium);
    $stmt->bindParam(":entry_date", $data->entry_date);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Food entry added successfully"]);
    }
}
?>