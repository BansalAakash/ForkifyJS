import icons from 'url:../../img/icons.svg';

export default class View {
  //exporting the class itself instead of an instance cuz we won't create an instance of this class.
  //This will just be used as a parent class for other classes.
  _data;

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    //Refer https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/22649619
    //This function will do the DOM Manipulation, without upating the entire DOM tree
    const newDOM = document.createRange().createContextualFragment(newMarkup); //will create a DOM tree out of the markup
    const newElems = Array.from(newDOM.querySelectorAll('*')); //Getting the NodeList using querySelectorAll and then converting that to array (for the new DOM)
    const curDOMElems = Array.from(this._parentElement.querySelectorAll('*')); //Doing the same for the current visual DOM

    //Now we compare the 2 DOMs
    newElems.forEach((newElem, i) => {
      const curElem = curDOMElems[i];

      //Updates changed text
      if (
        !newElem.isEqualNode(curElem) && //If the 2 elems are different
        newElem.firstChild?.nodeValue.trim() !== ''
      ) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
        //Here we use the nodeValue function because nodeValue will be non-null for text nodes only, (For elements it will be null and we do not want elements)
        //node ka first child will be the actual text element
        //Therefore, this code block will only execute for elements that contain text directly.
        curElem.textContent = newElem.textContent;
        //This update will be dynamic cuz we are directly changing the node
        //Now, the text contents have been updated. But other things like data-attributes haven't changed.
      }

      //Updates changed data attributes
      if (!newElem.isEqualNode(curElem)) {
        Array.from(newElem.attributes).forEach(attribute =>
          curElem.setAttribute(attribute.name, attribute.value)
        );
        //newElem.attributes will give us the list of all the attributes of the node element.
      }
    });
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this.insertHTML(markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
                        <svg>
                        <use href="${icons}#icon-loader"></use>
                        </svg>
                    </div>`;
    this.insertHTML(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
                        <div>
                        <svg>
                            <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                        </div>
                        <p>${message}</p>
                    </div>`;
    this.insertHTML(markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="recipe">
                        <div class="message">
                        <div>
                            <svg>
                            <use href="${icons}_icon-smile"></use>
                            </svg>
                        </div>
                        <p>${message}</p>
                    </div>`;
    this.insertHTML(markup);
  }

  insertHTML(markup) {
    this._parentElement.innerHTML = markup;
  }
}
