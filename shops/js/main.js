let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';

let dataRequest = new XMLHttpRequest();

let whenDataLoaded = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  let dataObject = JSON.parse(dataText); // we convert the text into an object
  console.log(dataObject);
}


dataRequest.onload = whenDataLoaded; // we assign the function to excecute when the data are loading
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous ?
dataRequest.send(null); // we send the request
