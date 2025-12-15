CREATE DATABASE IF NOT EXISTS cradiahi_db;
USE cradiahi_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    blood_type VARCHAR(10),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recipes
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    ingredients TEXT,
    instructions TEXT,
    calories INT,
    sodium INT,
    image_url VARCHAR(255)
);

-- Saved recipes
CREATE TABLE saved_recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    recipe_id INT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, recipe_id)
);

-- Journals
CREATE TABLE journals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    type ENUM('text', 'audio'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food entries
CREATE TABLE food_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    food_name VARCHAR(200) NOT NULL,
    calories INT,
    sodium INT,
    entry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Diagnoses
CREATE TABLE diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    doctor_id INT,
    diagnosis TEXT NOT NULL,
    prescriptions TEXT,
    suggestions TEXT,
    diagnosis_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Streaks
CREATE TABLE streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type VARCHAR(50),
    streak_count INT DEFAULT 0,
    last_activity_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exercises
CREATE TABLE exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_minutes INT,
    description TEXT,
    instructions TEXT
);

-- Insert sample data
INSERT INTO recipes (title, ingredients, instructions, calories, sodium) VALUES
('Grilled Chicken Salad', 'Chicken breast, lettuce, tomatoes, cucumber, olive oil', '1. Grill chicken breast until cooked through. 2. Wash and chop vegetables. 3. Mix all ingredients in a bowl. 4. Drizzle with olive oil.', 350, 400),
('Quinoa Bowl', 'Quinoa, bell peppers, onions, black beans, corn', '1. Cook quinoa according to package instructions. 2. Chop and sauté vegetables. 3. Mix quinoa and vegetables. 4. Add black beans and corn.', 420, 300),
('Oatmeal with Berries', 'Rolled oats, mixed berries, honey, almonds', '1. Cook oats with water or milk. 2. Top with fresh berries. 3. Drizzle with honey and add almonds.', 280, 50);

INSERT INTO doctors (name, specialization, email, phone) VALUES
('Dr. Sarah Johnson', 'General Practitioner', 'sarah.j@cradiahi.com', '+1234567890'),
('Dr. Michael Chen', 'Cardiologist', 'michael.c@cradiahi.com', '+0987654321'),
('Dr. Emily White', 'Nutritionist', 'emily.w@cradiahi.com', '+1122334455');

INSERT INTO exercises (name, duration_minutes, description, instructions) VALUES
('Morning Full Body Stretch', 3, 'A series of stretches to wake up your body.', '1. Neck rolls (10 seconds each side). 2. Arm circles (10 seconds each direction). 3. Forward fold (30 seconds). 4. Quad stretch (15 seconds each leg). 5. Chest stretch (15 seconds).'),
('Deep Breathing Exercise', 3, 'Calm your mind and reduce stress with focused breathing.', '1. Sit comfortably. 2. Inhale slowly through your nose for 4 counts. 3. Hold your breath for 4 counts. 4. Exhale slowly through your mouth for 4 counts. 5. Repeat for the full duration.'),
('Desk Chair Yoga', 3, 'Simple stretches you can do at your desk.', '1. Seated cat-cow stretch (30 seconds). 2. Seated spinal twist (15 seconds each side). 3. Wrist and finger stretches (30 seconds). 4. Ankle rolls (15 seconds each ankle). 5. Seated pigeon pose (30 seconds each side).');
