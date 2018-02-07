let characters = 'https://laurenthu.github.io/AllezCine/fan-website/database/characters.json';
let gallery = 'https://laurenthu.github.io/AllezCine/fan-website/database/gallery.json';
let goodies = 'https://laurenthu.github.io/AllezCine/fan-website/database/goodies.json';
let media = 'https://laurenthu.github.io/AllezCine/fan-website/database/media.json';

let dataRequestCharacters = new XMLHttpRequest();
let dataRequestGallery = new XMLHttpRequest();
let dataRequestGoodies = new XMLHttpRequest();
let dataRequestMedia = new XMLHttpRequest();

let whenDataLoadedCharacters = function() {
  let dataText = dataRequestCharacters.responseText; // we store the text of the response
  charactersObject = JSON.parse(dataText);

  displayCharacterItem(charactersObject, '#nav-biography-content .container-fluid .row', 'character');
  displayBiography(charactersObject);
};

let whenDataLoadedGallery = function() {
  let dataText = dataRequestGallery.responseText; // we store the text of the response
  galleryObject = JSON.parse(dataText);

  displayGalleryItem(galleryObject, '.image-set', 'picture');

  $('#nav-gallery-tab').on('shown.bs.tab', function(e) {
    $('#nav-gallery-content .image-set .image-set-item').each( function(index) {
      //console.log($(this).css('width'));
      $(this).css('width', $(this).css('width') );
      $(this).css('height', $(this).css('width') );
      //console.log( $(this).attr('href') );
      $(this).css({
        'background-image': 'linear-gradient(to bottom, rgba(0,0,0,.7) 0%,rgba(0,0,0,.7) 100%), url(./' + $(this).attr('href') + ')',
        'background-position': 'center center',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-clip': 'padding-box'
      });
      $(this).children('img').css('display','none');
      $(this).on('mouseover',function(e){
        $(this).css({
          'background-image': 'url(./' + $(this).attr('href') + ')',
        });
      }).on('mouseleave',function(e){
        $(this).css({
          'background-image': 'linear-gradient(to bottom, rgba(0,0,0,.7) 0%,rgba(0,0,0,.7) 100%), url(./' + $(this).attr('href') + ')',
        });
      });
    });
  });
};

let whenDataLoadedGoodies = function() {
  let dataText = dataRequestGoodies.responseText; // we store the text of the response
  goodiesObject = JSON.parse(dataText);
};

let whenDataLoadedMedia = function() {
  let dataText = dataRequestMedia.responseText; // we store the text of the response
  mediaObject = JSON.parse(dataText);

  displayMediaItem(mediaObject, '#nav-tabContent', 'media');
  displayMediaNavItem(mediaObject, '#nav-media', 'mediaNav');
  hideMediaMenuOnMediaSelection();
};

$('#nav-presentation').click(function () {
  $('#nav-media').toggleClass('active');
  if ($('#nav-media').hasClass('active') === true) {
    $('#nav-media').animate({
      top: $('#nav-main').height(),
    }, 1000, function() {
      // End of animation
    });
  } else {
    $('#nav-media').animate({
      top: 0,
    }, 1000, function() {
      // End of animation
    });
  }
});

$('.contact-icon .btn').on('click',function(e) {
  $('.general-footer').toggleClass('active');
  if($('.general-footer').hasClass('active')) {
    $('.general-footer').animate({
      top: ( $(window).height() - $('.general-footer').height() + $('#nav-main').height() - $('.contact-icon .btn').height() ) / 2,
    } ,1000, function(){});
    $('.general-footer .credits').animate({
      top: $(window).height() - $('.general-footer .credits').height(),
    },1000, function(){});
  } else {
    $('.general-footer').animate({
      top: $(window).height() - $('.contact-icon .btn').height() / 2,
    } ,1000, function(){});
    $('.general-footer .credits').animate({
      top: $(window).height(),
    },800, function(){});
  }
});
$(document).on('keydown', function(e){
  if($('.general-footer').hasClass('active') && e.key == 'Escape') {
    $('.general-footer').toggleClass('active');
    $('.general-footer').animate({
      top: $(window).height() - $('.contact-icon .btn').height() / 2,
    } ,1000, function(){});
    $('.general-footer .credits').animate({
      top: $(window).height(),
    },800, function(){});
  }
});

