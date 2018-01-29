$(window).on('load', function() { // age check modal on page load
  $('#ageWarning').modal('show');
});

let isItOlderThan18 = function(year, month, day) { // checks if user is older than 18 years old and returns true/false
  return new Date(year + 18, month - 1, day) <= new Date();
};

$('#ageVerif').click(function() { // 
  if (isItOlderThan18(Number($('#birthInput').val().split('-')[0]), Number($('#birthInput').val().split('-')[1]), Number($('#birthInput').val().split('-')[2])) === true) {
    $('#ageWarning').modal('hide');
  } else {
    location.href='http://www.imdb.com/?ref_=nv_home';
  };
});

$('#loginModal').on('shown.bs.modal', function() {
  $('#username').trigger('focus')
});

$('#registerModal').on('shown.bs.modal', function() {
  $('#name').trigger('focus')
});

$('#newAccount').click(function() {
  $('#registerModal').modal('show');
});

let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';

let dataRequest = new XMLHttpRequest();
let dataRequest2 = new XMLHttpRequest();

let whenDataLoadedMovies = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  let dataObject = JSON.parse(dataText); // we convert the text into an object
  sortObjectbySpecificKey(dataObject, 'Year', 'DESC');
  console.log(dataObject);
  //console.log(dataWithoutFalseValueOnSpecificKey(dataObject,'Slider'));
  //console.log(xLastElementsAccordingSpecificKey(dataObject,'Year',6));
  for (let i = 0; i < 6; i++) {
    createHTMLMovieItem(dataObject[i], '#top-movie .movie-list .row', 'top-movie');
  }
}

let whenDataLoadedTvShows = function() {
  let dataText = dataRequest2.responseText;
  let dataObject = JSON.parse(dataText);
  console.log(dataObject);
  for (let i = 0; i < 6; i++) {
    createHTMLTvShowItem(dataObject[i], '#featured-tvshows .tvshow-list .row', 'featured-tvshow');
  };
};

function sortObjectbySpecificKey(data, key, order = 'ASC') {
  // data: object to sort
  // key: the key on with which the sort will be done
  data.sort(function(a, b) { // we compare the value
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

function dataWithoutFalseValueOnSpecificKey(data, keyToTest) {
  let arrayData = []; // we initialize the array
  for (let key in data) { // we loop our object
    if (data[key][keyToTest] != false) { // if the value is not false
      arrayData.push(data[key]); // we add the value to the array
    }
  }
  return arrayData; // we return an array of object
}

function xFirstElementsAccordingSpecificKey(data, key, numberElement) {
  // return an array with X first elements of the object
  // sort according a specific key
  let arrayData = []; // we initialize the array
  sortObjectbySpecificKey(data, key, 'ASC'); // we sort the object
  for (let i = 0; i < numberElement && i < data.length; i++) { // we loop
    arrayData.push(data[i]); // we insert the value in the array
  }
  return arrayData; // we return the array
}

function xLastElementsAccordingSpecificKey(data, key, numberElement) {
  // return an array with X last elements of the object
  // sort according a specific key
  let arrayData = []; // we initialize the array
  sortObjectbySpecificKey(data, key, 'DESC'); // we sort the object
  for (let i = 0; i < numberElement && i < data.length; i++) { // we loop
    arrayData.push(data[i]); // we insert the value in the array
  }
  return arrayData; // we return the array
}

function copyObject(data) { // function to copy an object without any reference
  return data.slice(0); // we return the copy
}

function createHTMLMovieItem(data, parent, idPrefix) {
  let HTMLcontent = '<div class="col-6 col-md-2 card movie-item" id="' + idPrefix + '-' + data['ID'] + '"></div>'; // we open the div, insert class and ID
  $(HTMLcontent).appendTo($(parent)); // we add our HTML content to the parent
  $('#' + idPrefix + '-' + data['ID']).attr({
    'data-id': data['ID'],
    'data-year': data['Year'],
    'data-duration': data['Duration'],
    'data-genre': data['Genre'].join(', ').toLowerCase(),
    'data-director': data['Director'].join(', ').toLowerCase(),
    'data-writers': data['Writers'].join(', ').toLowerCase(),
    'data-actors': data['Actors'].join(', ').toLowerCase(),
    'data-country': data['Country'].toLowerCase(),
  });
  $('<img src="img/' + data['Poster'] + '" class="poster card-img-top img-fluid" title="' + data['Title'] + ' (' + data['Year'] + ')" >').appendTo($('#' + idPrefix + '-' + data['ID']));
  $('<div class="card-body"></div>').appendTo($('#' + idPrefix + '-' + data['ID']));
  $('<h5 class="card-title">' + data['Title'] + '</h5>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<h6 class="card-subtitle">' + data['Year'] + '</h6>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="card-text">' + data['Genre'][0] + '</div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="card-footer"></div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-footer'));
  $('<button type="button" class="btn btn-secondary"><i class="fa fa-info"></i></button>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .btn-group'));
  $('<button type="button" class="btn btn-secondary trailer-lightbox" data-trailer="' + data['Trailer'] + '"><i class="fa fa-youtube-play"></i></button>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .btn-group'));


}

function createHTMLTvShowItem(data, parent, idPrefix) {
  let HTMLcontent = '<div class="col-6 col-md-2 card tvshow-item" id="' + idPrefix + '-' + data['ID'] + '"></div>';
  $(HTMLcontent).appendTo($(parent)); // we add our HTML content to the parent
  if (data['Ending'] === false) {
    data['Ending'] = "Ongoing";
  };
  $('#' + idPrefix + '-' + data['ID']).attr({
    'data-id': data['ID'],
    'data-begin': data['Beginning'],
    'data-end': data['Ending'],
    'data-seasons': data['Seasons'],
    'data-episodes': data['Episodes'],
    'data-duration': data['Duration'],
    'data-genre': data['Genre'].join(', ').toLowerCase(),
    'data-creators': data['Creators'].join(', ').toLowerCase(),
    'data-actors': data['Actors'].join(', ').toLowerCase(),
  });
  $('<img src="' + data['Poster'] + '" class="poster card-img-top" title="' + data['Title'] + '(' + data['Beginning'] + '-' + data['Ending'] + ')" >').appendTo($('#' + idPrefix + '-' + data['ID']));
  $('<div class="card-body"></div>').appendTo($('#' + idPrefix + '-' + data['ID']));
  $('<h5 class="card-title">' + data['Title'] + '</h5>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<h6 class="card-subtitle">' + data['Beginning'] + '-' + data['Ending'] + '</h6>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="card-text">' + data['Genre'].join(', ') + '</div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="card-footer"></div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-body'));
  $('<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .card-footer'));
  $('<button type="button" class="btn btn-secondary"><i class="fa fa-info"></i></button>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .btn-group'));
  $('<button type="button" class="btn btn-secondary"><i class="fa fa-youtube-play"></i></button>').appendTo($('#' + idPrefix + '-' + data['ID'] + ' .btn-group'));
}

// We load the data
dataRequest.onload = whenDataLoadedMovies; // we assign the function to excecute when the data are loading
dataRequest2.onload = whenDataLoadedTvShows;
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous true/false
dataRequest2.open("GET", tvShowsFeed, true);
dataRequest.send(null); // we send the request
dataRequest2.send(null);
