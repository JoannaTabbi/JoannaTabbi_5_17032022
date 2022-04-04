import * as index from "./index";

let cartItems = index.getCart();
let cartItemsHtml = "";
let totalProductPrice = 0;
let totalProductQuantity = 0;

cartItems.forEach((cartItem) => {
  const productId = cartItem._id;
  console.log(productId);

  //gets the product information frop API

  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((product) => {

      // reconstructs cart product with name, image and price from API

      let productFromCart = {
        _id: product._id,
        name: product.name,
        color: cartItem.color,
        imageUrl: product.imageUrl,
        altTxt: product.altTxt,
        price: product.price,
        quantity: cartItem.quantity,
        totalPrice: function () {
          let x = this.quantity * this.price;
          return x;
        },
      };
console.log(productFromCart);
       
document.getElementById("cart__items").innerHTML = 
        cartItemsHtml += ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
          <div class="cart__item__img">
            <img src="${productFromCart.imageUrl}" alt="${productFromCart.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${productFromCart.name}</h2>
              <p>${productFromCart.color}</p>
              <p>${productFromCart.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productFromCart.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

      // displays total quantity and total price

      document.getElementById("totalQuantity").innerText =
        totalProductQuantity += productFromCart.quantity;
      document.getElementById("totalPrice").innerText = totalProductPrice +=
        productFromCart.totalPrice();
      
    })

    .catch((err) => {
      const items = document.getElementById("cart__items");
      items.innerHTML = `Une erreur est survenue: ${err}`;
    });
});
/*
let totalQuantity = () => {
  let cart = getCart();
  let cartProductQuantity = 0;
  for (let product of cart) {
    cartProductQuantity += product.quantity;
  }
  return cartProductQuantity;
};
document.getElementById("totalQuantity").innerText = totalQuantity();

// display total product price

let totalPrice = () => {
  let cart = getCart();
  let cartProductPrice = 0;
  for (let product of cart) {
    cartProductPrice += product.quantity * product.price;
  }
  return cartProductPrice;
};
document.getElementById("totalPrice").innerText = totalPrice(); */
