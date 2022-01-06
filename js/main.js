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
