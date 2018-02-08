let goodies = 'https://laurenthu.github.io/AllezCine/fan-website/database/goodies.json';

let cartObject = [];

let dataRequestGoodies = new XMLHttpRequest();

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

function displayGoodieItem(data, parent, idPrefix) {
  for (i = 0; i < data.length; i++) {
    createHTMLGoodieItem(data[i], parent, idPrefix);
  }
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
  let currentHTMLID = informationParent + '-item';
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
    createHTMLGoodieItemInformationModal(itemObject[0], 'goodie-information', idItem); // if not we create it in the right section
    $('#goodie-information-item').modal('show'); // we show it
    $('#goodie-information-item').on('hidden.bs.modal', function(e) {
      $('#goodie-information-item').remove();
    })
    addEventListenerForAddToCart(goodiesObject,cartObject);
  });
};

function addEventListenerForAddToCart(dataDB, dataCart) { // data = goodiesObject
  $('.addCart').on('click', function(e) {

    let idItem = Number($(this).attr('data-id'));
    let indexOf;
    let newQuantity = Number($('#quantity-' + idItem).val());
    let alreadyIn = [];

    for (let i = 0; i < dataCart.length; i++) {
      alreadyIn.push(dataCart[i]['ID']);
    }

    console.log(alreadyIn);

    if (alreadyIn.length == 0) { // if first add

      dataCart.push({
        'ID': dataDB[idItem - 1]['ID'],
        'Picture': dataDB[idItem - 1]['Picture'],
        'Name': dataDB[idItem - 1]['Name'],
        'Quantity': newQuantity,
        'Price': dataDB[idItem - 1]['Price']
      });

    } else {

      if ( alreadyIn.includes(idItem) ) { // if there are already itms in cart and the goodies is already in

        for(let key in dataCart) { // we loop cart

          if(dataCart[key]['ID'] == idItem) { // we search position of the goodies in the object
            dataCart[key]['Quantity'] += newQuantity; // we update the quanity
          }
        }

      } else { // if the cart is not empty and the current goodies is not yet inside

        dataCart.push({
          'ID': dataDB[idItem - 1]['ID'],
          'Picture': dataDB[idItem - 1]['Picture'],
          'Name': dataDB[idItem - 1]['Name'],
          'Quantity': newQuantity,
          'Price': dataDB[idItem - 1]['Price']
        });

      }
    }
    console.log(dataCart);

    $('#goodie-information-item').modal('hide'); // we close the modal

    $('#cart-button .badge').text(cartObject.length).fadeIn(); // we update the badge information
    if ($('#cart-button .badge').text() == 0) { // if cart is empty we hide the badge
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
      $('<td class="option"><button class="btn btn-dark remove-from-cart" data-id="' + data[i]['ID'] + '"><i class="fa fa-minus"></i></button></td>').appendTo(parent + ' tbody' + ' #product-id-' + data[i]['ID']);
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


dataRequestGoodies.onload = whenDataLoadedGoodies;
dataRequestGoodies.open("GET", goodies, true);
dataRequestGoodies.send(null);
