import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _closeButton = document.querySelector('.btn--close-modal');
  _openButton = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlers();
  }

  _addHandlers() {
    this._openButton.addEventListener('click', this._showWindow.bind(this));

    window.addEventListener(
      'keydown',
      e => e.code === 'Escape' && this.hideWindow.bind(this)()
    );
    this._closeButton.addEventListener('click', this.hideWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _showWindow() {
    this._window.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  hideWindow() {
    this._window.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }
}

export default new AddRecipeView();
