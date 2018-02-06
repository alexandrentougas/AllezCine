let characters = 'https://github.com/laurenthu/AllezCine/blob/master/fan-website/database/characters.json';
let gallery = 'https://github.com/laurenthu/AllezCine/blob/master/fan-website/database/gallery.json';
let goodies = 'https://laurenthu.github.io/AllezCine/shops/database/goodies.json';
let media = 'https://laurenthu.github.io/AllezCine/shops/database/media.json';

let dataRequestCharacters = new XMLHttpRequest();
let dataRequestGallery = new XMLHttpRequest();
let dataRequestGoodies = new XMLHttpRequest();
let dataRequestMedia = new XMLHttpRequest();

let whenDataLoadedCharacters = function() {
  let dataText = dataRequestCharacters.responseText; // we store the text of the response
  charactersObject = JSON.parse(dataText);
};

let whenDataLoadedGallery = function() {
  let dataText = dataRequestGallery.responseText; // we store the text of the response
  galleryObject = JSON.parse(dataText);
};

let whenDataLoadedGoodies = function() {
  let dataText = dataRequestGoodies.responseText; // we store the text of the response
  goodiesObject = JSON.parse(dataText);
};

let whenDataLoadedMedia = function() {
  let dataText = dataRequestMedia.responseText; // we store the text of the response
  mediaObject = JSON.parse(dataText);
};

$('#nav-presentation').click(function () {
  $('#nav-media').animate({
    top: $('#nav-main').height(),
  }, 1000, function() {
    // End of animation
  });
});

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
