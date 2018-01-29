let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';

let dataRequest = new XMLHttpRequest();
let dataRequest2 = new XMLHttpRequest();

let whenDataLoadedMovies = function() { // callback function
  let dataText = dataRequest.responseText; // we store the text of the response
  let dataObject = JSON.parse(dataText); // we convert the text into an object
  sortObjectbySpecificKey(dataObject,'Year','DESC');
  //console.log(dataObject);
  //console.log(dataWithoutFalseValueOnSpecificKey(dataObject,'Slider'));
  //console.log(xLastElementsAccordingSpecificKey(dataObject,'Year',6));
  for(let i = 0; i < 6; i++) {
    createHTMLMovieItem(dataObject[i],'#top-movie .movie-list .row','top-movie');
  }
}

let whenDataLoadedTvShows = function() {
  let dataText = dataRequest2.responseText;
  let dataObject = JSON.parse(dataText);
  console.log(dataObject);
  for(let i = 0; i < 6; i++) {
    createHTMLTvShowItem(dataObject[i], '#featured-tvshows .tvshow-list .row','featured-tvshow');
  };
};

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
  $( '<img src="img/' + data['Poster'] + '" class="poster card-img-top img-fluid" title="' + data['Title'] + ' (' + data['Year'] + ')" >' ).appendTo( $( '#' + idPrefix + '-' + data['ID']) );
  $( '<div class="card-body"></div>' ).appendTo( $( '#' + idPrefix + '-' + data['ID']) );
  $( '<h5 class="card-title">' + data['Title'] + '</h5>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<h6 class="card-subtitle">' + data['Year'] + '</h6>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-text">' + data['Genre'][0] + '</div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>' ).appendTo( $( '#' + HTMLId + ' .card-footer') );
  $( '<button type="button" class="btn btn-secondary"><i class="fa fa-info"></i></button>').appendTo( $( '#' + HTMLId + ' .btn-group') );
  $( '<button type="button" class="btn btn-secondary btn-trailer-modal"></button>').appendTo( $( '#' + HTMLId + ' .btn-group') );
  $( '#' + HTMLId + ' .btn-trailer-modal' ).attr({
    'data-trailer': data['Trailer'],
    'data-toggle': 'modal',
    'data-target': '#trailer-' + HTMLId,
  })
  $( '#' + HTMLId + ' .btn-trailer-modal' ).html('<i class="fa fa-youtube-play"></i>');
  createHTMLItemTrailerModal(data, HTMLId,'trailer-');
}

function createHTMLItemTrailerModal(data,trailerParent,trailerIdPrefix) {
  //console.log(data,trailerParent);
  let HMTLModalContent = '<div class="modal fade trailer-modal" id="' + trailerIdPrefix + trailerParent + '" tabindex="-1" role="dialog" aria-labelledby="Trailer from ' + data['Title'] + '" aria-hidden="true">';
  $( HMTLModalContent ).appendTo( $( '#' + trailerParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + trailerIdPrefix + trailerParent ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-dialog' ) );
  $( '<div class="modal-body"></div>').appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-content' ) );
  $( '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo( $( '#' + trailerIdPrefix + trailerParent + ' .modal-body' ) );
  $( '#' + trailerIdPrefix + trailerParent + ' .modal-body' ).after('<div class="embed-responsive embed-responsive-16by9"></div>');
  if (getYoutubeID(data['Trailer']).length == 11) {
    $( '#' + trailerIdPrefix + trailerParent + ' .embed-responsive' ).html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(data['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
  } else {
    $( '#' + trailerIdPrefix + trailerParent + ' .embed-responsive' ).html('<div class="alert alert-secondary" role="alert"><p>Sorry we can\'t generate the preview video.</p><p>You could view it at the following address:<a href="' + data['Trailer'] + '" target="_blank">' + data['Trailer'] + '</a></p></div>');
  }
}

function createHTMLTvShowItem(data,parent,idPrefix) {
  let HTMLcontent = '<div class="col-6 col-md-2 card tvshow-item" id="' + idPrefix + '-' + data['ID'] + '"></div>';
  $( HTMLcontent ).appendTo( $( parent ) ); // we add our HTML content to the parent
  if (data['Ending'] === false) {
    data['Ending'] = "Ongoing";
  };
  $( '#' + idPrefix + '-' + data['ID'] ).attr({
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
  $( '<img src="' + data['Poster'] + '" class="poster card-img-top" title="' + data['Title'] + '(' + data['Beginning'] + '-' + data['Ending'] + ')" >' ).appendTo( $( '#' + idPrefix + '-' + data['ID']) );
  $( '<div class="card-body"></div>' ).appendTo( $( '#' + idPrefix + '-' + data['ID']) );
  $( '<h5 class="card-title">' + data['Title'] + '</h5>' ).appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .card-body') );
  $( '<h6 class="card-subtitle">' + data['Beginning'] + '-' + data['Ending'] + '</h6>' ).appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .card-body') );
  $( '<div class="card-text">' + data['Genre'].join(', ') + '</div>' ).appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .card-body') );
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .card-body') );
  $( '<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>' ).appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .card-footer') );
  $( '<button type="button" class="btn btn-secondary"><i class="fa fa-info"></i></button>').appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .btn-group') );
  $( '<button type="button" class="btn btn-secondary"><i class="fa fa-youtube-play"></i></button>').appendTo( $( '#' + idPrefix + '-' + data['ID'] + ' .btn-group') );
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

// We load the data
dataRequest.onload = whenDataLoadedMovies; // we assign the function to excecute when the data are loading
dataRequest2.onload = whenDataLoadedTvShows;
dataRequest.open("GET", moviesFeed, true); // the type, the url, asynchronous true/false
dataRequest2.open("GET", tvShowsFeed, true);
dataRequest.send(null); // we send the request
dataRequest2.send(null);
