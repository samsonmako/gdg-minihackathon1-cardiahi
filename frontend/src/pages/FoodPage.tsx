import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Utensils, 
  Plus, 
  Save, 
  RefreshCw,
  BookOpen,
  Heart,
  X
} from 'lucide-react';

interface FoodEntry {
  id: number;
  food_name: string;
  calories: number;
  sodium: number;
  entry_date: string;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  calories: number;
  sodium: number;
}

const FoodPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tracker' | 'recipes'>('tracker');
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
  const [newFoodEntry, setNewFoodEntry] = useState({
    food_name: '',
    calories: '',
    sodium: '',
    entry_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [addingFood, setAddingFood] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFoodData();
      fetchRecipes();
    }
  }, [user]);

  const fetchFoodData = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`http://localhost/backend/api/food.php?user_id=${user.id}&date=${today}`);
      setFoodEntries(response.data.entries || []);
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost/backend/api/recipes.php');
      setRecipes(response.data);
      
      if (user) {
        const savedResponse = await axios.get(`http://localhost/backend/api/recipes.php?user_id=${user.id}&saved=true`);
        setSavedRecipes(savedResponse.data.map((r: Recipe) => r.id));
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFoodEntry = async () => {
    if (!user) return;
    
    try {
      await axios.post(`http://localhost/backend/api/food.php?user_id=${user.id}`, {
        ...newFoodEntry,
        calories: parseInt(newFoodEntry.calories),
        sodium: parseInt(newFoodEntry.sodium)
      });
      
      setNewFoodEntry({
        food_name: '',
        calories: '',
        sodium: '',
        entry_date: new Date().toISOString().split('T')[0]
      });
      setAddingFood(false);
      fetchFoodData();
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  const handleSaveRecipe = async (recipeId: number) => {
    if (!user) return;
    
    try {
      await axios.post(`http://localhost/backend/api/recipes.php?user_id=\${user.id}`, {
        recipe_id: recipeId
      });
      
      setSavedRecipes([...savedRecipes, recipeId]);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleUnsaveRecipe = async (recipeId: number) => {
    if (!user) return;
    
    try {
      await axios.delete(`http://localhost/backend/api/recipes.php`, {
        data: { user_id: user.id, recipe_id: recipeId }
      });
      
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } catch (error) {
      console.error('Error unsaving recipe:', error);
    }
  };

  const handleGetRandomRecipe = async () => {
    try {
      const response = await axios.get('http://localhost/backend/api/recipes.php?random=1');
      if (response.data) {
        setRecipes([response.data, ...recipes.slice(0, -1)]);
      }
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    }
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalSodium = foodEntries.reduce((sum, entry) => sum + entry.sodium, 0);

  if (loading) {
    return (
      <div className="food-page">
        <div className="loading">Loading food data...</div>
      </div>
    );
  }

  return (
    <div className="food-page">
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

      <div className="food-header">
        <h1>Nutrition & Recipes</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            <Utensils size={20} /> Food Tracker
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <BookOpen size={20} /> Recipes
          </button>
        </div>
      </div>

      {activeTab === 'tracker' && (
        <div className="food-tracker">
          <div className="daily-summary">
            <div className="summary-card">
              <h3>Today's Calories</h3>
              <div className="value">{totalCalories}</div>
              <p>Recommended: 2000</p>
            </div>
            <div className="summary-card">
              <h3>Today's Sodium</h3>
              <div className="value">{totalSodium} mg</div>
              <p>Recommended: 2300mg</p>
            </div>
          </div>

          <div className="food-entry-form">
            {!addingFood ? (
              <button className="btn btn-primary" onClick={() => setAddingFood(true)}>
                <Plus size={20} /> Add Food Entry
              </button>
            ) : (
              <div className="add-food-form">
                <h3>Add Food Entry</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Food Name</label>
                    <input
                      type="text"
                      value={newFoodEntry.food_name}
                      onChange={(e) => setNewFoodEntry({...newFoodEntry, food_name: e.target.value})}
                      placeholder="Enter food name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input
                      type="number"
                      value={newFoodEntry.calories}
                      onChange={(e) => setNewFoodEntry({...newFoodEntry, calories: e.target.value})}
                      placeholder="Calories"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sodium (mg)</label>
                    <input
                      type="number"
                      value={newFoodEntry.sodium}
                      onChange={(e) => setNewFoodEntry({...newFoodEntry, sodium: e.target.value})}
                      placeholder="Sodium in mg"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleAddFoodEntry}>
                    <Save size={20} /> Save Entry
                  </button>
                  <button className="btn btn-secondary" onClick={() => setAddingFood(false)}>
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="food-entries-list">
            <h3>Today's Food Entries</h3>
            {foodEntries.length === 0 ? (
              <p>No food entries for today. Start tracking your meals!</p>
            ) : (
              foodEntries.map((entry) => (
                <div key={entry.id} className="food-entry-item">
                  <div className="food-info">
                    <h4>{entry.food_name}</h4>
                    <div className="nutrition-info">
                      <span className="calorie-info">{entry.calories} cal</span>
                      <span className="sodium-info">{entry.sodium}mg sodium</span>
                    </div>
                  </div>
                  <div className="food-time">
                    {new Date(entry.entry_date).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="recipes-section">
          <div className="recipes-header">
            <h3>Healthy Recipes</h3>
            <button className="btn btn-secondary" onClick={handleGetRandomRecipe}>
              <RefreshCw size={20} /> Get Random Recipe
            </button>
          </div>

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-header">
                  <h4>{recipe.title}</h4>
                  <button 
                    className={`btn btn-icon ${savedRecipes.includes(recipe.id) ? 'btn-saved' : 'btn-save'}`}
                    onClick={() => {
                      if (savedRecipes.includes(recipe.id)) {
                        handleUnsaveRecipe(recipe.id);
                      } else {
                        handleSaveRecipe(recipe.id);
                      }
                    }}
                  >
                    <Heart size={20} fill={savedRecipes.includes(recipe.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <div className="recipe-nutrition">
                  <span className="calories">{recipe.calories} cal</span>
                  <span className="sodium">{recipe.sodium}mg sodium</span>
                </div>
                
                <div className="recipe-content">
                  <div className="ingredients">
                    <h5>Ingredients:</h5>
                    <p>{recipe.ingredients}</p>
                  </div>
                  
                  <div className="instructions">
                    <h5>Instructions:</h5>
                    <p>{recipe.instructions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPage;