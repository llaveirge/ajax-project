/* exported data */

let data = {
  view: 'search-form',
  searchObjects: [{
    objImgUrl: './images/met-gallery.webp',
    objTitle: 'test object 2',
    objArtist: 'That one guy again',
    objMedium: 'clay',
    objGallery: ': Laveirge Gallery',
    objUrl: 'www.thisgoesnowhere.com',
    objMetId: '123456',
    onbjSaved: false
  }],
  saved: [{
    objImgUrl: './images/met-gallery.webp',
    objTitle: 'test object',
    objArtist: 'That one guy',
    objMedium: 'clay',
    objGallery: 'Laveirge Gallery',
    objUrl: 'www.thisgoesnowhere.com',
    seen: false
  }],
  nextObjId: 1
};

const previousDataJSON = localStorage.getItem('data-local-storage');
const $viewNodeListData = document.querySelectorAll('.view');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function beforeunloadHandler(event) {
  // Set data.view value to current visible section:
  for (const viewNode of $viewNodeListData) {
    if (!viewNode.classList.contains('hidden')) {
      data.view = viewNode.getAttribute('data-view');
    }
  }

  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

window.addEventListener('beforeunload', beforeunloadHandler);
