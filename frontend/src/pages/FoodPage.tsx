import React, { useEffect, useState } from 'react';
import {
  Plus,
  Heart,
  Flame,
  Users,
  X,
  ChefHat
} from 'lucide-react';
import { base_host } from '../global';
import { useAuth } from '../contexts/AuthContext';

/* ================= TYPES ================= */

interface FoodEntry {
  id: number;
  food_name: string;
  calories: number;
  sodium: number;
  entry_date: string;
  formatted_date?: string;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  calories: number;
  sodium: number;
  calories_per_serving: number;
  sodium_per_serving: number;
  is_saved: boolean;
  is_heart_healthy: boolean;
  formatted_date: string;
}

/* ================= COMPONENT ================= */

const FoodPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] =
    useState<'diary' | 'recipes' | 'discover'>('diary');

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [showAddFood, setShowAddFood] = useState(false);
  const [foodText, setFoodText] = useState('');
  const [nutritionPreview, setNutritionPreview] = useState<any>(null);
  const [loadingNutrition, setLoadingNutrition] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!userId) return;
    fetchFoodEntries();
    fetchSavedRecipes();
    fetchDiscoverRecipes();
  }, [userId]);

  const fetchFoodEntries = async () => {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(
      `${base_host}api/food.php?user_id=${userId}&date=${today}`
    );
    const data = await res.json();
    setFoodEntries(data.entries || []);
  };

  const fetchSavedRecipes = async () => {
    const res = await fetch(`${base_host}api/recipes.php?user_id=${userId}`);
    setSavedRecipes(await res.json());
  };

  const fetchDiscoverRecipes = async () => {
    const res = await fetch(`${base_host}api/recipes.php?random=1`);
    const response = await res.json();
    if (response) {
      setRecipes([response, ...recipes.slice(0, -1)]);
    }
  };

  /* ================= NUTRITION ================= */

  const analyzeFood = async () => {
    if (!foodText) return;

    setLoadingNutrition(true);

    const res = await fetch(
      `https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(
        foodText
      )}&apiKey=${import.meta.env.VITE_SPOONACULAR_KEY}`
    );

    const data = await res.json();

    setNutritionPreview({
      foods: [data],
      calories: Math.round(data.calories?.value || 0),
      sodium: Math.round(data.sodium?.value || 0)
    });

    setLoadingNutrition(false);
  };

  const saveFoodEntry = async () => {
    if (!nutritionPreview) return;

    await fetch(`${base_host}api/food.php?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        food_name: foodText,
        calories: nutritionPreview.calories,
        sodium: nutritionPreview.sodium,
        entry_date: new Date().toISOString().split('T')[0]
      })
    });

    setShowAddFood(false);
    setFoodText('');
    setNutritionPreview(null);
    fetchFoodEntries();
  };

  /* ================= CALCULATIONS ================= */

  const today = new Date().toISOString().split('T')[0];
  const dailyTotals = foodEntries
    .filter(e => e.entry_date === today)
    .reduce(
      (t, e) => {
        t.calories += e.calories;
        t.sodium += e.sodium;
        return t;
      },
      { calories: 0, sodium: 0 }
    );

  /* ================= UI ================= */

  return (
    <div className="food-page">
      <div className="container">
        <h1>Nutrition & Diet</h1>

        <div className="daily-summary">
          <Summary icon={<Flame />} value={dailyTotals.calories} label="Calories Today" />
          <Summary icon={<Heart />} value={`${dailyTotals.sodium}mg`} label="Sodium Today" />
          <Summary
            icon={<Users />}
            value={foodEntries.length}
            label="Meals Today"
          />
        </div>

        <div className="tab-navigation">
          {['diary', 'recipes', 'discover'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'diary' && (
          <>
            <button onClick={() => setShowAddFood(true)}>
              <Plus /> Add Food
            </button>

            {foodEntries.map(e => (
              <div key={e.id}>
                {e.food_name} — {e.calories} cal
              </div>
            ))}
          </>
        )}

        {activeTab === 'recipes' && (
          <div className="recipes-grid">
            {savedRecipes.map(r => (
              <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
            ))}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="recipes-grid">
            {recipes.map(r => (
              <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
            ))}
          </div>
        )}
      </div>

      {showAddFood && (
        <Modal onClose={() => setShowAddFood(false)}>
          <input
            value={foodText}
            onChange={e => setFoodText(e.target.value)}
            placeholder="What did you eat?"
          />
          <button onClick={analyzeFood}>
            {loadingNutrition ? 'Analyzing...' : 'Analyze'}
          </button>

          {nutritionPreview && (
            <>
              <p>Calories: {nutritionPreview.calories}</p>
              <p>Sodium: {nutritionPreview.sodium}mg</p>
              <button onClick={saveFoodEntry}>Save</button>
            </>
          )}
        </Modal>
      )}

      {selectedRecipe && (
        <Modal onClose={() => setSelectedRecipe(null)}>
              <h3 style={{
            marginBottom: 12
         }}>{selectedRecipe.title}</h3>
            <p style={{
            marginBottom: 8
          }}>{selectedRecipe.calories} cal • {selectedRecipe.sodium}mg</p>
         <h4 style={{
           marginBottom: 8
           }}>Ingredients</h4>
          <ul>{selectedRecipe.ingredients.split('\n').map((i, x) => (<li key={x}>{i}</li>))}</ul>
          <h4>Instructions</h4>
         <ol>{selectedRecipe.instructions.split('\n').map((i, x) => (<li key={x}>{i}</li>))}</ol>
        </Modal>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Summary = ({ icon, value, label }: any) => (
  <div className="summary-card">
    {icon}
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const RecipeCard = ({ recipe, onClick }: any) => (
<div className="recipe-card" onClick={onClick}>
  <div className="recipe-card-top">
   <ChefHat />
   <h4>{recipe.title}</h4>
   </div>
    <span>{recipe.calories} cal • {recipe.sodium}mg</span>
  </div>

);

const Modal = ({ children, onClose }: any) => (
  <div style={{
   position: 'fixed',
    inset: 0,
   background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div className="card" style={{
     background: '#fff',
     padding: 20,
      borderRadius: 10,
     width: '90%',
          maxWidth: 600,
    }}>
  
    <button onClick={onClose}>
      <X />
    </button>
    {children}
    </div>
  </div>
);

export default FoodPage;
