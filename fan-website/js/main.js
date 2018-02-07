let characters = 'https://laurenthu.github.io/AllezCine/fan-website/database/characters.json';
let gallery = 'https://laurenthu.github.io/AllezCine/fan-website/database/gallery.json';
let goodies = 'https://laurenthu.github.io/AllezCine/fan-website/database/goodies.json';
let media = 'https://laurenthu.github.io/AllezCine/fan-website/database/media.json';

let cartObject = [];

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

  $('#nav-gallery-tab').on('show.bs.tab', function(e) {
    $('.image-set').html('');
    displayGalleryItem(galleryObject, '.image-set', 'picture');
  });

  $('#nav-gallery-tab').on('shown.bs.tab', function(e) {
    $('#nav-gallery-content .image-set .image-set-item').each(function(index) {
      //console.log($(this).css('width'));
      $(this).css('width', $(this).css('width'));
      $(this).css('height', $(this).css('width'));
      //console.log( $(this).attr('href') );
      $(this).css({
        'background-image': 'linear-gradient(to bottom, rgba(0,0,0,.5) 0%,rgba(0,0,0,.5) 100%), url(./' + $(this).attr('href') + ')',
        'background-position': 'center center',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-clip': 'padding-box'
      });
      $(this).children('img').css('display', 'none');
      $(this).on('mouseover', function(e) {
        $(this).css({
          'background-image': 'url(./' + $(this).attr('href') + ')',
        });
      }).on('mouseleave', function(e) {
        $(this).css({
          'background-image': 'linear-gradient(to bottom, rgba(0,0,0,.5) 0%,rgba(0,0,0,.5) 100%), url(./' + $(this).attr('href') + ')',
        });
      });
    });
  });
};

let whenDataLoadedGoodies = function() {
  let dataText = dataRequestGoodies.responseText; // we store the text of the response
  goodiesObject = JSON.parse(dataText);

  $('#nav-goodies-tab').on('show.bs.tab', function(e) {
    $('#nav-goodies-content .container .goodie-list').html('');
    displayGoodieItem(goodiesObject, '#nav-goodies-content .container .goodie-list', 'goodie');
    addEventListenerForInformation('#nav-goodies-content .goodie-item');
    $('#cartModal').on('show.bs.modal', function(e) {
      $('#cartModal .modal-body').html('');
      displayCart(cartObject, '#cartModal .modal-body');
      addEventListenerForRemovingFromCart();
    });
  });
};

let whenDataLoadedMedia = function() {
  let dataText = dataRequestMedia.responseText; // we store the text of the response
  mediaObject = JSON.parse(dataText);

  displayMediaItem(mediaObject, '#nav-tabContent', 'media');
  displayMediaNavItem(mediaObject, '#nav-media', 'mediaNav');
  hideMediaMenuOnMediaSelection();
};

