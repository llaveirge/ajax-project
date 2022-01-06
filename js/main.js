var $searchInput = document.getElementById('search');
var $searchForm = document.getElementById('form');

// Listen for events and save search value to a variable before resetting the form:
var query;

function searchEventHandler(event) {
  event.preventDefault();

  query = $searchInput.value;

  $searchForm.reset();

  return query;
}

$searchForm.addEventListener('submit', searchEventHandler);

// Emtpy array to store Met object IDs in once gotten from the API
var objIdArr = [];

// Function to retreive object ID numbers from The Met api and save in objIdArr array:
function getObjectIds(query) {
  var queryXhr = new XMLHttpRequest();
  queryXhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/search?' + 'q=' + query + '&isOnView=true');
  queryXhr.responseType = 'json';

  queryXhr.addEventListener('load', function () {
    var responseObjectIds = queryXhr.response.objectIDs;

    // Add Ids to objIdArr array:
    for (var id of responseObjectIds) {
      objIdArr.push(id);
    }

  });
  queryXhr.send();
}

getObjectIds(query);
