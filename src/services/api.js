const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchRecipes = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.meals) {
      return { results: [] };
    }

    // Transform the response to match our existing format
    const results = data.meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      cuisine: meal.strArea,
      category: meal.strCategory
    }));

    return { results };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) {
      throw new Error('Recipe not found');
    }

    const meal = data.meals[0];

    // Get all ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }

    // Transform the response to match our existing format
    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      cuisine: meal.strArea,
      category: meal.strCategory,
      instructions: meal.strInstructions.split('\n').filter(step => step.trim()),
      ingredients,
      videoUrl: meal.strYoutube || null
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to fetch recipe details');
  }
};

export const getRandomRecipe = async () => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) {
      throw new Error('Failed to get random recipe');
    }

    return getRecipeById(data.meals[0].idMeal);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    throw new Error('Failed to fetch random recipe');
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?c=list`);
    const data = await response.json();

    if (!data.meals) {
      return [];
    }

    return data.meals.map(category => category.strCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const getCuisines = async () => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();

    if (!data.meals) {
      return [];
    }

    return data.meals.map(cuisine => cuisine.strArea);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    throw new Error('Failed to fetch cuisines');
  }
};
