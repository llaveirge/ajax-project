var $searchInput = document.getElementById('search');
var $searchForm = document.getElementById('form');
var $discoveriesList = document.getElementById('discoveries-list');
var $discoveriesPage = document.getElementById('discoveries');
var $searchPage = document.getElementById('search-form');
var $viewNodeList = document.querySelectorAll('.view');
var $discoverLink = document.getElementById('discover-link');
var $lis = document.getElementsByTagName('li');
var $mustSeePage = document.getElementById('must-see');
var $mustSeeList = document.getElementById('must-see-list');
const $mustSeeLink = document.getElementById('must-see-link');
const $searchLink = document.getElementById('search-link');
const $emptySavedMessage = document.getElementById('empty-saved-msg');

// Empty array to store Met object IDs in once acquired from the API
var objIdArr = [];

// Empty array to store four random object IDs from the 'objIdArr' array:
var randomObjIds = [];

// Listen for events and save search value to a variable before resetting the form:
var query;

function searchEventHandler(event) {
  event.preventDefault();

  // Start with a clean, empty 'objIdArr' if not empty already:
  objIdArr = [];

  // Start with a clean, empty 'randomObjIds' if not empty already:
  randomObjIds = [];

  // Start with a clean, empty 'searchObj' property in the data model if not empty already:
  data.searchObjects = [];

  // Remove any previous created 'li' elements from the DOM to display new results only:
  if ($discoveriesList.childNodes.length > 1) {
    for (var i = 0; i <= 3; i++) {
      $discoveriesList.removeChild($lis[0]);
    }
  }

  query = $searchInput.value;
  $searchForm.reset();

  // Hide search form and show discoveries:
  $searchPage.classList.add('hidden');
  $discoveriesPage.classList.remove('hidden');

  // Function to retrieve object ID numbers from The Met API and save in objIdArr array:
  var queryXhr = new XMLHttpRequest();
  queryXhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/search?isOnView=true&q=' + query);
  queryXhr.responseType = 'json';
  queryXhr.addEventListener('load', function () {
    var responseObjectIds = queryXhr.response.objectIDs;

    // Add response IDs to objIdArr array - *Test capturing only random Ids in API call*:
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

/* Function to select and remove 4 random Met museum object IDs from the 'objIdArr' array
and add them to the 'randomObjIds' array: */
function randomize(array) {
  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * array.length);
    randomObjIds.push(`${objIdArr.splice(randomIndex, 1)}`);
  }
}

// Function to retrieve randomized object data from Met API and store in 'searchObjects' property of data model:
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
      objUrl: response.objectURL,
      objMetId: response.objectID
    };

    data.searchObjects.push(objectData);

    // Display the four random objects on the Discoveries page without reloading:
    $discoveriesList.append(renderObjectInfo(objectData));
  });

  dataXhr.send();
}

// Define a function that returns a DOM tree for each object:
function renderObjectInfo(object) {
  var $li = document.createElement('li');
  $li.setAttribute('class', 'object display-flex wrap discovery-item');
  $li.setAttribute('id', object.objMetId);

  var $divObjImgCont = document.createElement('div');
  $divObjImgCont.setAttribute('class', 'obj-img-container col-full col-half');
  $li.appendChild($divObjImgCont);

  // *Add a default image for those that don't have an image or permission to share image*
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
  if (object.objArtist !== '') {
    var $pArtistText = document.createTextNode(object.objArtist);
  } else {
    $pArtistText = document.createTextNode('Artist Unknown');
  }

  $pArtist.appendChild($pArtistText);
  $infoColumnDiv.appendChild($pArtist);

  var $pMedium = document.createElement('p');
  $pMedium.setAttribute('class', 'medium');
  var $pMediumText = document.createTextNode(object.objMedium);
  $pMedium.appendChild($pMediumText);
  $infoColumnDiv.appendChild($pMedium);

  var $pGallery = document.createElement('p');
  $pGallery.setAttribute('class', 'gallery');
  var $pGalleryText = document.createTextNode('Gallery ');
  var $pGalleryNumber = document.createTextNode(object.objGallery);
  $pGallery.appendChild($pGalleryText);
  $pGallery.appendChild($pGalleryNumber);
  $infoColumnDiv.appendChild($pGallery);

  var $buttonContainer = document.createElement('div');
  $buttonContainer.setAttribute(
    'class', 'button-container display-flex justify-space-between'
  );
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

  var $plusIconButton = document.createElement('button');
  $plusIconButton.setAttribute('class', 'must-see-button icon-button plus-check');
  $plusIconButton.setAttribute('type', 'button');
  // add aria-pressed attribute

  var $plusIcon = document.createElement('i');
  // If saved, show checkmark instead of plus icon:
  if (object.saved === true) {
    $plusIcon.setAttribute('class', 'must-see-button saved fas fa-check fa-lg');
  } else {
    $plusIcon.setAttribute('class', 'must-see-button add fas fa-plus fa-lg');
  }

  $plusIconButton.appendChild($plusIcon);
  $buttonContainer.appendChild($plusIconButton);

  return $li;
}