$('#nav-presentation').click(function() {
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

$('.contact-icon .btn').on('click', function(e) {
  $('.general-footer').toggleClass('active');
  if ($('.general-footer').hasClass('active')) {
    $('.general-footer').animate({
      top: ($(window).height() - $('.general-footer').height() + $('#nav-main').height() - $('.contact-icon .btn').height()) / 2,
    }, 1000, function() {});
    $('.general-footer .credits').animate({
      top: $(window).height() - $('.general-footer .credits').height(),
    }, 1000, function() {});
  } else {
    $('.general-footer').animate({
      top: $(window).height() - $('.contact-icon .btn').height() / 2,
    }, 1000, function() {});
    $('.general-footer .credits').animate({
      top: $(window).height(),
    }, 800, function() {});
  }
});
$(document).on('keydown', function(e) {
  if ($('.general-footer').hasClass('active') && e.key == 'Escape') {
    $('.general-footer').toggleClass('active');
    $('.general-footer').animate({
      top: $(window).height() - $('.contact-icon .btn').height() / 2,
    }, 1000, function() {});
    $('.general-footer .credits').animate({
      top: $(window).height(),
    }, 800, function() {});
  }
});

$('#nav-main .nav-link').not('#nav-presentation').click(function() {
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
  $('#nav-media .nav-link').click(function() {
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

function createHTMLGoodieItem(data, parent, idPrefix) {
  let HTMLId = idPrefix + '-' + data['ID']; // we construct the HTML id of this goodie
  let HTMLContent = '<div class="col-12 col-sm-6 col-md-4 col-lg-3 card goodie-item" id="' + HTMLId + '"><div class="content"></div></div>'; // we open the div, insert class and ID
  $(HTMLContent).appendTo($(parent)); // we add our HTML content to the parent
  $('#' + HTMLId).attr({ // we insert some data-attribute
    'data-id': data['ID'],
    'data-type': data['Type'].toLowerCase(),
  });
  $('<img src="img/Goodies/' + data['Picture'] + '" class="goodie-image card-img-top img-fluid" alt="' + data['Name'] + ' (' + data['Type'] + ')" >').appendTo($('#' + HTMLId + ' .content')); // we add the picture
  $('<div class="card-footer"></div>').appendTo($('#' + HTMLId + ' .content'));
  $('<h5 class="card-title">' + data['Name'] + '</h5>').appendTo($('#' + HTMLId + ' .card-footer'));
  $('<div class="card-subtitle"></div>').appendTo($('#' + HTMLId + ' .card-footer'));
  $('<div class="card-subtitle-item">' + data['Type'] + '</div><div class="card-subtitle-item">' + data['Price'] + ' €</div>').appendTo($('#' + HTMLId + ' .card-subtitle'));
};

function createHTMLGoodieItemInformationModal(data, informationParent, idData) {
  let currentHTMLID = informationParent + '-item-' + idData;
  let HMTLModalContent = '<div class="modal fade information-modal" id="' + currentHTMLID + '" tabindex="-1" role="dialog" aria-labelledby="Information about ' + data['Name'] + '" aria-hidden="true"></div>';
  $(HMTLModalContent).appendTo($('#' + informationParent)); // we add our HTML content to the parent
  $('<div class="modal-dialog modal-dialog-centered modal-lg" role="document"></div>').appendTo($('#' + currentHTMLID));
  $('<div class="modal-content"></div>').appendTo($('#' + currentHTMLID + ' .modal-dialog'));
  $('<div class="modal-header"></div>').appendTo($('#' + currentHTMLID + ' .modal-content'));
  $('<h5 class="modal-title">' + data['Name'] + ')</h5>').appendTo($('#' + currentHTMLID + ' .modal-header'));
  $('#' + currentHTMLID + ' .modal-title').after('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
  $('<div class="modal-body"></div>').appendTo($('#' + currentHTMLID + ' .modal-content'));
  $('<div class="container-fluid"></div>').appendTo($('#' + currentHTMLID + ' .modal-body'));
  $('#' + currentHTMLID + ' .modal-body .container-fluid').html('<div class="row main-information"></div>')
  $('<div class="col-12 col-sm-4 poster-modal"></div>').appendTo($('#' + currentHTMLID + ' .row'));
  $('#' + currentHTMLID + ' .poster-modal').html('<img src="img/Goodies/' + data['Picture'] + '" class="img-fluid">');
  $('#' + currentHTMLID + ' .poster-modal').after('<div class="col-12 col-sm-8 main-data-modal"></div>');
  $('#' + currentHTMLID + ' .main-data-modal').html('<table class="table table-hover table-sm"></table>');
  $('<tr><td>Type</td><td>' + data['Type'] + '</td></tr>').appendTo($('#' + currentHTMLID + ' .main-data-modal > table'));
  if (data['Type'] === 'Figure') {
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Height</td><td>' + data['Height'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Width</td><td>' + data['Width'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Depth</td><td>' + data['Depth'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Weight</td><td>' + data['Weight'] + ' gr</td></tr>');
  } else if (data['Type'] === 'Accessory' && data['Subtype'] === 'Ring') {
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Height</td><td>' + data['Height'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Width</td><td>' + data['Width'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Depth</td><td>' + data['Depth'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Size</td><td>' + data['Size'] + '</td></tr>');
  } else if (data['Type'] === 'Accessory') {
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Height</td><td>' + data['Height'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Width</td><td>' + data['Width'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Depth</td><td>' + data['Depth'] + ' mm</td></tr>');
    $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr><td>Length</td><td>' + data['Length'] + ' mm</td></tr>');
  };
  $('#' + currentHTMLID + ' .main-data-modal > table tr:last-of-type').after('<tr class="price"><td>Price</td><td>' + data['Price'] + ' €</td></tr>');
  $('#' + currentHTMLID + ' .main-data-modal').after('<p>' + nl2br(data['Description']) + '</p>');
  $('<div class="modal-footer"></div>').appendTo($('#' + currentHTMLID + ' .modal-content'));
  $('<div class="container-fluid"></div>').appendTo($('#' + currentHTMLID + ' .modal-footer'));
  $('#' + currentHTMLID + ' .modal-footer .container-fluid').html('<input type="number" class="form-control" value="1" min="1" id="quantity-' + data['ID'] + '"></input><button type="button" class="btn btn-light addCart" data-id="' + data['ID'] + '" id="addCart-' + data['ID'] + '"><span class="sr-only">Add to cart</span><i class="fa fa-cart-plus"</button>');
};

function addEventListenerForInformation(selector) { // we had the click on information button to the event listener
  $(selector).on('click', function(e) { // we select the buttons
    let idItem = Number($(this).attr('data-id')); // we save the ID goodie thanks to the data-id attribute
    let itemObject = goodiesObject.filter(function(obj) { // we select the right object in all our data
      return (obj.ID == idItem) ? obj : false; // we return the object
    });
    if ($('#' + 'goodie-information-item-' + idItem).length == 0) { // we check if the information modal already exists or not
      createHTMLGoodieItemInformationModal(itemObject[0], 'goodie-information', idItem); // if not we create it in the right section
      $('#' + 'goodie-information-item-' + idItem).modal('show'); // we show it
      addEventListenerForAddToCart(goodiesObject);
    } else {
      $('#' + 'goodie-information-item-' + idItem).modal('show'); // if already existe we show it
    }
  });
};

function addEventListenerForAddToCart(data) {
  $('.addCart').on('click', function(e) {
    let idItem = $(this).attr('data-id');
    let alreadyIn = false;
    for (let key in cartObject) { // we loop our object
      if (cartObject[key]['ID'] == data[idItem - 1]['ID']) { // if the value is not false
        cartObject[key]['Quantity'] = cartObject[key]['Quantity'] + Number($('#quantity-' + idItem).val());
        alreadyIn = true;
      };
    };
    if (!alreadyIn) {
      cartObject.push({
        'ID': data[idItem - 1]['ID'],
        'Picture': data[idItem - 1]['Picture'],
        'Name': data[idItem - 1]['Name'],
        'Quantity': Number($('#quantity-' + idItem).val()),
        'Price': data[idItem - 1]['Price']
      });
    };
    $('#goodie-information-item-' + idItem).modal('hide');
    $('#cart-button .badge').text(cartObject.length).fadeIn();
    if ($('#cart-button .badge').text() == 0) {
      $('#cart-button .badge').fadeOut();
    };
  });
};

function displayCart(data, parent) {
  if (data.length == 0) {
    $('<div class="empty-message"><img src="img/Logos/chocoMog.png" class="img-fluid" alt="Choco Mog"><p>Hey ! You didn\'t put anything in your cart yet !</p></div>').appendTo($(parent));
    $(parent).parent().find('.checkout').hide();
  } else {
    $(parent).parent().find('.checkout').show();
    let grandTotal = 0;
    let HTMLContent = '<table class="table"><thead class="thead-dark"><tr><th class="product" scope="col">Product</th><th class="name" scope="col">Name</th><th class="quantity" scope="col">Quantity</th><th class="price" scope="col">Price</th><th class="subtotal" scope="col">Total</th><th class="option"></th></tr></thead><tbody></tbody><tfoot><tr><td class="total-text" colspan="4">Total</td><td class="total" id="grandTotal"></td><td></td></tr></tfoot></table>';
    $(HTMLContent).appendTo(parent);
    for (i = 0; i < data.length; i++) {
      $('<tr id="product-id-' + data[i]['ID'] + '"></tr>').appendTo(parent + ' tbody');
      $('<td class="product"><img class="img-fluid" src="img/Goodies/' + data[i]['Picture'] + '"></td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      $('<td class="name">' + data[i]['Name'] + '</td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      $('<td class="quantity">' + data[i]['Quantity'] + '</td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      $('<td class="price">' + data[i]['Price'] + ' €</td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      $('<td class="subtotal">' + Math.round(data[i]['Quantity'] * data[i]['Price'] * 100) / 100 + ' €</td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      $('<td class="option"><button class="btn btn-dark" data-id="' + data[i]['ID'] + '" class="remove-from-cart"><i class="fa fa-minus"></i></button></td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
      //$('<tr><td class="product"><img class="img-fluid" src="img/Goodies/' + data[i]['Picture'] + '"></td><td class="name">' + data[i]['Name'] + '</td><td class="quantity">' + data[i]['Quantity'] + '</td><td class="price">' + data[i]['Price'] + ' €</td><td class="subtotal">' + Math.round(data[i]['Quantity'] * data[i]['Price'] * 100) / 100 + ' €</td><td class="option"><button class="btn btn-dark" data-id="' + data[i]['ID'] + '" class="remove-from-cart"><i class="fa fa-minus"></i></button></td></tr>').appendTo(parent + ' tbody');
      ;
      grandTotal += (data[i]['Quantity'] * data[i]['Price']);
    };
    $('#grandTotal').text(Math.round(grandTotal * 100) / 100 + ' €');
  };
};

function addEventListenerForRemovingFromCart() {
  $('.remove-from-cart').on('click', function(e) {
    let idItem = $(this).attr('data-id');
    for (let key in cartObject) { // we loop our object
      if (cartObject[key]['ID'] == idItem) { // if the value is not false
        cartObject.splice(key, 1);
        $('#cartModal .modal-body').html('');
        displayCart(cartObject, '#cartModal .modal-body');
        addEventListenerForRemovingFromCart();
        $('#cart-button .badge').text(cartObject.length).fadeIn();
        if ($('#cart-button .badge').text() == 0) {
          $('#cart-button .badge').fadeOut();
        };
      };
    };
  });
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
  $('#nav-biography-content .container-fluid .row .col').each(function(index) {
    $(this).click(function() {
      $('#character-name').text(data[index]['Name']);
      $('#character-bio').text(data[index]['Biography']);
      $('#nav-biography-content .container-fluid .row .col').fadeOut();
      $(this).fadeIn();
      $('#biography').fadeIn();
    });
  });
};

function displayGalleryItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLGalleryItem(data[i], parent, idPrefix);
  };
};

function displayGoodieItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLGoodieItem(data[i], parent, idPrefix);
  }
};

function nl2br(str) {
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
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

/* jValidate */
$("#contact-form-tag").validate({
  errorClass: 'text-danger',
  validClass: 'text-success',
  submitHandler: function(form) {
    // do other things for a valid form
    alert('Message sent!');
  }
});
