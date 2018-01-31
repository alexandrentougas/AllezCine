// Variables
let moviesFeed = 'https://laurenthu.github.io/AllezCine/shops/database/movies.json';
let tvShowsFeed = 'https://laurenthu.github.io/AllezCine/shops/database/tvshows.json';
let numberElement = 6;
let numberElementShop = 8;

let dataRequestMovie = new XMLHttpRequest();
let dataRequestTvShow = new XMLHttpRequest();

let movieObject; // to be sure that object has a global scope
let tvShowObject;

// When date about movies are loaded
let whenDataLoadedMovies = function() { // callback function
  let dataText = dataRequestMovie.responseText; // we store the text of the response
  movieObject = JSON.parse(dataText); // we convert the text into an object

  displayTopMovie(movieObject,'#top-movie .movie-list > .row','top-movie',numberElement); // we write the Top Movies
  displayXFeaturedMovies(movieObject,'#featured-movies .movie-list > .row','featured-movie',0,numberElement); // we display the first Feature movies

  // display first element in shop
  displayXItemsMovieInShop(movieObject,'#shop-movies .movie-list > .row:first-of-type','shop-movie',0,numberElementShop);
  $('#shop-movies aside .btn').attr('data-start',0);
  checkNavigationButtonInShop(movieObject.length,numberElementShop);

  defaultElement = xLastElementsAccordingSpecificKey(movieObject, 'Year', 1);
  createHTMLItemInformationInMovieShop( defaultElement[0] , '#shop-movies .preview-information' );

  // data are loaded, so we could show "options"
  $('#featured-movies .less-more-movies').show();
  $('#featured-movies aside').show();

  // add addEventListenerForTrailer for movie-list
  addEventListenerForTrailer( '.movie-list .btn-trailer-modal' );
  addEventListenerForInformation( '.movie-list .btn-information-modal' );

  // on click, we display the X next movies
  $('#featured-movies .more-movies').on('click', function(e) {
    startElement = $('#featured-movies .movie-list > .row .movie-item').length; // we check the number of alreay displayed movies
    displayXFeaturedMovies(movieObject,'#featured-movies .movie-list > .row','featured-movie',startElement,numberElement); // we display the X next movies
    if( $('#featured-movies .movie-list > .row .movie-item').length >= movieObject.length ) { // if we have display all movies, we hide the button "load more"
      $('#featured-movies .more-movies').prop('disabled', true);
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

  // change movie in information section in movie shop section
  // mouseover for desktop, click for touch screens
  addEventListenerForInformationInShop('#shop-movies .movie-item');

  // load next movies in shops
  $('#shop-movies aside .shop-next-movies').on('click', function(e) {
    let start = Number( $('#shop-movies aside .btn').attr('data-start') );
    if (start + numberElementShop < movieObject.length) {
      $('#shop-movies .movie-list > .row:first-of-type').html('');
      displayXItemsMovieInShop(movieObject,'#shop-movies .movie-list > .row:first-of-type','shop-movie',(start + numberElementShop),numberElementShop);
      $('#shop-movies aside .btn').attr( 'data-start' , (start + numberElementShop) );
      checkNavigationButtonInShop(movieObject.length,numberElementShop);
      addEventListenerForInformationInShop('#shop-movies .movie-item');
    }

  });
  // load next movies in shops
  $('#shop-movies aside .shop-previous-movies').on('click', function(e) {
    let start = Number( $('#shop-movies aside .btn').attr('data-start') );
    if (start - numberElementShop >= 0) {
      $('#shop-movies .movie-list > .row:first-of-type').html('');
      displayXItemsMovieInShop(movieObject,'#shop-movies .movie-list > .row:first-of-type','shop-movie',(start - numberElementShop),numberElementShop);
      $('#shop-movies aside .btn').attr( 'data-start' , (start - numberElementShop) );
      checkNavigationButtonInShop(movieObject.length,numberElementShop);
      addEventListenerForInformationInShop('#shop-movies .movie-item');
    }

  });

}

let whenDataLoadedTvShows = function() {
  let dataText = dataRequestTvShow.responseText;
  tvShowObject = JSON.parse(dataText);

  displayXFeaturedTvShows(tvShowObject, '#featured-tvshows .tvshow-list > .row', 'featured-tvshow',0,numberElement);

  $('#featured-tvshows .less-more-movies').show();
  $('#featured-tvshows aside').show();

  addEventListenerForTrailer( '.tvshow-list .btn-trailer-modal' );
  addEventListenerForInformation( '.tvshow-list .btn-information-modal' );

  $('#featured-tvshows .more-movies').on('click', function(e) {
    startElement = $('#featured-tvshows .tvshow-list > .row .tvshow-item').length; // we check the number of alreay displayed movies
    displayXFeaturedTvShows(tvShowObject,'#featured-tvshows .tvshow-list > .row','featured-tvshow',startElement,numberElement); // we display the X next movies
    if( $('#featured-tvshows .tvshow-list > .row .tvshow-item').length >= tvShowObject.length ) { // if we have display all movies, we hide the button "load more"
      $('#featured-tvshows .more-movies').hide();
    }
    addEventListenerForTrailer( '.tvshow-list .btn-trailer-modal' ); // we had the new movies to the event listener
    addEventListenerForInformation( '.tvshow-list .btn-information-modal' ); // we had the new movies to the event listener
  });

  $('#featured-tvshows aside button').on('click', function(e) {

    if ($(this).attr('data-genre') === 'all') {
        $('#featured-tvshows .tvshow-item').show();
    } else {
      $('#featured-tvshows .tvshow-item').hide();
      $('#featured-tvshows .tvshow-item[data-genre*="' + $(this).attr('data-genre') + '"]').show();
    }

  });

};

function getFilenameForSpecificSize(imgFilename,size = 350) {
  return imgFilename.split('.')[0] + '_' + size + '.' + imgFilename.split('.')[1]; // we construct the new image name
}

function displayTopMovie(data,parent,idPrefix,numberElement) { // we display X elements in TopMovie section
  let xElements = xLastElementsAccordingSpecificKey(data,'Year',numberElement); // we select X latest elements sort by a specific key
  for(let i = 0; i < xElements.length; i++) {
    createHTMLMovieItem(xElements[i],parent,idPrefix); // we generate the HTML
  }
}

function displayXFeaturedMovies(data,parent,idPrefix,start = 0,numberElement = 6) { // function to display X new movies in Featured sections
  sortObjectbySpecificKey(data,'Title'); // we sort by 'Title'
  for(let i = start; i < (start + numberElement) && i < data.length; i++) { // we select X elements from position 'start'
    createHTMLMovieItem(data[i],parent,idPrefix); // we generate the HTML
  }
}

function displayXFeaturedTvShows(data,parent,idPrefix,start = 0,numberElement = 6) { // function to display X new movies in Featured sections
  sortObjectbySpecificKey(data,'Title'); // we sort by 'Title'
  for(let i = start; i < (start + numberElement) && i < data.length; i++) { // we select X elements from position 'start'
    createHTMLTvShowItem(data[i],parent,idPrefix); // we generate the HTML
  }
}

function displayXItemsMovieInShop(data,parent,idPrefix,start = 0, numberElement = 8) {
  sortObjectbySpecificKey(data,'Year','DESC'); // we sort by released year descending
  for(let i = start; i < (start + numberElement) && i < data.length; i++) { // we select X elements from position 'start'
    createHTMLMovieShopItem(data[i],parent,idPrefix); // we generate the HTML
  }
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

function sortObjectRamdonly(data) {
  // Fisher-Yates algorithm
  // ES6 Notation
  for (let i = data.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data;
  // Old Notation
  /*
  for (var i = data.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = data[i];
      data[i] = data[j];
      data[j] = temp;
  }
  return data;
  */
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
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + HTMLId ) );
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

function createHTMLMovieShopItem(data,parent,idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID']; // we construct the HTML id of this movie
  let HTMLContent = '<div class="col-12 col-sm-6 col-md-6 col-lg-3 card movie-item" id="' + HTMLId + '"></div>'; // we open the div, insert class and ID
  $( HTMLContent ).appendTo( $( parent ) ); // we add our HTML content to the parent
  $( '#' + HTMLId ).attr({ // we insert some data-attribute
    'data-id': data['ID']
  });
  $( '<img src="img/movies/' + getFilenameForSpecificSize(data['Poster'],350) + '" class="poster card-img-top img-fluid" title="' + data['Title'] + ' (' + data['Year'] + ')" >' ).appendTo( $( '#' + HTMLId) ); // we add the poster
  $( '<div class="card-body"></div>' ).appendTo( $( '#' + HTMLId) ); // we construct the card
  $( '<h5 class="card-title">' + data['Title'] + '</h5>' ).appendTo( $( '#' + HTMLId + ' .card-body') );
  $( '<div class="card-footer"></div>' ).appendTo( $( '#' + HTMLId ) );
  $( '<div class="row"></div>' ).appendTo( $( '#' + HTMLId + ' .card-footer') );
  $( '<div class="col-6">' + data['Year'] + '</div>' ).appendTo( $( '#' + HTMLId + ' .card-footer .row') );
  $( '<div class="col-6">' + data['Price'] + '</div>' ).appendTo( $( '#' + HTMLId + ' .card-footer .row') );
}

function createHTMLItemInformationInMovieShop(dataItem,parent) {
  $('#saved-value-preview-information').val(dataItem['ID']);
  $('<div class="row trailer-row"></div>').appendTo( $(parent) );
  $('<div class="col-12 embed-responsive embed-responsive-16by9"></div>').appendTo( $(parent + ' .trailer-row') );
  $('.trailer-row .col-12').html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/' + getYoutubeID(dataItem['Trailer']) + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
  $('<div class="row title-row"></div>').appendTo( $(parent) );
  $('<div class="col-12"></div>').appendTo( $(parent + ' .title-row') );
  $('.title-row .col-12').html('<h4>' + dataItem['Title'] + '</h4>');
  $('<div class="row summary-row"></div>').appendTo( $(parent) );
  $('<div class="col-12 col-md-4">Summary</div><div class="col-12 col-md-8"><p>' + dataItem['Summary'] + '</p></div>').appendTo( $(parent + ' .summary-row') );
  $('<div class="row release-date-row"></div>').appendTo( $(parent) );
  $('<div class="col-12 col-md-4">Released date</div><div class="col-12 col-md-8"><p>' + dataItem['Released'] + '</p></div>').appendTo( $(parent + ' .release-date-row') );
  $('<div class="row genre-row"></div>').appendTo( $(parent) );
  $('<div class="col-12 col-md-4">Genre(s)</div><div class="col-12 col-md-8"><p>' + dataItem['Genre'].join(', ') + '</p></div>').appendTo( $(parent + ' .genre-row') );
  $('<div class="row price-row"></div>').appendTo( $(parent) );
  $('<div class="col-12 col-md-4">Price</div><div class="col-12 col-md-8"><p>' + dataItem['Price'] + ' €</p></div>').appendTo( $(parent + ' .price-row') );
}

function addEventListenerForInformationInShop(selector){

  $(selector).on('click', function(e) {

    let idItem = $(this).attr('data-id');
    let idCurrentDisplayItem = Number($('#saved-value-preview-information').val());
    objectItem = movieObject.filter(function( obj ) { // we select the right object in all our data
      return (obj.ID == idItem) ? obj : false; // we return the object
    });
    if (idCurrentDisplayItem != idItem) {
      $('#shop-movies .preview-information').html('');
      createHTMLItemInformationInMovieShop( objectItem[0] , '#shop-movies .preview-information' );
    }

  });

}

function createHTMLItemTrailerModal(data,trailerParent,idData) {
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
    let objectItem;
    if (typeItem === 'movie') {
      objectItem = movieObject.filter(function( obj ) { // we select the right object in all our data
        return (obj.ID == idItem) ? obj : false; // we return the object
      });
    } else if (typeItem === 'tvShow') {
      objectItem = tvShowObject.filter(function( obj ) { // we select the right object in all our data
        return (obj.ID == idItem) ? obj : false; // we return the object
      });
    }
    if ( $('#' + typeItem + '-trailer-item-'+idItem).length == 0 ) { // we check if the trailer modal already exists or not
      createHTMLItemTrailerModal(objectItem[0], typeItem + '-trailer',idItem); // if not we create it in the right section
      $('#' + typeItem + '-trailer-item-'+idItem).modal('show'); // we show it
    } else {
      $('#' + typeItem + '-trailer-item-'+idItem).modal('show'); // if already existe we show it
    }
  });
}

function createHTMLMovieItemInformationModal(data,informationParent,idData) {
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
    let itemObject;
    if (typeItem == 'movie') {
      itemObject = movieObject.filter(function( obj ) { // we select the right object in all our data
        return (obj.ID == idItem) ? obj : false; // we return the object
      });
    } else if (typeItem == 'tvShow') {
      itemObject = tvShowObject.filter(function( obj ) { // we select the right object in all our data
        return (obj.ID == idItem) ? obj : false; // we return the object
      });
    }
    if ( $('#' + typeItem + '-information-item-'+idItem).length == 0 && typeItem == 'movie') { // we check if the information modal already exists or not
      createHTMLMovieItemInformationModal(itemObject[0], typeItem + '-information',idItem); // if not we create it in the right section
      $('#' + typeItem + '-information-item-'+idItem).modal('show'); // we show it
    } else if ($('#' + typeItem + '-information-item-'+idItem).length == 0 && typeItem == 'tvShow'){
      createHTMLTvShowItemInformationModal(itemObject[0], typeItem + '-information',idItem); // if not we create it in the right section
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
    'data-genre': data['Genre'].join(' ').toLowerCase(),
    'data-creators': data['Creators'].join(', ').toLowerCase(),
    'data-actors': data['Actors'].join(', ').toLowerCase(),
  });
  $('<img src="img/tvshows/' + getFilenameForSpecificSize(data['Poster'],350) + '" class="poster card-img-top img-fluid" title="' + data['Title'] + '(' + data['Beginning'] + '-' + data['Ending'] + ')" >').appendTo($('#' + HTMLId));
  $('<div class="card-body"></div>').appendTo($('#' + HTMLId));
  $('<h5 class="card-title">' + data['Title'] + '</h5>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<h6 class="card-subtitle">' + data['Beginning'] + '-' + data['Ending'] + '</h6>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<div class="card-text">' + data['Genre'][0] + '</div>').appendTo($('#' + HTMLId + ' .card-body'));
  $('<div class="card-footer"></div>').appendTo( $('#' + HTMLId ) );
  $('<div class="btn-group btn-group-sm" role="group" aria-label="More function"></div>').appendTo($('#' + HTMLId + ' .card-footer'));
  $('<button type="button" class="btn btn-secondary btn-information-modal"></button>').appendTo($('#' + HTMLId + ' .btn-group'));
  $( '#' + HTMLId + ' .btn-information-modal' ).attr({
    'data-id': data['ID'],
    'data-type': 'tvShow',
  });
  $( '#' + HTMLId + ' .btn-information-modal' ).html('<i class="fa fa-info"></i>');
  $('<button type="button" class="btn btn-secondary btn-trailer-modal"></button>').appendTo($('#' + HTMLId + ' .btn-group'));
  $( '#' + HTMLId + ' .btn-trailer-modal' ).attr({
    'data-trailer': data['Trailer'],
    'data-type': 'tvShow',
    'data-id': data['ID'],
  })
  $( '#' + HTMLId + ' .btn-trailer-modal' ).html('<i class="fa fa-youtube-play"></i>');
}

function createHTMLTvShowItemInformationModal(data,informationParent,idData) {
  let currentHTMLID = informationParent + '-item-' + idData;
  let HMTLModalContent = '<div class="modal fade infomation-modal" id="' + currentHTMLID + '" tabindex="-1" role="dialog" aria-labelledby="Information about ' + data['Title'] + '" aria-hidden="true"></div>';
  $( HMTLModalContent ).appendTo( $( '#' + informationParent ) ); // we add our HTML content to the parent
  $( '<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>' ).appendTo( $( '#' + currentHTMLID ) );
  $( '<div class="modal-content"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-dialog' ) );
  $( '<div class="modal-header"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-content' ) );
  $( '<h5 class="modal-title">' + data['Title'] + ' (' + data['Beginning'] + '-' + data['Ending'] + ')</h5>' ).appendTo( $( '#' + currentHTMLID + ' .modal-header' ) );
  $( '#' + currentHTMLID + ' .modal-title' ).after('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
  $( '<div class="modal-body"></div>').appendTo( $( '#' + currentHTMLID + ' .modal-content' ) );
  $( '<div class="container-fluid"></div>' ).appendTo( $( '#' + currentHTMLID + ' .modal-body' ) );
  $( '#' + currentHTMLID + ' .modal-body .container-fluid' ).html('<div class="row main-information"></div>')
  $( '<div class="col-12 col-sm-4 poster-modal"></div>' ).appendTo( $( '#' + currentHTMLID + ' .row' ) );
  $( '#' + currentHTMLID + ' .poster-modal' ).html('<img src="img/tvshows/' + data['Poster'] + '" class="img-fluid">');
  $( '#' + currentHTMLID + ' .poster-modal' ).after('<div class="col-12 col-sm-8 main-data-modal"></div>');
  $( '#' + currentHTMLID + ' .main-data-modal' ).html('<p>' + data['Summary'] + '</p>')
  $( '#' + currentHTMLID + ' .main-data-modal > p' ).after('<table class="table table-hover table-sm"></table>');
  $('<tr><td>Release date</td><td>' + data['Beginning'] + '</td></tr>').appendTo( $( '#' + currentHTMLID + ' .main-data-modal > table' ) );
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Seasons</td><td>' + data['Seasons'] + ' seasons.</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Episodes</td><td>' + data['Episodes'] + ' episodes.</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Duration</td><td>' + data['Duration'] + ' min.</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Genre</td><td>' + data['Genre'].join(', ') + '</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Director</td><td>' + data['Creators'].join(', ') + '</td></tr>');
  $( '#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type' ).after('<tr><td>Actor</td><td>' + data['Actors'].join(', ') + '</td></tr>');
}

