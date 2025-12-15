import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, 
  Play, 
  Pause, 
  RotateCcw,
  Award,
  Clock,
  Heart,
  Activity
} from 'lucide-react';

interface Streak {
  id: number;
  activity_type: string;
  streak_count: number;
  last_activity_date: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number;
  instructions: string;
}

const StreaksPage: React.FC = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreaks();
      fetchExercises();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const fetchStreaks = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost/backend/api/streaks.php?user_id=${user.id}`);
      setStreaks(response.data);
    } catch (error) {
      console.error('Error fetching streaks:', error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost/backend/api/exercises.php');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setTimeRemaining(exercise.duration * 60);
    setIsTimerRunning(true);
  };

  const handlePauseResume = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetExercise = () => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60);
      setIsTimerRunning(false);
    }
  };

  const handleExerciseComplete = async () => {
    if (!user || !currentExercise) return;
    
    try {
      await axios.post(`http://localhost/backend/api/streaks.php?user_id=${user.id}`, {
        activity_type: currentExercise.name,
        completed: true
      });
      
      setCurrentExercise(null);
      fetchStreaks();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="streaks-page">
        <div className="loading">Loading streaks and exercises...</div>
      </div>
    );
  }

  return (
    <div className="streaks-page">
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

      <div className="streaks-header">
        <h1>Streaks & Exercises</h1>
        <p>Build healthy habits and maintain your wellness journey</p>
      </div>

      <div className="streaks-container">
        <div className="streaks-section">
          <h2><TrendingUp className="icon" size={24} /> Your Streaks</h2>
          <div className="streaks-list">
            {streaks.length === 0 ? (
              <div className="no-streaks">
                <Award size={48} />
                <h3>No Streaks Yet</h3>
                <p>Start completing daily activities to build your streaks!</p>
              </div>
            ) : (
              streaks.map((streak) => (
                <div key={streak.id} className="streak-item">
                  <div className="streak-info">
                    <h3>{streak.activity_type}</h3>
                    <p>Last activity: {new Date(streak.last_activity_date).toLocaleDateString()}</p>
                  </div>
                  <div className="streak-count">
                    <span className="count">{streak.streak_count}</span>
                    <span className="label">days</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="exercises-section">
          <h2><Activity className="icon" size={24} /> Daily Exercises</h2>
          
          {currentExercise ? (
            <div className="exercise-timer">
              <div className="timer-header">
                <h3>{currentExercise.name}</h3>
                <p>{currentExercise.description}</p>
              </div>
              
              <div className="timer-display">
                {formatTime(timeRemaining)}
              </div>
              
              <div className="timer-instructions">
                <p>{currentExercise.instructions}</p>
              </div>
              
              <div className="timer-controls">
                <button 
                  className="btn btn-primary"
                  onClick={handlePauseResume}
                >
                  {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleResetExercise}
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="exercises-list">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-header">
                    <h3>{exercise.name}</h3>
                    <span className="duration">
                      <Clock size={16} />
                      {exercise.duration} min
                    </span>
                  </div>
                  
                  <p className="exercise-description">{exercise.description}</p>
                  
                  <div className="exercise-instructions">
                    <p>{exercise.instructions}</p>
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => handleStartExercise(exercise)}
                  >
                    <Play size={20} />
                    Start Exercise
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fun-activities">
        <h2>Fun Wellness Activities</h2>
        <div className="activities-grid">
          <div className="activity-card">
            <div className="activity-icon">🧘</div>
            <h3>Meditation</h3>
            <p>5-minute guided meditation session</p>
            <button className="btn btn-secondary btn-sm">Start</button>
          </div>
          <div className="activity-card">
            <div className="activity-icon">🚶</div>
            <h3>Walking Challenge</h3>
            <p>1000 steps walking challenge</p>
            <button className="btn btn-secondary btn-sm">Start</button>
          </div>
          <div className="activity-card">
            <div className="activity-icon">💧</div>
            <h3>Hydration Reminder</h3>
            <p>Drink 8 glasses of water today</p>
            <button className="btn btn-secondary btn-sm">Track</button>
          </div>
          <div className="activity-card">
            <div className="activity-icon">😴</div>
            <h3>Sleep Tracker</h3>
            <p>Log your sleep quality</p>
            <button className="btn btn-secondary btn-sm">Log</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreaksPage;