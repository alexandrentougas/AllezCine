let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';

let dataRequest = new XMLHttpRequest();

let whenDataLoaded = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  let dataObject = JSON.parse(dataText); // we convert the text into an object
  //sortObjectbySpecificKey(dataObject,'Title');
  console.log(dataObject);
  //console.log(dataWithoutFalseValueOnSpecificKey(dataObject,'Slider'));
  //console.log(xLastElementsAccordingSpecificKey(dataObject,'Year',6));

  //createHTMLMovieItem(dataObject[0],'#top-movie .movie-list .row');
}

function sortObjectbySpecificKey(data,key,order = 'ASC') {
  // data: object to sort
  // key: the key on with which the sort will be done
  data.sort( function (a, b) { // we compare the value
    if (order === 'ASC') {
      if (typeof a[key] === 'string') {
        return (a[key].toLowerCase() < b[key].toLowerCase()) ? -1 : (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : 0;
      } else {
        return a[key] - b[key];
      }
    } else { // if order is 'DESC'
      if (typeof a[key] === 'string') {
        return (b[key].toLowerCase() < a[key].toLowerCase()) ? -1 : (b[key].toLowerCase() > a[key].toLowerCase()) ? 1 : 0;
      } else {
        return b[key] - a[key];
      }
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

function dataWithoutFalseValueOnSpecificKey(data,keyToTest) {
  let arrayData = []; // we initialize the array
  for (let key in data) { // we loop our object
    if (data[key][keyToTest] != false) { // if the value is not false
      arrayData.push(data[key]); // we add the value to the array
    }
  }
  return arrayData; // we return an array of object
}

function xFirstElementsAccordingSpecificKey(data,key,numberElement) {
  // return an array with X first elements of the object
  // sort according a specific key
  let arrayData = []; // we initialize the array
  sortObjectbySpecificKey(data,key,'ASC'); // we sort the object
  for (let i = 0; i < numberElement && i < data.length; i++) { // we loop
    arrayData.push(data[i]); // we insert the value in the array
  }
  return arrayData; // we return the array
}

function xLastElementsAccordingSpecificKey(data,key,numberElement) {
  // return an array with X last elements of the object
  // sort according a specific key
  let arrayData = []; // we initialize the array
  sortObjectbySpecificKey(data,key,'DESC'); // we sort the object
  for (let i = 0; i < numberElement && i < data.length; i++) { // we loop
    arrayData.push(data[i]); // we insert the value in the array
  }
  return arrayData; // we return the array
}

function copyObject(data) { // function to copy an object without any reference
  return data.slice(0); // we return the copy
}

function createHTMLMovieItem(data,parent) {
  let HTMLcontent = '<div class="col-6 col-md-2 movie-item" ';
  HTMLcontent += 'data-id="' + data['ID'] + '"';
  HTMLcontent += '>';
  HTMLcontent += '</div>';
  $( HTMLcontent ).appendTo( $( parent ) ); // we add our HTML content to the parent
}

// We load the data
dataRequest.onload = whenDataLoaded; // we assign the function to excecute when the data are loading
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous ?
dataRequest.send(null); // we send the request