function checkNavigationButtonInShop(dataLength,numberElement) {

  if ( Number($('#shop-movies .shop-previous-movies').attr('data-start')) == 0 ) {
    $('#shop-movies .shop-previous-movies').prop('disabled', true);
  } else {
    $('#shop-movies .shop-previous-movies').prop('disabled', false);
  }

  if ( Number($('#shop-movies .shop-next-movies').attr('data-start')) + numberElement >= dataLength ) {
    $('#shop-movies .shop-next-movies').prop('disabled', true);
  } else {
    $('#shop-movies .shop-next-movies').prop('disabled', false);
  }

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

function returnArrayWithUniqueValue(arrayItem) {
  // ES6+ function
  return Array.from(new Set(arrayItem));
}


// We mask these elements until all the data are loaded
$('#featured-movies .less-more-movies').hide();
$('#featured-movies aside').hide();

// We load the data
dataRequestMovie.onload = whenDataLoadedMovies; // we assign the function to excecute when the data are loading
dataRequestMovie.open("GET", moviesFeed, true); // the type, the url, asynchronous true/false
dataRequestMovie.send(null); // we send the request
dataRequestTvShow.onload = whenDataLoadedTvShows;
dataRequestTvShow.open("GET", tvShowsFeed, true);
dataRequestTvShow.send(null);

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

$('#cookies').click(function (e) {
  $(this).parent().removeClass('d-flex');
  $(this).parent().hide();
});

// Activation of "smooth scroll"
// Select all links with hashes
// Remove links that don't actually link to anything thanks to .not()
// based on function availble here https://css-tricks.com/snippets/jquery/smooth-scrolling/
$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on('click',function(event) {
  // On-page links
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    // Figure out element to scroll to
    let target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function() {
        // Callback after animation
        // Must change focus!
        let $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});

// Add detection on scroll action
$(window).scroll(function() {
  if ($(document).scrollTop() > 75) {
    $('#main-nav').addClass('shrink');
    $('#go-to-top').show();
  } else {
    $('#main-nav').removeClass('shrink');
    $('#go-to-top').hide();
  }
});
