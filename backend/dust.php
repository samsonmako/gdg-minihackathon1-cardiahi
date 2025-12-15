Frontend Setup
frontend/package.json
json
Copy code
{
  "name": "cradiahi-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@types/node": "^1^.18.0",
    "@types/react": "^2^.2.0",
    "@types/react-dom": "^2^.2.0",
    "axios": "^3^.6.0",
    "lucide-react": "^^.294.0",
    "react": "^2^.2.0",
    "react-dom": "^2^.2.0",
    "react-router-dom": "^4^.18.0",
    "react-scripts": "5.0.1",
    "typescript": "^5^.9.0",
    "web-vitals": "^6^.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox





New

New



Continue

Venice

I'll continue with the complete frontend code for your CradiaHi application.

Frontend Files (continued)
frontend/src/App.tsx
typescript
Copy code
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import FoodPage from './pages/FoodPage';
import DoctorsPage from './pages/DoctorsPage';
import StreaksPage from './pages/StreaksPage';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/food" element={
              <ProtectedRoute>
                <FoodPage />
              </ProtectedRoute>
            } />
            <Route path="/doctors" element={
              <ProtectedRoute>
                <DoctorsPage />
              </ProtectedRoute>
            } />
            <Route path="/streaks" element={
              <ProtectedRoute>
                <StreaksPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
frontend/src/contexts/AuthContext.tsx
typescript
Copy code
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cradiahi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost/backend/api/auth.php?action=login', {
        email,
        password
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('cradiahi_user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await axios.post('http://localhost/backend/api/auth.php?action=register', userData);
      if (response.data.userId) {
        await login(userData.email, userData.password);
      }
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cradiahi_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
frontend/src/App.css
css
Copy code
:root {
  --primary-red: #e74c3c;
  --primary-blue: #3498db;
  --secondary-red: #c0392b;
  --secondary-blue: #2980b9;
  --background-light: #f8f9fa;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --white: #ffffff;
  --border-color: #dee2e6;
  --success-green: #27ae60;
  --warning-yellow: #f39c12;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-light);
  color: var(--text-dark);
  line-height: 1.6;
}

.App {
  min-height: 100vh;
}

/* Navigation */
.navbar {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--white);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

/* Landing Page */
.landing-page {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  color: var(--white);
  padding: 8rem 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background: var(--white);
  color: var(--primary-blue);
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
  display: inline-block;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.features {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: var(--text-dark);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  color: var(--primary-blue);
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: var(--text-dark);
}

/* Forms */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
}

.auth-form {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 





New

New



Continue

Venice

I'll continue with the complete frontend code for your CradiaHi application.

Frontend Files (continued)
frontend/src/App.css (continued)
css
Copy code
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  color: var(--white);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--primary-red), var(--secondary-red));
  color: var(--white);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
}

.btn-success {
  background: var(--success-green);
  color: var(--white);
}

.btn-block {
  width: 100%;
  text-align: center;
}

