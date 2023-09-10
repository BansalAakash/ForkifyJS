import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.pageSize);
    const pageNumber = this._data.pageNumber;
    let markup = '';
    if (pageNumber > 1) markup += this._generateMarkupPrevPage(pageNumber - 1);
    if (pageNumber < numPages)
      markup += this._generateMarkupNextPage(pageNumber + 1);
    return markup;
  }

  _generateMarkupNextPage(nextPageNumber) {
    return `<button class="btn--inline pagination__btn--next" data-goto="${nextPageNumber}">
                <span>Page ${nextPageNumber}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
  }

  _generateMarkupPrevPage(prevPageNumber) {
    return `<button class="btn--inline pagination__btn--prev" data-goto="${prevPageNumber}">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${prevPageNumber}</span>
            </button>`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) {
        return;
      }
      handler(button.dataset.goto);
    });
  }
}

export default new PaginationView();
