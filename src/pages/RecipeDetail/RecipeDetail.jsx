import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById } from '../../services/api';
import Loader from '../../components/common/Loader';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError('Failed to load recipe details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail">
        <div className="error-container">
          <p className="error-message">{error || 'Recipe not found'}</p>
          <Link to="/search" className="back-button">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <div className="recipe-header-content">
          <h1>{recipe.title}</h1>
          <div className="recipe-meta">
            {recipe.cuisine && (
              <span className="cuisine">{recipe.cuisine}</span>
            )}
            {recipe.category && (
              <span className="category">{recipe.category}</span>
            )}
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-main">
          <div className="recipe-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>

          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  <span className="ingredient">{item.ingredient}</span>
                  <span className="measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe-instructions">
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {recipe.videoUrl && (
            <div className="recipe-video">
              <h2>Video Tutorial</h2>
              <a 
                href={recipe.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="video-button"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>

        <div className="recipe-actions">
          <Link to="/search" className="back-button">
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 