// Listen for the 'DOMContentLoaded' event and add the 4 random objects to the Discoveries list:
function contentLoadedHandler(event) {
  for (var randomObj of data.searchObjects) {
    $discoveriesList.append(renderObjectInfo(randomObj));
  }

  // Add saved Items to the must-see list or show empty list error message:
  if (data.saved.length !== 0) {
    $emptySavedMessage.classList.add('hidden');
    for (var savedObj of data.saved) {
      $mustSeeList.append(renderSavedObjectInfo(savedObj));
    }
  }

  // Only show the appropriate page based on data.view value:
  for (var viewNode of $viewNodeList) {
    if (viewNode.id !== data.view) {
      viewNode.classList.add('hidden');
    } else {
      viewNode.classList.remove('hidden');
    }
  }
}

window.addEventListener('DOMContentLoaded', contentLoadedHandler);

// Listen for clicks on palette icon and 'discover' h1 heading and show search page:
function handleShowDiscoverClick(event) {

  // Logic gate:
  if (!event.target.matches('.search')) {
    return;
  }

  $searchPage.classList.remove('hidden');
  $discoveriesPage.classList.add('hidden');
  $mustSeePage.classList.add('hidden');
}

$discoverLink.addEventListener('click', handleShowDiscoverClick);
$searchLink.addEventListener('click', handleShowDiscoverClick);

// Listen for clicks on discoveries ul and change the plus icon to a checkmark icon:
function addToMustSee(event) {
  if (!event.target.classList.contains('must-see-button')) {
    return;
  }

  const saveButton = event.target.closest('button');
  const saveIcon = saveButton.firstElementChild;

  if (saveIcon.matches('.fa-plus')) {
    saveIcon.classList.replace('fa-plus', 'fa-check');

    var clickedLi = event.target.closest('li');
    var clickedObjId = +clickedLi.id;

    $emptySavedMessage.classList.add('hidden');

    // Assign 'nextObjId' to the clicked object's object literal in the randomObjId array *reconsider the name 'nextObjId'*:
    for (var randomObject of data.searchObjects) {
      if (randomObject.objMetId === clickedObjId) {
        randomObject.nextObjId = data.nextObjId;
        data.saved.unshift(randomObject);
        randomObject.saved = true;
        randomObject.seen = false;
        // render saved obj to must-see-list without loading:
        $mustSeeList.prepend(renderSavedObjectInfo(randomObject));
      }
    }
  }
  data.nextObjId++;
}

$discoveriesList.addEventListener('click', addToMustSee);

