import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomRecipe } from '../../services/api';
import Loader from '../../components/common/Loader';
import './Home.css';

const Home = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedRecipe = async () => {
      try {
        const recipe = await getRandomRecipe();
        setFeaturedRecipe(recipe);
      } catch (err) {
        setError('Failed to fetch featured recipe');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRecipe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Meal Planner</h1>
          <p>Discover delicious recipes and plan your meals with ease</p>
          <Link to="/search" className="cta-button">
            Find Recipes
          </Link>
        </div>
      </section>

      {featuredRecipe && (
        <section className="featured-recipe">
          <h2>Recipe of the Day</h2>
          <div className="recipe-card">
            <div className="recipe-image">
              <img src={featuredRecipe.image} alt={featuredRecipe.title} />
            </div>
            <div className="recipe-content">
              <h3>{featuredRecipe.title}</h3>
              <div className="recipe-meta">
                {featuredRecipe.cuisine && (
                  <span className="cuisine">{featuredRecipe.cuisine}</span>
                )}
                {featuredRecipe.category && (
                  <span className="category">{featuredRecipe.category}</span>
                )}
              </div>
              <div className="recipe-info">
                <p>Ingredients: {featuredRecipe.ingredients.length} items</p>
                {featuredRecipe.videoUrl && (
                  <a 
                    href={featuredRecipe.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    Watch Video Tutorial
                  </a>
                )}
              </div>
              <Link to={`/recipe/${featuredRecipe.id}`} className="view-recipe">
                View Full Recipe
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="features">
        <div className="feature">
          <h3>Discover</h3>
          <p>Explore a wide variety of recipes from different cuisines</p>
        </div>
        <div className="feature">
          <h3>Cook</h3>
          <p>Follow step-by-step instructions with detailed ingredients</p>
        </div>
        <div className="feature">
          <h3>Share</h3>
          <p>Share your favorite recipes with friends and family</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 