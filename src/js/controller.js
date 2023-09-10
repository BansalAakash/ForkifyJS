//Polyfill
import 'regenerator-runtime/runtime';
import 'core-js/actual';

//Module imports
// import { loadRecipe, state }  from './model.js';   //could do this as well
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchResultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';

//API NAME
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
  try {
    const recipeId = window.location.hash.slice(1); //window.location contains URL and .hash gives the hash
    if (!recipeId) return;
    recipeView.renderSpinner();

    //0. Update searchResults view to highlight the selected search result
    searchResultView.update(model.getSearchResultsPage());

    //1. Update bookmark list
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe
    await model.loadRecipe(recipeId);

    //3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    // 1. Get Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Search Results
    searchResultView.renderSpinner();
    await model.loadSearchResults(query);

    //3. Render Search Results
    searchResultView.render(model.getSearchResultsPage());

    //4. Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlServings = newServings => {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = pageNumber => {
  model.state.search.pageNumber = Number(pageNumber);
  searchResultView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const controlAddBookmark = () => {
  //Add/remove bookmark
  model.toggleBookmark(model.state.recipe);

  //Update Recipe view
  recipeView.update(model.state.recipe);

  //Render Bookmark view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarkList = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async recipeData => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(recipeData);

    //Render success message
    addRecipeView.renderMessage();

    //Render the uploaded recipe
    recipeView.render(model.state.recipe);

    //Render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //Using the history API to change the URL hash
    console.log(model.state.recipe.id);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error);
  }
  setTimeout(() => {
    addRecipeView.hideWindow();
  }, MODAL_CLOSE_SEC * 1000);
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarkList); //subscribe to event handler
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServingsChange(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
};

init();
