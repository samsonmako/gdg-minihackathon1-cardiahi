import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Users, BookOpen, Stethoscope, Calendar } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      

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

      <div className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Heart className="icon" size={25} />
            <span>CradiaHi</span>
          </div>
          <p>&copy; 2025 CradiaHi. Your health, our priority.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;