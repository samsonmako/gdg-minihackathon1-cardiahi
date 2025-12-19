import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Activity,
  Utensils,
  Stethoscope,
  Flame,
  Calendar,
  NotebookPen,
  Users
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>CardiaHi – Protect Your Heart, Every Day</h1>
          <p>
            CardiaHi is a heart-focused health companion designed for people who
            already have heart conditions or want to avoid developing heart
            problems. The app helps you avoid harmful habits, follow doctor
            instructions, eat better, stay active, and understand how your daily
            choices affect your heart health.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="cta-button">
              Start Protecting Your Heart
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>How CardiaHi Helps Your Heart</h2>

        <div className="feature-grid">

          {/* PROFILE */}
          <div className="feature-card">
            <Users className="feature-icon" size={40} />
            <h3>Personal Health Profile</h3>
            <p>
              Create and manage your personal health profile with important heart-
              related details. You can also add emergency contacts so your critical
              information is always available when needed.
            </p>
          </div>

          {/* DOCTOR */}
          <div className="feature-card">
            <Stethoscope className="feature-icon" size={40} />
            <h3>Doctor Diagnosis & Prescriptions</h3>
            <p>
              If you are diagnosed with a heart condition, a doctor can add your
              diagnosis, prescriptions, and daily instructions. CardiaHi helps you
              follow these medical instructions correctly every day.
            </p>
          </div>

          {/* FOOD */}
          <div className="feature-card">
            <Utensils className="feature-icon" size={40} />
            <h3>Meal Suggestions for Heart Health</h3>
            <p>
              Get meal suggestions that support heart health. Suggestions are based
              on safer food choices, your budget, and what is commonly available in
              your area.
            </p>
          </div>

          {/* ANALYSIS */}
          <div className="feature-card">
            <Flame className="feature-icon" size={40} />
            <h3>Food Intake & Nutrition Analysis</h3>
            <p>
              Enter what you have eaten during the day and CardiaHi will analyze
              calories and sodium levels. This helps you understand how your meals
              may improve or worsen your heart condition.
            </p>
          </div>

          {/* EXERCISE */}
          <div className="feature-card">
            <Activity className="feature-icon" size={40} />
            <h3>Daily Exercise Streaks</h3>
            <p>
              Maintain healthy habits through short daily exercises. CardiaHi tracks
              your consistency using streaks, encouraging regular activity that
              supports heart health.
            </p>
          </div>

          {/* JOURNAL */}
          <div className="feature-card">
            <NotebookPen className="feature-icon" size={40} />
            <h3>Daily Feeling Journals</h3>
            <p>
              Record how you feel each day using text or audio journals. Users can
              relate their feelings to what they ate and the activities they
              completed, helping identify patterns affecting heart health.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How CardiaHi Works</h2>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Set Up Your Heart Profile</h3>
            <p>
              Create an account, add your health information, and include emergency
              contacts for safety.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Follow Daily Guidance</h3>
            <p>
              Log meals, follow doctor prescriptions, complete exercises, and
              journal how you feel each day.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Build Heart-Healthy Habits</h3>
            <p>
              Track progress, maintain streaks, and gradually avoid habits that
              could worsen or cause heart problems.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <div className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Heart className="icon" size={25} />
            <span>CardiaHi</span>
          </div>
          <p>
            © {new Date().getFullYear()} CardiaHi. Helping you live a heart-healthy life.
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
