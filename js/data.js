/* exported data */

var data = {
  view: 'search-form',
  searchObjects: [],
  saved: [],
  nextObjId: 1
};

var previousDataJSON = localStorage.getItem('data-local-storage');
var $viewNodeListData = document.querySelectorAll('.view');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function beforeunloadHandler(event) {

  // Set data.view value to current visible section:
  for (var viewNode of $viewNodeListData) {
    if (!viewNode.classList.contains('hidden')) {
      data.view = viewNode.getAttribute('data-view');
    }
  }

  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

window.addEventListener('beforeunload', beforeunloadHandler);
