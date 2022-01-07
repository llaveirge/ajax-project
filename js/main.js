var $searchInput = document.getElementById('search');
var $searchForm = document.getElementById('form');

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
      objMeduim: response.medium,
      objGallery: response.GalleryNumber,
      objUrl: response.objectURL
    };

    randomObjInfo.push(objectData);
    data.searchObjects.push(objectData);

  });
  dataXhr.send();
}
