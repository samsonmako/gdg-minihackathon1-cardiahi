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
