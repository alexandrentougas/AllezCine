// Variables
let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';
let numberElement = 6;

let dataRequest = new XMLHttpRequest();
let dataRequest2 = new XMLHttpRequest();

let dataObject;

let whenDataLoadedMovies = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  dataObject = JSON.parse(dataText); // we convert the text into an object
  //console.log(dataObject);
  //console.log(dataWithoutFalseValueOnSpecificKey(dataObject,'Slider'));
  //console.log(xLastElementsAccordingSpecificKey(dataObject,'Year',6));
  displayTopMovie(dataObject,'#top-movie .movie-list > .row','top-movie',numberElement);
  displayXFeaturedMovies(dataObject,'#featured-movies .movie-list > .row','featured-movie',0,numberElement);

  $('#featured-movies .load-more').show();
  $('#featured-movies .load-more').on('click',function(e) {
    $startElement = $('#featured-movies .movie-list > .row .movie-item').length;
    displayXFeaturedMovies(dataObject,'#featured-movies .movie-list > .row','featured-movie',$startElement,numberElement);
    console.log($('#featured-movies .movie-list > .row .movie-item').length, dataObject.length)
    if( $('#featured-movies .movie-list > .row .movie-item').length >= dataObject.length ) {
      $('#featured-movies .load-more').hide();
    }
  });

}


let whenDataLoadedTvShows = function() {
  let dataText = dataRequest2.responseText;
  let dataObject = JSON.parse(dataText);
  //console.log(dataObject);
  for (let i = 0; i < 6; i++) {
    createHTMLTvShowItem(dataObject[i], '#featured-tvshows .tvshow-list > .row', 'featured-tvshow');
  };
};

function displayTopMovie(data,parent,idPrefix,numberElement) {
  let xElements = xLastElementsAccordingSpecificKey(data,'Year',numberElement);
  for(let i = 0; i < xElements.length; i++) {
    createHTMLMovieItem(xElements[i],parent,idPrefix);
  }
  return true;
}

function displayXFeaturedMovies(data,parent,idPrefix,start = 0,numberElement = 6) {
  sortObjectbySpecificKey(data,'Title');
  for(let i = start; i < (start + numberElement) && i < data.length; i++) {
    createHTMLMovieItem(data[i],parent,idPrefix);
  }
  return true;
}

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

function createHTMLMovieItem(data,parent,idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLContent = '<div class="col-12 col-sm-6 col-md-4 col-lg-2 card movie-item" id="' + HTMLId + '"></div>'; // we open the div, insert class and ID
  $( HTMLContent ).appendTo( $( parent ) ); // we add our HTML content to the parent
  $( '#' + HTMLId ).attr({
    'data-id': data['ID'],
    'data-year': data['Year'],
    'data-duration': data['Duration'],
    'data-genre': data['Genre'].join(', ').toLowerCase(),
    'data-director': data['Director'].join(', ').toLowerCase(),
    'data-writers': data['Writers'].join(', ').toLowerCase(),
    'data-actors': data['Actors'].join(', ').toLowerCase(),
    'data-country': data['Country'].toLowerCase(),
  });
  $( '<img src="img/' + data['Poster'] + '" class="poster card-img-top img-fluid" title="' + data['Title'] + ' (' + data['Year'] + ')" >' ).appendTo( $( '#' + HTMLId) );
  $( '<div class="card-body"></div>' ).appendTo( $( '#' + HTMLId) );
  $( '<h5 class="card-title">' + data['Title'] + '</h5>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<h6 class="card-subtitle">' + data['Year'] + '</h6>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-text">' + data['Genre'][0] + '</div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>' ).appendTo( $( '#' + HTMLId + ' .card-footer') );
  $( '<button type="button" class="btn btn-secondary btn-information-modal"></button>').appendTo( $( '#' + HTMLId + ' .btn-group') );
  $( '#' + HTMLId + ' .btn-information-modal' ).attr({
    'data-toggle': 'modal',
    'data-target': '#information-' + HTMLId,
  });
  $( '#' + HTMLId + ' .btn-information-modal' ).html('<i class="fa fa-info"></i>');
  $( '<button type="button" class="btn btn-secondary btn-trailer-modal"></button>').appendTo( $( '#' + HTMLId + ' .btn-group') );
  $( '#' + HTMLId + ' .btn-trailer-modal' ).attr({
    'data-trailer': data['Trailer'],
    'data-toggle': 'modal',
    'data-target': '#trailer-' + HTMLId,
  })
  $( '#' + HTMLId + ' .btn-trailer-modal' ).html('<i class="fa fa-youtube-play"></i>');
  createHTMLItemTrailerModal(data, HTMLId,'trailer-');
  createHTMLMovieItemInformationModal(data,HTMLId,'information-');
}

