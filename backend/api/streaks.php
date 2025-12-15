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
    if (isset($_GET['exercises'])) {
        // Get exercises
        $query = "SELECT * FROM exercises";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($exercises);
    } else {
        // Get user streaks
        $query = "SELECT * FROM streaks WHERE user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        $streaks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($streaks);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Check if streak exists
    $check_query = "SELECT * FROM streaks WHERE user_id = :user_id AND activity_type = :activity_type";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":user_id", $user_id);
    $check_stmt->bindParam(":activity_type", $data->activity_type);
    $check_stmt->execute();
    $existing_streak = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    $today = date('Y-m-d');
    
    if ($existing_streak) {
        // Update existing streak
        $last_activity = $existing_streak['last_activity_date'];
        $yesterday = date('Y-m-d', strtotime('-1 day'));
        
        if ($last_activity === $yesterday || $last_activity === $today) {
            // Increment streak
            $new_count = $existing_streak['streak_count'] + 1;
        } else {
            // Reset streak
            $new_count = 1;
        }
        
        $query = "UPDATE streaks SET streak_count = :streak_count, last_activity_date = :today 
                  WHERE user_id = :user_id AND activity_type = :activity_type";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":streak_count", $new_count);
        $stmt->bindParam(":today", $today);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":activity_type", $data->activity_type);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Streak updated successfully", "streak_count" => $new_count]);
        }
    } else {
        // Create new streak
        $query = "INSERT INTO streaks (user_id, activity_type, streak_count, last_activity_date) 
                  VALUES (:user_id, :activity_type, 1, :today)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":activity_type", $data->activity_type);
        $stmt->bindParam(":today", $today);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Streak created successfully", "streak_count" => 1]);
        }
    }
}
?>
