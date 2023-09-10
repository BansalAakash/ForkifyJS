import { async } from 'regenerator-runtime';
import { API_URL, API_KEY, SEARCH_RESULTS_PAGE_SIZE } from './config.js';
import { requestHelper } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    pageSize: SEARCH_RESULTS_PAGE_SIZE,
    pageNumber: 1,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async recipeId => {
  try {
    let recipe = state.bookmarks.find(
      bookmarkedRecipe => bookmarkedRecipe.id === recipeId
    );
    if (recipe) {
      state.recipe = recipe;
    } else {
      const data = await requestHelper(`${API_URL}/${recipeId}?key=${API_KEY}`);
      state.recipe = createRecipeObject(data);
    }
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    state.search.pageNumber = 1;
    const data = await requestHelper(
      `${API_URL}?search=${query}&key=${API_KEY}`
    );

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = (pageNumber = state.search.pageNumber) => {
  state.search.pageNumber = pageNumber;
  const start = (pageNumber - 1) * state.search.pageSize;
  const end = start + state.search.pageSize;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients = state.recipe.ingredients.map(ingredient => {
    if (ingredient.quantity)
      ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings;
    return ingredient;
  });
  state.recipe.servings = newServings;
};

export const toggleBookmark = recipe => {
  if (recipe.bookmarked) {
    //removing bookmark
    state.bookmarks.splice(
      state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id),
      1
    );
    if (state.recipe.id === recipe.id) state.recipe.bookmarked = false;
  } else {
    //adding bookmark
    state.bookmarks.push(recipe);
    if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  }
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //persist bookmark
};
export const uploadRecipe = async recipeData => {
  const ingredients = Object.entries(recipeData)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1])
    .map(entry => entry[1].trim().split(','))
    .map(entry => {
      if (entry.length !== 3 || entry[2] === '')
        throw new Error(
          'Wrong ingredient format! Please use the correct format!'
        );
      const [qty, unit, description] = entry;
      return {
        quantity: qty ? Number(qty) : null,
        unit,
        description: description.trim(),
      };
    });

  const recipe = {
    title: recipeData.title,
    source_url: recipeData.sourceUrl,
    image_url: recipeData.image,
    publisher: recipeData.publisher,
    cooking_time: +recipeData.cookingTime,
    servings: +recipeData.servings,
    ingredients,
  };
  const data = await requestHelper(`${API_URL}?key=${API_KEY}`, 'POST', recipe);
  state.recipe = createRecipeObject(data);
  toggleBookmark(state.recipe);
};

const init = () => {
  //Load bookmarks from storage
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();
