import View from './views/View';
import icons from 'url:../img/icons.svg';

export default class PreviewView extends View {
  _generateMarkup() {
    return this._data.map(this._generateMarkupSingleItem).join('');
  }

  _generateMarkupSingleItem(item) {
    const id = window.location.hash.slice(1);
    const markup = `<li class="preview ${
      item.id === id ? 'preview__link--active' : ''
    }">
                            <a class="preview__link"  href=#${item.id}>
                            <figure class="preview__fig">
                                <img
                                src=${item.image}
                                alt=${item.title}
                                />
                            </figure>
                            <div class="preview__data">
                                <h4 class="preview__title">${item.title}</h4>
                                <p class="preview__publisher">${
                                  item.publisher
                                }</p>
                                <div class="preview__user-generated ${
                                  item.key ? '' : 'hidden'
                                }">
                                  <svg>
                                    <use href="${icons}#icon-user"></use>
                                  </svg>
                                </div>
                            </div>
                            </a>
                        </li>`;
    return markup;
  }
}
