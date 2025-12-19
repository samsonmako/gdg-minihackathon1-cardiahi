# gdg-minihackathon1
HealthTech- Technology for wellness

---
##Team
---
- Samson Makori

--

## Project Overview

- CradiaHi is a comprehensive healthcare management system designed to help patients track their health metrics, manage appointments, and maintain a healthy lifestyle. The platform includes features for:

- **Health Metrics Tracking**: Monitor vital signs, blood pressure, heart rate, weight, BMI, blood sugar, and temperature
- **Appointment Management**: Schedule and manage doctor appointments with reminders
- **Medication Management**: Track medications, set reminders, and monitor adherence
- **Nutrition Tracking**: Log meals, track calories and sodium intake
- **Health Journal**: Document symptoms and health-related notes
- **Emergency Contacts**: Store and manage emergency contact information
- **Goals Setting**: Set and track health and fitness goals
- **Doctor Dashboard**: Healthcare provider interface for patient management

---

## Wellness relevance 

- It digitizes the health care system in which patients have to keep track of their prescriptions through a book and also help patients who at the same time have to keep up with doctors recommendations 

---
##
## How to use

# Running React (Frontend) + PHP (Backend) Application

## Prerequisites
Make sure you have the following installed:

- Git
- Node.js (v18 recommended)
- npm or yarn
- PHP (>= 8.0)
- MySQL / MariaDB
- Apache or PHP built-in server

---

## 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. Setup Backend (PHP)

### 2.1 Switch to Backend Branch
```bash
git checkout backend-dev
```

### 2.2 Configure Environment
Update your database credentials in the config file or `.env`:

```env
DB_HOST=localhost
DB_NAME=your_database
DB_USER=root
DB_PASS=
```

### 2.3 Import Database
```bash
mysql -u root -p your_database < database.sql
```

### 2.4 Start PHP Server
```bash
php -S localhost:8000
```

Backend URL:
```
http://localhost:8000
```

---

## 3. Setup Frontend (React)

### 3.1 Switch to Frontend Branch
```bash
git checkout frontend-dev
```

### 3.2 Navigate to Frontend Folder
```bash
cd frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

### 3.4 Configure API Base URL
Edit `src/global.ts`:

```ts
export const base_host = "http://localhost:8000";
```

---

## 4. Run Frontend
```bash
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## 5. Running Both Together
- Start backend first
- Then start frontend
- Ensure CORS is enabled in PHP

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
```

---

## 6. Build for Production
```bash
npm run build
```

Upload the `dist/` folder and point it to the backend API.

---

## Done ✅
Your React + PHP application is now running.

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- CSS

## Backend
- PHP

## Database
- MySQL

## Tooling & DevOps
- Git
- npm


