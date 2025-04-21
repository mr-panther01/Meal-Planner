import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { searchRecipes, getCategories, getCuisines } from '../../services/api';
import Loader from '../../components/common/Loader';
import './RecipeSearch.css';

const LazyImage = ({ src, alt }) => {
  return (
    <Suspense fallback={<div className="image-placeholder"></div>}>
      <img src={src} alt={alt} loading="lazy" />
    </Suspense>
  );
};

const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    cuisine: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, cuisinesData] = await Promise.all([
          getCategories(),
          getCuisines()
        ]);
        setCategories(categoriesData);
        setCuisines(cuisinesData);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchRecipes(query);
      let filteredResults = data.results;

      // Apply filters
      if (filters.category) {
        filteredResults = filteredResults.filter(
          recipe => recipe.category === filters.category
        );
      }
      if (filters.cuisine) {
        filteredResults = filteredResults.filter(
          recipe => recipe.cuisine === filters.cuisine
        );
      }

      setRecipes(filteredResults);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="recipe-search">
      <div className="recipe-search-container">
        <h1>Search Recipes</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes..."
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="filters">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="cuisine"
              value={filters.cuisine}
              onChange={handleFilterChange}
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </form>

        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen} // Added ARIA attribute
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {error && <p className="error">{error}</p>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <LazyImage src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
              <div className="recipe-meta">
                {recipe.cuisine && <span className="cuisine">{recipe.cuisine}</span>}
                {recipe.category && <span className="category">{recipe.category}</span>}
              </div>
              <Link to={`/recipe/${recipe.id}`} className="view-recipe">
                View Recipe
              </Link>
            </div>
          ))}
        </div>

        {recipes.length === 0 && !loading && (
          <p className="no-results">No recipes found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;