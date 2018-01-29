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

  displayTopMovie(dataObject,'#top-movie .movie-list > .row','top-movie',numberElement); // we write the Top Movies
  displayXFeaturedMovies(dataObject,'#featured-movies .movie-list > .row','featured-movie',0,numberElement); // we display the first Feature movies

  // data are loaded, so we could show "options"
  $('#featured-movies .load-more').show();
  $('#featured-movies aside').show();

  // add addEventListenerForTrailer for movie-list
  addEventListenerForTrailer( '.movie-list .btn-trailer-modal' );
  addEventListenerForInformation( '.movie-list .btn-information-modal' );

  // on click, we display the X next movies
  $('#featured-movies .load-more').on('click', function(e) {
    $startElement = $('#featured-movies .movie-list > .row .movie-item').length; // we check the number of alreay displayed movies
    displayXFeaturedMovies(dataObject,'#featured-movies .movie-list > .row','featured-movie',$startElement,numberElement); // we display the X next movies
    if( $('#featured-movies .movie-list > .row .movie-item').length >= dataObject.length ) { // if we have display all movies, we hide the button "load more"
      $('#featured-movies .load-more').hide();
    }
    addEventListenerForTrailer( '.movie-list .btn-trailer-modal' ); // we had the new movies to the event listener
    addEventListenerForInformation( '.movie-list .btn-information-modal' ); // we had the new movies to the event listener
  });

  // filter to select movies by genre
  $('#featured-movies aside button').on('click', function(e) {

    if ($(this).attr('data-genre') === 'all') {
        $('#featured-movies .movie-item').show();
    } else {
      $('#featured-movies .movie-item').hide();
      $('#featured-movies .movie-item[data-genre*="' + $(this).attr('data-genre') + '"]').show();
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

function getFilenameForSpecificSize(imgFilename,size = 350) {
  return imgFilename.split('.')[0] + '_' + size + '.' + imgFilename.split('.')[1]; // we construct the new image name
}

function displayTopMovie(data,parent,idPrefix,numberElement) { // we display X elements in TopMovie section
  let xElements = xLastElementsAccordingSpecificKey(data,'Year',numberElement); // we select X latest elements sort by a specific key
  for(let i = 0; i < xElements.length; i++) {
    createHTMLMovieItem(xElements[i],parent,idPrefix); // we generate the HTML
  }
  return true;
}

function displayXFeaturedMovies(data,parent,idPrefix,start = 0,numberElement = 6) { // function to display X new movies in Featured sections
  sortObjectbySpecificKey(data,'Title'); // we sort by 'Title'
  for(let i = start; i < (start + numberElement) && i < data.length; i++) { // we select X elements from position 'start'
    createHTMLMovieItem(data[i],parent,idPrefix); // we generate the HTML
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

function createHTMLMovieItem(data,parent,idPrefix) { // we create the item for one movie
  let HTMLId = idPrefix + '-' + data['ID']; // we construct the HTML id of this movie
  let HTMLContent = '<div class="col-12 col-sm-6 col-md-4 col-lg-2 card movie-item" id="' + HTMLId + '"></div>'; // we open the div, insert class and ID
  $( HTMLContent ).appendTo( $( parent ) ); // we add our HTML content to the parent
  $( '#' + HTMLId ).attr({ // we insert some data-attribute
    'data-id': data['ID'],
    'data-year': data['Year'],
    'data-duration': data['Duration'],
    'data-genre': data['Genre'].join(' ').toLowerCase(),
    'data-director': data['Director'].join(', ').toLowerCase(),
    'data-writers': data['Writers'].join(', ').toLowerCase(),
    'data-actors': data['Actors'].join(', ').toLowerCase(),
    'data-country': data['Country'].toLowerCase(),
  });
  $( '<img src="img/movies/' + getFilenameForSpecificSize(data['Poster'],350) + '" class="poster card-img-top img-fluid" title="' + data['Title'] + ' (' + data['Year'] + ')" >' ).appendTo( $( '#' + HTMLId) ); // we add the poster
  $( '<div class="card-body"></div>' ).appendTo( $( '#' + HTMLId) ); // we construct the card
  $( '<h5 class="card-title">' + data['Title'] + '</h5>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<h6 class="card-subtitle">' + data['Year'] + '</h6>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-text">' + data['Genre'][0] + '</div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>' ).appendTo( $( '#' + HTMLId + ' .card-footer') ); // we generate the button group
  $( '<button type="button" class="btn btn-secondary btn-information-modal"></button>').appendTo( $( '#' + HTMLId + ' .btn-group') ); // we generate the 1st button
  $( '#' + HTMLId + ' .btn-information-modal' ).attr({ // we add some data-attribute
    'data-id': data['ID'],
    'data-type': 'movie',
  });
  $( '#' + HTMLId + ' .btn-information-modal' ).html('<i class="fa fa-info"></i>'); // we add the icon
  $( '<button type="button" class="btn btn-secondary btn-trailer-modal"></button>').appendTo( $( '#' + HTMLId + ' .btn-group') );  // we generate the 2nd button
  $( '#' + HTMLId + ' .btn-trailer-modal' ).attr({ // we add some data-attribute
    'data-trailer': data['Trailer'],
    'data-type': 'movie',
    'data-id': data['ID'],
  })
  $( '#' + HTMLId + ' .btn-trailer-modal' ).html('<i class="fa fa-youtube-play"></i>');
}

function createHTMLItemTrailerModal(data,trailerParent,trailerIdPrefix) {
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

function createHTMLItemTrailerModal_v2(data,trailerParent,idData) {
  let currentHTMLID = trailerParent + '-item-' + idData; // construction of the html id of the modal
  let HMTLModalContent = '<div class="modal fade trailer-modal" id="' + currentHTMLID + '" tabindex="-1" role="dialog" aria-labelledby="Trailer from ' + data['Title'] + '" aria-hidden="true"></div>'; // we create the main div of the modal
  $( HMTLModalContent ).appendTo( $( '#' + trailerParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + currentHTMLID ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-dialog' ) );
  $( '<div class="modal-body"></div>').appendTo( $( '#' + currentHTMLID + ' .modal-content' ) );
  $( '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo( $( '#' + currentHTMLID + ' .modal-body' ) );
  $( '#' + currentHTMLID + ' .modal-body button' ).after('<div class="embed-responsive embed-responsive-16by9"></div>');
  if (getYoutubeID(data['Trailer']).length == 11) { // we retrieve the youtube ID video
    $( '#' + currentHTMLID + ' .embed-responsive' ).html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(data['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
  } else { // if we can't have the youtube ID video, we construct a link to the video and an alert message
    $( '#' + currentHTMLID + ' .embed-responsive' ).html('<div class="alert alert-secondary" role="alert"><p>Sorry we can\'t generate the preview video.</p><p>You could view it at the following address:<a href="' + data['Trailer'] + '" target="_blank">' + data['Trailer'] + '</a></p></div>');
  }
}

function addEventListenerForTrailer(selector) { // we had the click on trailer button to the event listener
  $(selector).on('click', function(e){ // we select the buttons
    let idItem = Number($(this).attr('data-id')); // we save the ID movie thanks to the data-id attribute
    let typeItem = $(this).attr('data-type');
    let objectMovie = dataObject.filter(function( obj ) { // we select the right object in all our data
      return (obj.ID == idItem) ? obj : false; // we return the object
    });
    if ( $('#' + typeItem + '-trailer-item-'+idItem).length == 0 ) { // we check if the trailer modal already exists or not
      createHTMLItemTrailerModal_v2(objectMovie[0], typeItem + '-trailer',idItem); // if not we create it in the right section
      $('#' + typeItem + '-trailer-item-'+idItem).modal('show'); // we show it
    } else {
      $('#' + typeItem + '-trailer-item-'+idItem).modal('show'); // if already existe we show it
    }
  });
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
  $( '#' + informationIdPrefix + informationParent + ' .poster-modal' ).html('<img src="img/movies/' + data['Poster'] + '" class="img-fluid">');
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

function createHTMLMovieItemInformationModal_v2(data,informationParent,idData) {
  let currentHTMLID = informationParent + '-item-' + idData;
  let HMTLModalContent = '<div class="modal fade infomation-modal" id="' + currentHTMLID + '" tabindex="-1" role="dialog" aria-labelledby="Information about ' + data['Title'] + '" aria-hidden="true"></div>';
  $( HMTLModalContent ).appendTo( $( '#' + informationParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + currentHTMLID ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-dialog' ) );
  $( '<div class="modal-header"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-content' ) );
  $( '<h5 class="modal-title">' + data['Title'] + ' (' + data['Year'] + ')</h5>' ).appendTo( $( '#' + currentHTMLID + ' .modal-header' ) );
  $( '#' + currentHTMLID + ' .modal-title' ).after('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
  $( '<div class="modal-body"></div>').appendTo( $( '#' + currentHTMLID + ' .modal-content' ) );
  $( '<div class="container-fluid"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-body' ) );
  $( '#' + currentHTMLID + ' .modal-body .container-fluid' ).html('<div class="row main-information"></div>')
  $( '<div class="col-12 col-sm-4 poster-modal"></div>' ).appendTo( $( '#' + currentHTMLID + ' .row' ) );
  $( '#' + currentHTMLID + ' .poster-modal' ).html('<img src="img/movies/' + data['Poster'] + '" class="img-fluid">');
  $( '#' + currentHTMLID + ' .poster-modal' ).after('<div class="col-12 col-sm-8 main-data-modal"></div>');
  $( '#' + currentHTMLID + ' .main-data-modal' ).html('<p>' + data['Summary'] + '</p>')
  $( '#' + currentHTMLID + ' .main-data-modal > p' ).after('<table class="table table-hover table-sm"></table>');
  $('<tr><td>Release date</td><td>' + data['Released'] + '</td></tr>').appendTo( $( '#' + currentHTMLID + ' .main-data-modal > table' ) );
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Country</td><td>' + data['Country'] + ' min.</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Duration</td><td>' + data['Duration'] + ' min.</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Genre</td><td>' + data['Genre'].join(', ') + '</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Director</td><td>' + data['Director'].join(', ') + '</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Writer</td><td>' + data['Writers'].join(', ') + '</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Actor</td><td>' + data['Actors'].join(', ') + '</td></tr>');
}

function addEventListenerForInformation(selector) { // we had the click on information button to the event listener
  $(selector).on('click', function(e){ // we select the buttons
    let idItem = Number($(this).attr('data-id')); // we save the ID movie thanks to the data-id attribute
    let typeItem = $(this).attr('data-type');
    let objectMovie = dataObject.filter(function( obj ) { // we select the right object in all our data
      return (obj.ID == idItem) ? obj : false; // we return the object
    });
    if ( $('#' + typeItem + '-information-item-'+idItem).length == 0 ) { // we check if the information modal already exists or not
      createHTMLMovieItemInformationModal_v2(objectMovie[0], typeItem + '-information',idItem); // if not we create it in the right section
      $('#' + typeItem + '-information-item-'+idItem).modal('show'); // we show it
    } else {
      $('#' + typeItem + '-information-item-'+idItem).modal('show'); // if already existe we show it
    }
  });
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

// We mask these elements until all the data are loaded
$('#featured-movies .load-more').hide();
$('#featured-movies aside').hide();

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