function createHTMLItemTrailerModal(data,trailerParent,trailerIdPrefix) {
  //console.log(data,trailerParent);
  let HMTLModalContent = '<div class="modal fade trailer-modal" id="' + trailerIdPrefix + trailerParent + '" tabindex="-1" role="dialog" aria-labelledby="Trailer from ' + data['Title'] + '" aria-hidden="true"></div>';
  $( HMTLModalContent ).appendTo( $( '#' + trailerParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + trailerIdPrefix + trailerParent ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-dialog' ) );
  $( '<div class="modal-body"></div>').appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-content' ) );
  $( '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-body' ) );
  $( '#' + trailerIdPrefix + trailerParent + ' .modal-body button' ).after('<div class="embed-responsive embed-responsive-16by9"></div>');
  if (getYoutubeID(data['Trailer']).length == 11) {
    $( '#' + trailerIdPrefix + trailerParent + ' .embed-responsive' ).html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(data['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
  } else {
    $( '#' + trailerIdPrefix + trailerParent + ' .embed-responsive' ).html('<div class="alert alert-secondary" role="alert"><p>Sorry we can\'t generate the preview video.</p><p>You could view it at the following address:<a href="' + data['Trailer'] + '" target="_blank">' + data['Trailer'] + '</a></p></div>');
  }
}

function createHTMLMovieItemInformationModal(data,informationParent,informationIdPrefix) {
  let HMTLModalContent = '<div class="modal fade infomation-modal" id="' + informationIdPrefix + informationParent + '" tabindex="-1" role="dialog" aria-labelledby="Information about ' + data['Title'] + '" aria-hidden="true"></div>';
  $( HMTLModalContent ).appendTo( $( '#' + informationParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-dialog' ) );
  $( '<div class="modal-header"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-content' ) );
  $( '<h5 class="modal-title">' + data['Title'] + ' (' + data['Year'] + ')</h5>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-header' ) );
  $( '#' + informationIdPrefix + informationParent + ' .modal-title' ).after('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
  $( '<div class="modal-body"></div>').appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-content' ) );
  $( '<div class="container-fluid"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-body' ) );
  //$( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid' ).html('<h6>Main information</h6>')
  //$( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid h6' ).after('<div class="row main-information"></div>')
  $( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid' ).html('<div class="row main-information"></div>')
  $( '<div class="col-12 col-sm-4 poster-modal"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .row' ) );
  $( '#' + informationIdPrefix + informationParent + ' .poster-modal' ).html('<img src="img/' + data['Poster'] + '" class="img-fluid">');
  $( '#' + informationIdPrefix + informationParent + ' .poster-modal' ).after('<div class="col-12 col-sm-8 main-data-modal"></div>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal' ).html('<p>' + data['Summary'] + '</p>')
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > p' ).after('<table class="table table-hover table-sm"></table>');
  $('<tr><td>Release date</td><td>' + data['Released'] + '</td></tr>').appendTo( $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table' ) );
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Country</td><td>' + data['Country'] + ' min.</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Duration</td><td>' + data['Duration'] + ' min.</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Genre</td><td>' + data['Genre'].join(', ') + '</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Director</td><td>' + data['Director'].join(', ') + '</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Writer</td><td>' + data['Writers'].join(', ') + '</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Actor</td><td>' + data['Actors'].join(', ') + '</td></tr>');
  //$( '#' + informationIdPrefix + informationParent + ' .main-information' ).after('<h6>Trailer</h6>');
  //$( '#' + informationIdPrefix + informationParent + ' h6:last-of-type' ).after('<div class="embed-responsive embed-responsive-16by9"></div>');
  //$( '#' + informationIdPrefix + informationParent + ' .embed-responsive' ).html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(data['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
}

function createHTMLTvShowItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLcontent = '<div class="col-12 col-sm-6 col-md-4 col-lg-2 card tvshow-item" id="' + HTMLId + '"></div>';
  $(HTMLcontent).appendTo($(parent)); // we add our HTML content to the parent
  if (data['Ending'] === false) {
    data['Ending'] = "Ongoing";
  };
  $('#' + HTMLId).attr({
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
  $('<img src="' + data['Poster'] + '" class="poster card-img-top img-fluid" title="' + data['Title'] + '(' + data['Beginning'] + '-' + data['Ending'] + ')" >').appendTo($('#' + HTMLId));
  $('<div class="card-body"></div>').appendTo($('#' + HTMLId));
  $('<h5 class="card-title">' + data['Title'] + '</h5>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<h6 class="card-subtitle">' + data['Beginning'] + '-' + data['Ending'] + '</h6>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<div class="card-text">' + data['Genre'][0] + '</div>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<div class="card-footer"></div>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>').appendTo($('#' + HTMLId + ' .card-footer'));
  $('<button type="button" class="btn btn-secondary btn-information-modal"></button>').appendTo($('#' + HTMLId + ' .btn-group'));
  $( '#' + HTMLId + ' .btn-information-modal' ).attr({
    'data-toggle': 'modal',
    'data-target': '#information-' + HTMLId,
  });
  $( '#' + HTMLId + ' .btn-information-modal' ).html('<i class="fa fa-info"></i>');
  $('<button type="button" class="btn btn-secondary btn-trailer-modal"></button>').appendTo($('#' + HTMLId + ' .btn-group'));
  $( '#' + HTMLId + ' .btn-trailer-modal' ).attr({
    'data-trailer': data['Trailer'],
    'data-toggle': 'modal',
    'data-target': '#trailer-' + HTMLId,
  })
  $( '#' + HTMLId + ' .btn-trailer-modal' ).html('<i class="fa fa-youtube-play"></i>');
  createHTMLItemTrailerModal(data, HTMLId,'trailer-');
  createHTMLTvShowItemInformationModal(data,HTMLId,'information-');
}

function createHTMLTvShowItemInformationModal(data,informationParent,informationIdPrefix) {
  let HMTLModalContent = '<div class="modal fade infomation-modal" id="' + informationIdPrefix + informationParent + '" tabindex="-1" role="dialog" aria-labelledby="Information about ' + data['Title'] + '" aria-hidden="true"></div>';
  $( HMTLModalContent ).appendTo( $( '#' + informationParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-dialog' ) );
  $( '<div class="modal-header"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-content' ) );
  $( '<h5 class="modal-title">' + data['Title'] + ' (' + data['Beginning'] + '-' + data['Ending'] + ')</h5>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-header' ) );
  $( '#' + informationIdPrefix + informationParent + ' .modal-title' ).after('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
  $( '<div class="modal-body"></div>').appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-content' ) );
  $( '<div class="container-fluid"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .modal-body' ) );
  //$( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid' ).html('<h6>Main information</h6>')
  //$( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid h6' ).after('<div class="row main-information"></div>')
  $( '#' + informationIdPrefix + informationParent + ' .modal-body .container-fluid' ).html('<div class="row main-information"></div>')
  $( '<div class="col-12 col-sm-4 poster-modal"></div>' ).appendTo( $( '#' + informationIdPrefix + informationParent + ' .row' ) );
  $( '#' + informationIdPrefix + informationParent + ' .poster-modal' ).html('<img src="' + data['Poster'] + '" class="img-fluid">');
  $( '#' + informationIdPrefix + informationParent + ' .poster-modal' ).after('<div class="col-12 col-sm-8 main-data-modal"></div>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal' ).html('<p>' + data['Summary'] + '</p>')
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > p' ).after('<table class="table table-hover table-sm"></table>');
  $('<tr><td>Release date</td><td>' + data['Beginning'] + '</td></tr>').appendTo( $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table' ) );
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Seasons</td><td>' + data['Seasons'] + ' seasons.</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Episodes</td><td>' + data['Episodes'] + ' episodes.</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Duration</td><td>' + data['Duration'] + ' min.</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Genre</td><td>' + data['Genre'].join(', ') + '</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Director</td><td>' + data['Creators'].join(', ') + '</td></tr>');
  $( '#' + informationIdPrefix + informationParent + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Actor</td><td>' + data['Actors'].join(', ') + '</td></tr>');
  //$( '#' + informationIdPrefix + informationParent + ' .main-information' ).after('<h6>Trailer</h6>');
  //$( '#' + informationIdPrefix + informationParent + ' h6:last-of-type' ).after('<div class="embed-responsive embed-responsive-16by9"></div>');
  //$( '#' + informationIdPrefix + informationParent + ' .embed-responsive' ).html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(data['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
}

/**
* Get YouTube ID from various YouTube URL
* author: takien (http://takien.com)
*/

function getYoutubeID(url){
  let ID = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    return ID[0];
  } else {
    return url;
  }
}

// We mask "load more" button until the data are loaded
$('#featured-movies .load-more').hide();

// We load the data
dataRequest.onload = whenDataLoadedMovies; // we assign the function to excecute when the data are loading
dataRequest2.onload = whenDataLoadedTvShows;
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous true/false
dataRequest2.open("GET", tvShowsFeed, true);
dataRequest.send(null); // we send the request
dataRequest2.send(null);

/*$(window).on('load', function() { // age check modal on page load
  $('#ageWarning').modal('show');
});*/

let isItOlderThan18 = function(year, month, day) { // checks if user is older than 18 years old and returns true/false
  return new Date(year + 18, month - 1, day) <= new Date();
};

/*$('#ageVerif').click(function() { //
  if (isItOlderThan18(Number($('#birthInput').val().split('-')[0]), Number($('#birthInput').val().split('-')[1]), Number($('#birthInput').val().split('-')[2])) === true) {
    $('#ageWarning').modal('hide');
  } else {
    location.href='http://www.imdb.com/?ref_=nv_home';
  };
});*/

$('#loginModal').on('shown.bs.modal', function() {
  $('#username').trigger('focus')
});

$('#registerModal').on('shown.bs.modal', function() {
  $('#name').trigger('focus')
});

$('#newAccount').click(function() {
  $('#registerModal').modal('show');
});
