import * as index from "./index.js";

// defines variables

const cartItems = index.getCart();
let cartItemsHtml = "";
let totalProductPrice = 0;
let totalProductQuantity = 0;

cartItems.forEach((cartItem) => {
  const productId = cartItem._id;

  //gets the product information from API

  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((product) => {
      document.getElementById("cart__items").innerHTML = CartDetails(
        product,
        cartItem
      );
      document.getElementById("totalQuantity").innerText =
        totalQuantity(cartItem);
      document.getElementById("totalPrice").innerText = totalPrice(
        product,
        cartItem
      );
    })

    .catch((err) => {
      const items = document.getElementById("cart__items");
      items.innerHTML = `Une erreur est survenue: ${err}`;
    });
});

// displays the details of each cart item

let CartDetails = (apiData, cartData) => {
  cartItemsHtml += `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
    <div class="cart__item__img">
      <img src="${apiData.imageUrl}" alt="${apiData.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${apiData.name}</h2>
        <p>${cartData.color}</p>
        <p>${apiData.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartData.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
  return cartItemsHtml;
};

// displays total quantity

const totalQuantity = (cartData) => {
  totalProductQuantity += cartData.quantity;
  return totalProductQuantity;
};

// display total product price

const totalPrice = (apiData, cartData) => {
  totalProductPrice += apiData.price * cartData.quantity;
  return totalProductPrice;
};