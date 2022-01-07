var $searchInput = document.getElementById('search');
var $searchForm = document.getElementById('form');

// Empty array to store Met object IDs in once acquired from the API
var objIdArr = [];

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
  });

  queryXhr.send();
}

$searchForm.addEventListener('submit', searchEventHandler);

// Empty aray to store four random object IDs from the 'objIdArr' array:
var randomObjIds = [];

// Empty array to store the four random museum objects and their information:
// var randomObjInfo = [];

/* Select and remove 4 random Met museum object IDs out of the 'objIdArr' array
and add them to the 'randomObjIds' array: */
function randomize(array) {
  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * array.length);
    randomObjIds.push(objIdArr.splice(randomIndex, 1));
  }
  return randomObjIds;
  // remove ^return statement
}

randomize(objIdArr);
