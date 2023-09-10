//This class actually doesn't render the search view, The SearchView is already 'rendered' directly from HTML as it's just a static form.
//This class is used to listen for Search button click event and getting query from the search input field.
class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const result = this.#parentElement.querySelector('.search__field').value;
    this.#parentElement.querySelector('.search__field').value = '';
    return result;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', e => {
      e.preventDefault(); //Prevent page reload on form submission
      handler();
    });
  }
}

export default new SearchView();
