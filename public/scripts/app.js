

// on order submit pushing cart items, name and phone # to /checkout post req
$(document).ready(function(){
  $('.twilio-frm').on('submit', event => {
    event.preventDefault();
    let data = $('.twilio-frm').serializeArray();
    data.push({name: 'cartItems', value: localStorage.getItem('foodCart')});
    $.ajax({
      data: $.param(data),// add items in cart, name, and phonenumber
      url: "/checkout",
      type: "post",
    })
    .done(function (){
      localStorage.removeItem('foodCart');
    })
  });
  
  $('.close-btn').on('click', event => {
    window.location.href = "/";
  })
//adds count of items added to cart
//when you click checkout make sure to clear localStorage
// ok

let dbItems;


if (!localStorage.getItem('foodCart')) {
  localStorage.setItem('foodCart', JSON.stringify([]))
}

$('.counter').text(JSON.parse(localStorage.getItem('foodCart')).length)

const itemsData = () => $.ajax({
	type: 'GET',
	url: '/api/items',
	dataType: 'json'
}).done(function (data) {
  dbItems = data;
  // console.log(dbItems);
  renderMenuItems(data);
})

itemsData();

//helper for renderMenuItems
const createItemElement = (item) => {
  return `
  <div class="card">
    <img class="card-img-top" src="${item.image_url}" alt="Card image cap">
    <div class="card-body">
      <h5 class="">${item.name}</h5>
      <p class="prices">$${(item.price/100).toFixed(2)}</p>
      <button id="${item.id}" class="btn btn-primary btn-lg add-cart" type="submit">Add to Cart</button>
    </div>
  </div>
  `
}


//to show items from database and sort in rows
const renderMenuItems = (items) => {
  let i = 0;
  for (item of items ) {
    let $items = createItemElement(item);
    let idTag = `#${item.id}`

    if (i < 4) {
      $('.card-row1').append($items);
    }else {
      $('.card-row2').append($items);
    }
    i++;

    //items added to cart sent to local storage
    $(idTag).on('click', function(data) {
      let id = data.target.id;
      let temp = dbItems.find(function(e){
        if (e.id == id) {
          return e;
        }
      })
    //pushes items to hidden form field
    let cartForm = JSON.parse(localStorage.getItem('foodCart'));
    cartForm.push(temp);
    console.log('food cart: ', cartForm);
    var fd = new FormData(document.getElementById("orderArr"));
    for (var i = 0; i < cartForm.length; i++) {
    fd.append('cartForm[]', cartForm[i]);
  }
    //pushes items to cart
    let cart = JSON.parse(localStorage.getItem('foodCart'));
    cart.push(temp);
    localStorage.setItem('foodCart', JSON.stringify(cart))
    $('.counter').text(cart.length);
    })
  }
}


//helper for cartItemElements
const cartItemElements = (items) => {
  return ` <div class='row'>
            <div class='item-content'>
              <p class='item-name'>${items.name}</p>
              <p class='item-price'>$${(items.price/100).toFixed(2)}</p>
            </div>
            <div>
              <i class="fas fa-times"></i>
            </div>
          </div>`
}

//to render only item price and name
const cartItems = () => {
  let fullCart = localStorage.getItem('foodCart');
  let parsedItems = JSON.parse(fullCart);

 for(items of parsedItems) {
    let $cartItem = cartItemElements(items);
      $('.checkout-row').append($cartItem);
    }
  }
  
cartItems();
});













