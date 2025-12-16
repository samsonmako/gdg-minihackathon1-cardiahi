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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id']) && isset($_GET['saved'])) {
        // Get saved recipes for user
        $query = "SELECT r.* FROM recipes r 
                  JOIN saved_recipes sr ON r.id = sr.recipe_id 
                  WHERE sr.user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $_GET['user_id']);
        $stmt->execute();
        $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($recipes);
    } else if (isset($_GET['random'])) {
        // Get random recipe
        $query = "SELECT * FROM recipes ORDER BY RAND() LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($recipe);
    } else {
        // Get all recipes
        $query = "SELECT * FROM recipes";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($recipes);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save recipe for user
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO saved_recipes (user_id, recipe_id) VALUES (:user_id, :recipe_id) 
              ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id",  $_GET['user_id']);
    $stmt->bindParam(":recipe_id", $data->recipe_id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Recipe saved successfully"]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Remove saved recipe
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "DELETE FROM saved_recipes WHERE user_id = :user_id AND recipe_id = :recipe_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":recipe_id", $data->recipe_id);
    
    if ($stmt->execute()) {
        echo json_encode(["message" => "Recipe removed successfully"]);
    }
}
?>