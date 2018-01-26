let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';

let dataRequest = new XMLHttpRequest();

let whenDataLoaded = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  let dataObject = JSON.parse(dataText); // we convert the text into an object
  //let dataObjectCopy = copyDataObject(dataObject); // we copy the object before sorting it
  sortObjectbySpecificKey(dataObject,'Year');
  console.log(dataObject);
  //console.log(dataObjectCopy);
}

function sortObjectbySpecificKey(data,key) {
  // data: object to sort
  // key: the key on with which the sort will be done
  data.sort( function (a, b) { // we compare the value
    if (typeof a[key] === 'string') {
      return (a[key].toLowerCase() < b[key].toLowerCase()) ? -1 : (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : 0;
    } else {
      return a[key] - b[key];
    }
    /*
      Transcription of the line: return (a[key].toLowerCase() < b[key].toLowerCase()) ? -1 : (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : 0;
      if (a[key].toLowerCase()x < y) {
        return -1;
      } else if (a[key].toLowerCase() > y) {
        return 1;
      } else {
        return 0;
      }
    */
  });
}

function copyDataObject(dataObject) { // function to copy an object without any reference
  return dataObject.slice(0);
}


dataRequest.onload = whenDataLoaded; // we assign the function to excecute when the data are loading
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous ?
dataRequest.send(null); // we send the request