$('#nav-main .nav-link').not('#nav-presentation').click(function () {
  if ($('#nav-media').hasClass('active') === true) {
    $('#nav-media').removeClass('active');
    $('#nav-media').animate({
      top: 0,
    }, 1000, function() {
      // End of animation
    });
  }
});

function hideMediaMenuOnMediaSelection() {
  $('#nav-media .nav-link').click(function () {
    $('#nav-media').removeClass('active');
    $('#nav-media').animate({
      top: 0,
    }, 1000, function() {
      // End of animation
    });
  });
};

function createHTMLMediaItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLContent = '<section class="tab-pane fade media-content" id="' + HTMLId + '" role="tabpanel" aria-labelledby="mediaNav-' + data['ID'] + '"></section>';
  $(HTMLContent).appendTo($(parent));
  $('<div class="container-fluid"><div class="container"></div></div>').appendTo('#' + HTMLId);
  $('#' + HTMLId + ' .container-fluid').css('background-image', 'url(img/Backgrounds/' + data['Background'] + ')');
  $('<img src="img/Logos/' + data['Logo'] + '">').appendTo('#' + HTMLId + ' .container');
  $('<p>' + data['Presentation'] + '</p>').appendTo('#' + HTMLId + ' .container');
  $('<button type="button" class="btn btn-secondary" id="trailer-' + data['ID'] + '">Watch Trailer</button>').appendTo('#' + HTMLId + ' .container');
};

function createHTMLMediaNavItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLContent = '<a class="nav-item nav-link" data-toggle="tab" href="#media-' + data['ID'] + '" role="tab" aria-controls="#media-' + data['ID'] + '" aria-selected="false" id="' + HTMLId + '"><img src="img/Logos/' + data['Logo'] + '"></a>';
  $(HTMLContent).appendTo($(parent));
};

function createHTMLCharacterItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLContent = '<div class="col" id="' + HTMLId + '"></div>';
  $(HTMLContent).appendTo($(parent));
  $('<h2>' + data['Name'] + '</h2>').appendTo('#' + HTMLId);
  $('<img src="img/Characters/' + data['Picture'] + '" alt ="' + data['Name'] + '" class="img-fluid">').appendTo('#' + HTMLId);
  //$('#' + HTMLId).css('background-image', 'url(img/Characters/' + data['Picture'] + ')');
};

function createHTMLGalleryItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID'];
  let HTMLContent = '<a href="img/Gallery/' + data['Picture'] + '" data-lightbox="FFGallery" data-title="' + data['Alt'] + '" class="image-set-item col-3" id="' + HTMLId + '"></a><';
  $(HTMLContent).appendTo($(parent));
  $('<img src="img/Gallery/' + data['Picture'] + '" alt="' + data['Alt'] + '" class="">').appendTo('#' + HTMLId);
};

function displayMediaItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLMediaItem(data[i], parent, idPrefix);
  };
};

function displayMediaNavItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLMediaNavItem(data[i], parent, idPrefix);
  };
};

function displayCharacterItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLCharacterItem(data[i], parent, idPrefix);
  };
};

function displayBiography(data) {
  $('#nav-biography-content .container-fluid .row .col').each( function (index) {
    $(this).click(function () {
      $('#character-name').text(data[index]['Name']);
      $('#character-bio').text(data[index]['Biography']);
    });
  });
};

function displayGalleryItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLGalleryItem(data[i], parent, idPrefix);
  };
};

/*** DATA LOADED ***/

dataRequestCharacters.onload = whenDataLoadedCharacters;
dataRequestCharacters.open("GET", characters, true);
dataRequestCharacters.send(null);

dataRequestGallery.onload = whenDataLoadedGallery;
dataRequestGallery.open("GET", gallery, true);
dataRequestGallery.send(null);

dataRequestGoodies.onload = whenDataLoadedGoodies;
dataRequestGoodies.open("GET", goodies, true);
dataRequestGoodies.send(null);

dataRequestMedia.onload = whenDataLoadedMedia;
dataRequestMedia.open("GET", media, true);
dataRequestMedia.send(null);

/*** jQuery Plugin ***/

/* Lightbox */
lightbox.option({
  'wrapAround': true,
  'showImageNumberLabel': false,
  'disableScrolling': true
});

/*** Application ***/
