/* exported data */

var data = {
  view: 'search-form',
  searchObjects: [],
  saved: [],
  nextObjId: 1
};

var previousDataJSON = localStorage.getItem('data-local-storage');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function beforeunloadHandler(event) {

  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

window.addEventListener('beforeunload', beforeunloadHandler);
