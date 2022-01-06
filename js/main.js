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

  // Function to retreive object ID numbers from The Met API and save in objIdArr array:
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
