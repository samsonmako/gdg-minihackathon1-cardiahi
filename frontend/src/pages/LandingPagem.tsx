import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Activity,
  Users,
  Stethoscope,
  Utensils,
  Flame,
  Mic
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>CardiaHi – Your Daily Health Companion</h1>
          <p>
            CardiaHi is a medical and lifestyle support application designed to help
            you manage your health every single day. From food tracking and doctor
            instructions to exercises, journals, and emergency contacts — everything
            you need is in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="cta-button">
              Create Free Account
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>What You Can Do With CardiaHi</h2>

        <div className="feature-grid">

          {/* PROFILE */}
          <div className="feature-card">
            <Users className="feature-icon" size={40} />
            <h3>User Profile & Emergency Contacts</h3>
            <p>
              Users can create and edit their personal profile, including important
              medical details. You can also add emergency contacts so that vital
              information is always available when needed.
            </p>
          </div>

          {/* RECIPES */}
          <div className="feature-card">
            <Utensils className="feature-icon" size={40} />
            <h3>Random & Saved Recipes</h3>
            <p>
              CardiaHi provides random recipe suggestions to help users discover
              healthy meals. You can save your favorite recipes and reuse them
              anytime when planning meals.
            </p>
          </div>

          {/* JOURNALS */}
          <div className="feature-card">
            <Mic className="feature-icon" size={40} />
            <h3>Text & Audio Health Journals</h3>
            <p>
              Keep track of how you feel every day by writing journal entries or
              recording audio notes. This helps users monitor emotional and physical
              health progress over time.
            </p>
          </div>

          {/* FOOD TRACKING */}
          <div className="feature-card">
            <Flame className="feature-icon" size={40} />
            <h3>Food, Calories & Sodium Tracking</h3>
            <p>
              Log what you eat daily and automatically calculate calorie and sodium
              intake. CardiaHi also suggests meals based on your budget and the food
              available in your local area.
            </p>
          </div>

          {/* DOCTOR */}
          <div className="feature-card">
            <Stethoscope className="feature-icon" size={40} />
            <h3>Doctor Diagnosis & Prescriptions</h3>
            <p>
              If a user is not yet diagnosed, a doctor can add medical diagnoses,
              prescriptions, and daily health instructions. Once added, users can
              follow these instructions inside the app.
            </p>
          </div>

          {/* STREAKS */}
          <div className="feature-card">
            <Activity className="feature-icon" size={40} />
            <h3>Daily Streaks & Exercises</h3>
            <p>
              Complete daily 3-minute exercises and other fun health activities.
              CardiaHi tracks your consistency and builds streaks to encourage
              long-term healthy habits.
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
            <h3>Create Your Account</h3>
            <p>
              Register and set up your personal health profile, including emergency
              contacts and basic medical information.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Track & Follow Guidance</h3>
            <p>
              Log food, write journals, follow doctor prescriptions, and complete
              daily exercises recommended for your condition.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Build Healthy Streaks</h3>
            <p>
              Check in daily, stay consistent, and build streaks that motivate you
              to maintain a healthier lifestyle.
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
            © {new Date().getFullYear()} CardiaHi. Supporting better health, every day.
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