/* Dashboard */
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.dashboard-card h3 {
  color: var(--primary-blue);
  margin-bottom: 1rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.action-btn {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
  color: var(--white);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

/* Profile Page */
.profile-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.profile-section h2 {
  color: var(--primary-blue);
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-item:last-child {
  border-bottom: none;
}

.emergency-contacts {
  margin-top: 2rem;
}

.contact-item {
  background: var(--background-light);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Food Page */
.food-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.food-tracker {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.daily-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  color: var(--white);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
}

.summary-card h3 {
  margin-bottom: 0.5rem;
}

.summary-card .value {
  font-size: 2rem;
  font-weight: bold;
}

.food-entry-form {
  margin-bottom: 2rem;
}

.food-entries-list {
  margin-top: 2rem;
}

.food-entry-item {
  background: var(--background-light);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Doctors Page */
.doctors-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.doctors-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.doctors-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.doctor-card {
  background: var(--background-light);
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid var(--primary-blue);
}

.doctor-card h4 {
  color: var(--primary-blue);
  margin-bottom: 0.5rem;
}

.diagnosis-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.diagnoses-list {
  margin-top: 2rem;
}

.diagnosis-item {
  background: var(--background-light);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary-red);
}

/* Streaks Page */
.streaks-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.streaks-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.streaks-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.exercises-section {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.streak-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--background-light);
  border-radius: 5px;
  margin-bottom: 1rem;
}

.streak-count {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-blue);
}

.exercise-card {
  background: var(--background-light);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid var(--success-green);
}

.exercise-card h4 {
  color: var(--success-green);
  margin-bottom: 0.5rem;
}

.timer-display {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin: 2rem 0;
  color: var(--primary-blue);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .





New

New



Continue

Venice

I'll continue with the complete frontend code for your CradiaHi application.

Frontend Pages
frontend/src/pages/LandingPage.tsx
typescript
Copy code
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, BookOpen, Stethoscope, Calendar } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">
          <Heart className="icon" size={30} />
          <span>CradiaHi</span>
        </div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="cta-button">Sign Up</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Your Personal Health Companion</h1>
          <p>Track your health journey with personalized recipes, medical records, daily exercises, and comprehensive wellness management.</p>
          <div className="hero-buttons">
            <Link to="/register" className="cta-button">Get Started</Link>
            <Link to="/login" className="secondary-button">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Comprehensive Health Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <Users className="feature-icon" size={40} />
            <h3>Profile Management</h3>
            <p>Edit your profile, manage emergency contacts, and keep your medical information organized</p>
          </div>
          <div className="feature-card">
            <BookOpen className="feature-icon" size={40} />
            <h3>Smart Recipes</h3>
            <p>Get personalized recipe suggestions based on your dietary needs and save your favorites</p>
          </div>
          <div className="feature-card">
            <Activity className="feature-icon" size={40} />
            <h3>Food Tracking</h3>
            <p>Track calories and sodium intake, get meal suggestions based on budget and availability</p>
          </div>
          <div className="feature-card">
            <Stethoscope className="feature-icon" size={40} />
            <h3>Doctor Connect</h3>
            <p>Manage diagnoses, prescriptions, and follow medical recommendations with streak tracking</p>
          </div>
          <div className="feature-card">
            <Calendar className="feature-icon" size={40} />
            <h3>Daily Journals</h3>
            <p>Document your health journey with text or audio journal entries</p>
          </div>
          <div className="feature-card">
            <Heart className="feature-icon" size={40} />
            <h3>Exercise & Streaks</h3>
            <p>Complete daily 3-minute exercises and build healthy habits with streak tracking</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How CradiaHi Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and set up your health profile with medical information and emergency contacts</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Track Your Health</h3>
            <p>Log food intake, follow doctor recommendations, and complete daily exercises</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Build Healthy Habits</h3>
            <p>Maintain streaks, save favorite recipes, and journal your progress</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Heart className="icon" size={25} />
            <span>CradiaHi</span>
          </div>
          <p>&copy; 2024 CradiaHi. Your health, our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
frontend/src/pages/LoginPage.tsx
typescript
Copy code
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <Heart className="auth-icon" size={40} />
          <h2>Welcome Back to CradiaHi</h2>
          <p>Sign in to continue your health journey</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
frontend/src/pages/RegisterPage.tsx
typescript
Copy code
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    bloodType: '',
    allergies: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        bloodType: formData.bloodType,
        allergies: formData.allergies
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form register-form">
        <div className="auth-header">
          <Heart className="auth-icon" size={40} />
          <h2>Join CradiaHi</h2>
          <p>Start your health journey today</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name





New

New



Continue

Venice

I'll continue with the complete frontend code for your CradiaHi application.

Frontend Pages (continued)
frontend/src/pages/RegisterPage.tsx (continued)
typescript
Copy code
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                placeholder="Your age"
                min="1"
                max="120"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bloodType">Blood Type</label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies (Optional)</label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="List any known allergies"
              rows={3}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
frontend/src/pages/Dashboard.tsx
typescript
Copy code
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Activity, 
  Stethoscope, 
  Calendar,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalCalories: number;
  totalSodium: number;
  streaksCount: number;
  savedRecipes: number;
  journalEntries: number;
  lastDoctorVisit: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCalories: 0,
    totalSodium: 0,
    streaksCount: 0,
    savedRecipes: 0,
    journalEntries: 0,
    lastDoctorVisit: 'No visits recorded'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's food entries
      const foodResponse = await axios.get(`http://localhost/backend/api/food.php?user_id=${user.id}&date=${today}`);
      const foodData = foodResponse.data;
      
      // Fetch streaks
      const streaksResponse = await axios.get(`http://localhost/backend/api/streaks.php?user_id=${user.id}`);
      const streaksData = streaksResponse.data;
      
      // Fetch saved recipes
      const recipesResponse = await axios.get(`http://localhost/backend/api/recipes.php?user_id=${user.id}&saved=true`);
      const recipesData = recipesResponse.data;
      
      // Fetch journal entries
      const journalsResponse = await axios.get(`http://localhost/backend/api/journals.php?user_id=${user.id}`);
      const journalsData = journalsResponse.data;
      
      // Fetch diagnoses
      const diagnosesResponse = await axios.get(`http://localhost/backend/api/doctors.php?user_id=${user.id}`);
      const diagnosesData = diagnosesResponse.data;
      
      setStats({
        totalCalories: foodData.totals?.calories || 0,
        totalSodium: foodData.totals?.sodium || 0,
        streaksCount: streaksData.reduce((acc: number, streak: any) => acc + streak.streak_count, 0),
        savedRecipes: recipesData.length,
        journalEntries: journalsData.length,
        lastDoctorVisit: diagnosesData.length > 0 ? diagnosesData[0].diagnosis_date : 'No visits recorded'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your health dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Heart className="icon" size={30} />
          <span>CradiaHi</span>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/food">Food</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/streaks">Streaks</Link>
        </div>
      </nav>

      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your health overview for today</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><Activity className="icon" size={24} /> Today's Nutrition</h3>
          <div className="nutrition-stats">
            <div className="stat-item">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{stats.totalCalories}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sodium (mg)</span>
              <span className="stat-value">{stats.totalSodium}</span>
            </div>
          </div>
          <Link to="/food" className="btn btn-secondary btn-block">Track Food</Link>
        </div>

        <div className="dashboard-card">
          <h3><TrendingUp className="icon" size={24} /> Your Streaks</h3>
          <div className="streak-stats">
            <div className="stat-item">
              <span className="stat-label">Total Streak Days</span>
              <span className="stat-value">{stats.streaksCount}</span>
            </div>
          </div>
          <Link to="/streaks" className="btn btn-primary btn-block">View Streaks</Link>
        </div>

        <div className="dashboard-card">
          <h3><BookOpen className="icon" size={24} /> Saved Recipes</h3>
          <div className="recipe-stats">
            <div className="stat-item">
              <span className="stat-label">Saved Recipes</span>
              <span className="stat-value">{stats.savedRecipes}</span>
            </div>
          </div>
          <Link to="/food" className="btn btn-primary btn-block">Browse Recipes</Link>
        </div>

        <div className="dashboard-card">
          <h3><Calendar className





New

New



Continue

Venice

I'll continue with the complete frontend code for your CradiaHi application.

Frontend Pages (continued)
frontend/src/pages/Dashboard.tsx (continued)
typescript
Copy code
          <h3><Calendar className="icon" size={24} /> Journal Activity</h3>
          <div className="journal-stats">
            <div className="stat-item">
              <span className="stat-label">Total Entries</span>
              <span className="stat-value">{stats.journalEntries}</span>
            </div>
          </div>
          <Link to="/profile" className="btn btn-primary btn-block">Add Journal Entry</Link>
        </div>

        <div className="dashboard-card">
          <h3><Stethoscope className="icon" size={24} /> Medical Care</h3>
          <div className="medical-stats">
            <div className="stat-item">
              <span className="stat-label">Last Visit</span>
              <span className="stat-value">{stats.lastDoctorVisit}</span>
            </div>
          </div>
          <Link to="/doctors" className="btn btn-secondary btn-block">Manage Medical</Link>
        </div>

        <div className="dashboard-card">
          <h3><Award className="icon" size={24} /> Daily Goals</h3>
          <div className="goals-stats">
            <div className="goal-item">
              <span className="goal-label">Exercise Completed</span>
              <span className="goal-status">Pending</span>
            </div>
            <div className="goal-item">
              <span className="goal-label">Food Logged</span>
              <span className="goal-status">{stats.totalCalories > 0 ? '✓' : 'Pending'}</span>
            </div>
          </div>
          <Link to="/streaks" className="btn btn-primary btn-block">Complete Goals</Link>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/food" className="action-btn">
          <Activity size={30} />
          <span>Log Food</span>
        </Link>
        <Link to="/profile" className="action-btn">
          <Calendar size={30} />
          <span>Add Journal</span>
        </Link>
        <Link to="/streaks" className="action-btn">
          <Clock size={30} />
          <span>Quick Exercise</span>
        </Link>
        <Link to="/food" className="action-btn">
          <BookOpen size={30} />
          <span>Get Recipe</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
frontend/src/pages/ProfilePage.tsx
typescript