// Define a function that returns a DOM tree for each saved object:
function renderSavedObjectInfo(object) {
  var $li = document.createElement('li');
  $li.setAttribute('class', 'object display-flex wrap');
  $li.setAttribute('id', object.nextObjId);

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
  if (object.objArtist !== '') {
    var $pArtistText = document.createTextNode(object.objArtist);
  } else {
    $pArtistText = document.createTextNode('Artist Unknown');
  }

  $pArtist.appendChild($pArtistText);
  $infoColumnDiv.appendChild($pArtist);

  var $pMedium = document.createElement('p');
  $pMedium.setAttribute('class', 'medium');
  var $pMediumText = document.createTextNode(object.objMedium);
  $pMedium.appendChild($pMediumText);
  $infoColumnDiv.appendChild($pMedium);

  var $pGallery = document.createElement('p');
  $pGallery.setAttribute('class', 'gallery');
  var $pGalleryText = document.createTextNode('Gallery ');
  var $pGalleryNumber = document.createTextNode(object.objGallery);
  $pGallery.appendChild($pGalleryText);
  $pGallery.appendChild($pGalleryNumber);
  $infoColumnDiv.appendChild($pGallery);

  var $buttonContainer = document.createElement('div');
  $buttonContainer.setAttribute('class', 'button-container must-see-buttons display-flex justify-space-between');
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

  // Above (except for id) is same as previous render function *remove redundant code and make a single function*
  var $savedIconDiv = document.createElement('div');
  $savedIconDiv.setAttribute('class', 'display-flex align-items-center gap-15');
  $buttonContainer.appendChild($savedIconDiv);

  var $seenButton = document.createElement('button');
  $seenButton.setAttribute('class', 'icon-button seen-button');
  $seenButton.setAttribute('type', 'button');
  $seenButton.setAttribute('aria-pressed', object.seen);
  $savedIconDiv.appendChild($seenButton);

  var $eyeIcon = document.createElement('i');
  // If seen, show filled eye icon instead of eye prohibition icon *make ternary:
  if (object.seen) {
    $eyeIcon.setAttribute('class', 'eye-icon seen-button fas fa-eye fa-lg met-blue');
  } else {
    $eyeIcon.setAttribute('class', 'eye-icon seen-button fas fa-eye-slash fa-lg');
  }
  $seenButton.appendChild($eyeIcon);

  var $deleteIcon = document.createElement('i');
  $deleteIcon.setAttribute('class', 'delete fas fa-trash fa-lg');
  $savedIconDiv.appendChild($deleteIcon);

  return $li;
}

// consider replacing contains to matches?
function toggleSeen(event) {
  if (!event.target.classList.contains('seen-button')) {
    return;
  }

  const seenButton = event.target.closest('button');
  const seenIcon = seenButton.firstElementChild;

  if (seenIcon.matches('.fa-eye-slash')) {
    seenIcon.classList.replace('fa-eye-slash', 'fa-eye');
    seenIcon.classList.add('met-blue');
    seenButton.setAttribute('aria-pressed', true);
  } else {
    seenIcon.classList.remove('met-blue');
    seenIcon.classList.replace('fa-eye', 'fa-eye-slash');
    seenButton.setAttribute('aria-pressed', false);
  }

  const clickedLi = event.target.closest('li');
  const clickedObjId = +clickedLi.id;

  for (const savedObject of data.saved) {
    if (savedObject.nextObjId === clickedObjId) {
      savedObject.seen = !savedObject.seen;
    }
  }
}

$mustSeeList.addEventListener('click', toggleSeen);

function handleShowMustSeeClick(event) {
  // Logic gate:
  if (!event.target.matches('.must-see')) {
    return;
  }

  $searchPage.classList.add('hidden');
  $discoveriesPage.classList.add('hidden');
  $mustSeePage.classList.remove('hidden');
}

$mustSeeLink.addEventListener('click', handleShowMustSeeClick);

function handleHashChange(event) {

  if (location.hash === '#must-see') {
    $searchPage.classList.add('hidden');
    $discoveriesPage.classList.add('hidden');
    $mustSeePage.classList.remove('hidden');
  } else {
    $searchPage.classList.remove('hidden');
    $discoveriesPage.classList.add('hidden');
    $mustSeePage.classList.add('hidden');
  }

}

window.addEventListener('hashchange', handleHashChange);
