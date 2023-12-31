import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import View from './View.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe.';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler)); //will be called by controller
  }

  addHandlerServingsChange(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const newServings =
        this._data.servings + Number(btn.dataset.updateserving);
      if (newServings > 0) handler(newServings);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (btn) handler();
    });
  }

  _generateMarkup() {
    const recipe = this._data;
    return `<figure class="recipe__fig">
    <img src=${recipe.image} alt="Tomato" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${recipe.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        recipe.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        recipe.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--decrease-servings" data-updateserving="-1">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings" data-updateserving="1">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="recipe__user-generated ${recipe.key ? '' : 'hidden'}">
    ${
      recipe.key
        ? `
        <svg>
          <use href="${icons}#icon-user"></use>
          </svg>`
        : ''
    }
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}${
      recipe.bookmarked ? '#icon-bookmark-fill' : '#icon-bookmark'
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
      ${recipe.ingredients
        .map(ingredient => this._generateMarkupIngredient(ingredient))
        .join('')}
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        recipe.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href=${recipe.sourceUrl}
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  }

  _generateMarkupIngredient(ingredient) {
    return `<li class="recipe__ingredient">
                <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
                </svg>
                ${
                  ingredient.quantity
                    ? `<div class="recipe__quantity">${fracty(
                        ingredient.quantity
                      )}</div>`
                    : ``
                }
                <div class="recipe__description">
                ${
                  ingredient.unit
                    ? `<span class="recipe__unit">${ingredient.unit}</span>`
                    : ''
                }
                ${ingredient.description}
                </div>
            </li>
            `;
  }
}

export default new RecipeView();
