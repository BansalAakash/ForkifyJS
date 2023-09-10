import PreviewView from '../previewView.js';

class SearchResultView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find any recipes for that search.';
}

export default new SearchResultView();
