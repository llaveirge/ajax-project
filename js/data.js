/* exported data */

var data = {
  view: 'search-form',
  searchObjects: [],
  saved: [],
  nextObjId: 1
};

function beforeunloadHandler(event) {

  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

window.addEventListener('beforeunload', beforeunloadHandler);
