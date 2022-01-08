var $searchInput = document.getElementById('search');
var $searchForm = document.getElementById('form');
// var $discoveriesList = document.getElementById('discoveries-list');

// Empty array to store Met object IDs in once acquired from the API
var objIdArr = [];

// Empty aray to store four random object IDs from the 'objIdArr' array:
var randomObjIds = [];

// Empty array to store the four random museum objects and their information:
var randomObjInfo = [];

// Listen for events and save search value to a variable before resetting the form:
var query;

function searchEventHandler(event) {
  event.preventDefault();
  query = $searchInput.value;
  $searchForm.reset();

  // Function to retrieve object ID numbers from The Met API and save in objIdArr array:
  var queryXhr = new XMLHttpRequest();
  queryXhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/search?' + 'q=' + query + '&isOnView=true');
  queryXhr.responseType = 'json';
  queryXhr.addEventListener('load', function () {
    var responseObjectIds = queryXhr.response.objectIDs;

    // Add response IDs to objIdArr array:
    for (var id of responseObjectIds) {
      objIdArr.push(id);
    }

    // Call 'randomize' on 'objIdArr' array:
    randomize(objIdArr);

    // Loop through 'randomObjIds' array and call 'getObjectInfo' on each ID in the array:
    for (var objId of randomObjIds) {
      getObjectInfo(objId);
    }
  });

  queryXhr.send();
}

$searchForm.addEventListener('submit', searchEventHandler);

/* Define a function to select and remove 4 random Met museum object IDs from the 'objIdArr' array
and add them to the 'randomObjIds' array: */
function randomize(array) {
  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * array.length);
    randomObjIds.push(objIdArr.splice(randomIndex, 1));
  }
}

// Define a function to retrieve randomized object data from Met API and store in 'randomObjInfo' array and data model:
function getObjectInfo(objectId) {
  var dataXhr = new XMLHttpRequest();
  dataXhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + objectId);
  dataXhr.responseType = 'json';
  dataXhr.addEventListener('load', function () {
    var response = dataXhr.response;

    var objectData = {
      objImgUrl: response.primaryImageSmall,
      objTitle: response.title,
      objArtist: response.artistDisplayName,
      objMedium: response.medium,
      objGallery: response.GalleryNumber,
      objUrl: response.objectURL
    };

    randomObjInfo.push(objectData);
    data.searchObjects.push(objectData);

  });
  dataXhr.send();
}

// Define a functio that returns a DOM tree for each object:
function renderObjectInfo(object) {
  var $li = document.createElement('li');
  $li.setAttribute('class', 'object display-flex wrap');

  var $divObjImgCont = document.createElement('div');
  $divObjImgCont.setAttribute('class', 'obj-img-container col-full col-half');
  $li.appendChild($divObjImgCont);

  var $objImg = document.createElement('img');
  $objImg.setAttribute('class', 'obj-img');
  $objImg.setAttribute('src', object.objImgUrl);
  $objImg.setAttribute('alt', object.objTitle);
  $divObjImgCont.appendChild($objImg);

  var $infoColumnDiv = document.createElement('div');
  $infoColumnDiv.setAttribute('class', 'col-full col-half');
  $li.appendChild($infoColumnDiv);

  var $h3Title = document.createElement('h3');
  $h3Title.setAttribute('class', 'title');
  var $h3TitleText = document.createTextNode(object.objTitle);
  $h3Title.appendChild($h3TitleText);
  $infoColumnDiv.appendChild($h3Title);

  var $pArtist = document.createElement('p');
  $pArtist.setAttribute('class', 'artist');
  var $pArtistText = document.createTextNode(object.objArtist);
  $pArtist.appendChild($pArtistText);
  $infoColumnDiv.appendChild($pArtist);

  var $pMedium = document.createElement('p');
  $pMedium.setAttribute('class', 'medium');
  var $pMediumText = document.createTextNode(object.objMedium);
  $pMedium.appendChild($pMediumText);
  $infoColumnDiv.appendChild($pMedium);

  var $pGallery = document.createElement('p');
  $pGallery.setAttribute('class', 'gallery');
  var $pGalleryText = document.createTextNode(object.objGallery);
  $pGallery.appendChild($pGalleryText);
  $infoColumnDiv.appendChild($pGallery);

  var $buttonContainer = document.createElement('div');
  $buttonContainer.setAttribute('class', 'button-container display-flex justify-space-between');
  $infoColumnDiv.appendChild($buttonContainer);

  var $learnMoreAnchor = document.createElement('a');
  $learnMoreAnchor.setAttribute('class', 'button');
  $learnMoreAnchor.setAttribute('href', object.objUrl);
  $learnMoreAnchor.setAttribute('target', '_blank');
  var $paintIcon = document.createElement('i');
  $paintIcon.setAttribute('class', 'fas fa-paint-brush');
  $learnMoreAnchor.appendChild($paintIcon);
  var $learnMoreText = document.createTextNode('LEARN MORE');
  $learnMoreAnchor.appendChild($learnMoreText);
  $buttonContainer.appendChild($learnMoreAnchor);

  var $plusIcon = document.createElement('i');
  $plusIcon.setAttribute('class', 'add fas fa-plus fa-lg');
  $buttonContainer.appendChild($plusIcon);

  return $li;

}

// Function test:
renderObjectInfo(randomObjInfo[0]);
