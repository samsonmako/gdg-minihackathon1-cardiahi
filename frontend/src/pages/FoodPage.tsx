import React, { useState, useEffect } from 'react';
import {  Plus, Heart, RefreshCw, Flame, Users, BookOpen, X, Check, ChefHat } from 'lucide-react';
import { base_host } from '../global';
import { useAuth } from '../contexts/AuthContext';
//import { Link } from 'react-router-dom';

interface FoodEntry {
  id: number;
  food_name: string;
  calories: number;
  sodium: number;
  entry_date: string;
  formatted_date: string;
  is_today: boolean;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  calories: number;
  sodium: number;
  is_saved:boolean;
  is_heart_healthy: boolean;
  calories_per_serving: number;
  sodium_per_serving: number;
  formatted_date: string;
}

interface NewFood {
  food_name: string;
  calories: string;
  sodium: string;
  entry_date: string;
}


const FoodPage: React.FC = ()  => {
  const { user }= useAuth();
  const [activeTab, setActiveTab] = useState<'diary' | 'recipes' | 'discover' >('diary');
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);//useState<'tracker' | 'recipes'>('tracker');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null >(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFood, setNewFood] = useState<NewFood>({
    food_name: '',
    calories: '',
    sodium: '',
    entry_date: new Date().toISOString().split('T')[0]
  });

  const userId = user?.id; // Mock user ID
 

  useEffect(() => {
    if(user)
    fetchFoodEntries();
    fetchSavedRecipes();
    fetchRandomRecipe();
  }, [user]);

  const fetchFoodEntries = async () => {
    try {
      const response = await fetch(`${base_host}api/food.php?user_id=${userId}`);
      const data = await response.json();
      setFoodEntries(data);
    } catch (error) {
      console.error('Error fetching food entries:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch(`${base_host}api/recipes.php?user_id=${userId}`);
      const data = await response.json();
      setSavedRecipes(data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch(`${base_host}api/food.php?user_id=${userId}&action=random`);
      const data = await response.json();
      setRandomRecipe(data);
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    }
  };

  const handleAddFood = async () => {
    if (newFood.food_name && newFood.calories && newFood.sodium) {
      try {
        const response = await fetch(`${base_host}api/food.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            ...newFood,
            calories: parseInt(newFood.calories),
            sodium: parseInt(newFood.sodium)
          })
        });

        if (response.ok) {
          setNewFood({
            food_name: '',
            calories: '',
            sodium: '',
            entry_date: new Date().toISOString().split('T')[0]
          });
          setShowAddFood(false);
          fetchFoodEntries();
        }
      } catch (error) {
        console.error('Error adding food entry:', error);
      }
    }
  };

  const saveRecipe = async (recipeId:any) => {
    try {
      const response = await fetch(`${base_host}api/food.php?action=save_recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          recipe_id: recipeId
        })
      });

      if (response.ok) {
        fetchSavedRecipes();
        if (randomRecipe && randomRecipe.id === recipeId) {
          setRandomRecipe({ ...randomRecipe, is_saved: true });
        }
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const deleteFoodEntry = async (entryId:any) => {
    try {
      const response = await fetch(`${base_host}api/food.php?id=${entryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFoodEntries();
      }
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };

  const calculateDailyTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = foodEntries.filter(entry => entry.entry_date === today);
    
    return todayEntries.reduce((totals, entry) => {
      totals.calories += entry.calories;
      totals.sodium += entry.sodium;
      return totals;
    }, { calories: 0, sodium: 0 });
  };

  const dailyTotals = calculateDailyTotals();

  return (
    <div className="food-page">
      <div className="container">
        <div className="page-header">
          <h1>Nutrition & Diet</h1>
          <p>Track your meals and discover healthy recipes</p>
        </div>

        {/* Daily Summary */}
        <div className="daily-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <Flame className="w-6 h-6" />
            </div>
            <div className="summary-content">
              <div className="summary-value">{dailyTotals.calories}</div>
              <div className="summary-label">Calories Today</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <Heart className="w-6 h-6" />
            </div>
            <div className="summary-content">
              <div className="summary-value">{dailyTotals.sodium}mg</div>
              <div className="summary-label">Sodium Today</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="summary-content">
              <div className="summary-value">{foodEntries.filter(e => e.entry_date === new Date().toISOString().split('T')[0]).length}</div>
              <div className="summary-label">Meals Today</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'diary' ? 'active' : ''}`}
            onClick={() => setActiveTab('diary')}
          >
            Food Diary
          </button>
          <button 
            className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            Saved Recipes
          </button>
          <button 
            className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
        </div>

        {/* Food Diary Tab */}
        {activeTab === 'diary' && (
          <div className="tab-content">
            <div className="diary-header">
              <h3>Your Food Diary</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddFood(true)}
              >
                <Plus className="w-4 h-4" />
                Add Food
              </button>
            </div>

            <div className="food-entries">
              {foodEntries.length === 0 ? (
                <div className="empty-state">
                  <BookOpen className="w-12 h-12" />
                  <h3>No food entries yet</h3>
                  <p>Start tracking your meals to see your nutrition data</p>
                </div>
              ) : (
                foodEntries.map((entry) => (
                  <div key={entry.id} className="food-entry">
                    <div className="entry-info">
                      <h4>{entry.food_name}</h4>
                      <div className="entry-meta">
                        <span className="entry-date">{entry.formatted_date}</span>
                        {entry.is_today && <span className="badge badge-primary">Today</span>}
                      </div>
                    </div>
                    <div className="entry-nutrition">
                      <span className="nutrition-item">
                        <Flame className="w-4 h-4" />
                        {entry.calories} cal
                      </span>
                      <span className="nutrition-item">
                        <Heart className="w-4 h-4" />
                        {entry.sodium}mg
                      </span>
                    </div>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => deleteFoodEntry(entry.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* Saved Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="tab-content">
            <div className="recipes-header">
              <h3>Saved Recipes</h3>
              <div className="recipes-count">
                {savedRecipes.length} recipes saved
              </div>
            </div>

            <div className="recipes-grid">
              {savedRecipes.length === 0 ? (
                <div className="empty-state">
                  <Heart className="w-12 h-12" />
                  <h3>No saved recipes yet</h3>
                  <p>Discover and save heart-healthy recipes for your diet</p>
                </div>
              ) : (
                savedRecipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image">
                      <div className="recipe-placeholder">
                        <ChefHat className="w-8 h-8" />
                      </div>
                      {recipe.is_heart_healthy && (
                        <div className="recipe-badge">Heart Healthy</div>
                      )}
                    </div>
                    <div className="recipe-content">
                      <h4>{recipe.title}</h4>
                      <div className="recipe-nutrition">
                        <span className="nutrition-item">
                          <Flame className="w-4 h-4" />
                          {recipe.calories_per_serving} cal/serving
                        </span>
                        <span className="nutrition-item">
                          <Heart className="w-4 h-4" />
                          {recipe.sodium_per_serving}mg/serving
                        </span>
                      </div>
                      <div className="recipe-date">
                        Saved {recipe.formatted_date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="tab-content">
            <div className="discover-header">
              <h3>Discover New Recipes</h3>
              <button 
                className="btn btn-secondary"
                onClick={fetchRandomRecipe}
              >
                <RefreshCw className="w-4 h-4" />
                Get New Recipe
              </button>
            </div>

                      </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Food Entry</h3>
              <button 
                className="btn btn-icon"
                onClick={() => setShowAddFood(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Food Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newFood.food_name}
                  onChange={(e) => setNewFood({...newFood, food_name: e.target.value})}
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>
              <div className="form-group">
                <label>Calories</label>
                <input
                  type="number"
                  className="form-input"
                  value={newFood.calories}
                  onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                  placeholder="e.g., 350"
                />
              </div>
              <div className="form-group">
                <label>Sodium (mg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newFood.sodium}
                  onChange={(e) => setNewFood({...newFood, sodium: e.target.value})}
                  placeholder="e.g., 450"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newFood.entry_date}
                  onChange={(e) => setNewFood({...newFood, entry_date: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddFood(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddFood}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
     
     {randomRecipe && (
              <div className="featured-recipe">
                <div className="recipe-header">
                  <h3>{randomRecipe.title}</h3>
                  <button 
                    className={`btn ${randomRecipe.is_saved ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => saveRecipe(randomRecipe.id)}
                    disabled={randomRecipe.is_saved}
                  >
                    {randomRecipe.is_saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Save Recipe
                      </>
                    )}
                  </button>
                </div>

                <div className="recipe-details">
                  <div className="recipe-nutrition-summary">
                    <div className="nutrition-card">
                      <Flame className="w-6 h-6" />
                      <div>
                        <div className="nutrition-value">{randomRecipe.calories}</div>
                        <div className="nutrition-label">Total Calories</div>
                      </div>
                    </div>
                    <div className="nutrition-card">
                      <Heart className="w-6 h-6" />
                      <div>
                        <div className="nutrition-value">{randomRecipe.sodium}mg</div>
                        <div className="nutrition-label">Total Sodium</div>
                      </div>
                    </div>
                    <div className="nutrition-card">
                      <Users className="w-6 h-6" />
                      <div>
                        <div className="nutrition-value">4</div>
                        <div className="nutrition-label">Servings</div>
                      </div>
                    </div>
                  </div>

                  <div className="recipe-section">
                    <h4>Ingredients</h4>
                  {randomRecipe.ingredients ? (
                    <ul className="ingredients-list">
                      {randomRecipe.ingredients?.split('\n').map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No ingredients is available</p>
                  )}
                  </div>

                  <div className="recipe-section">
                    <h4>Instructions</h4>
                    {randomRecipe.instructions ? (
                    <ol className="instructions-list">
                      {randomRecipe.instructions.split('\n').map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                     
                    </ol>
                     ) : (
      <p>No recipe available</p>
                     )}
                  </div>
                </div>
              </div>
            )}




    </div>
  );
};

export default FoodPage;
