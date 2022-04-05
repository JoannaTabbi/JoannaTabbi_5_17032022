import * as index from "./index.js";

// defines variables

const cartItems = index.getCart();
let cartItemsHtml = "";
let totalProductPrice = 0;
let totalProductQuantity = 0;

cartItems.forEach((cartItem) => {
  const productId = cartItem._id;
  console.log(productId);

  //gets the product information from API

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

      CartDetails(productFromCart);
      totalQuantity(productFromCart);
      totalPrice(productFromCart);
    })

    .catch((err) => {
      const items = document.getElementById("cart__items");
      items.innerHTML = `Une erreur est survenue: ${err}`;
    });
});

// displays the details of each cart item

let CartDetails = (product) => {
  const itemCard = ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${product.color}</p>
        <p>${product.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;

  cartItemsHtml += itemCard;

  document.getElementById("cart__items").innerHTML = cartItemsHtml;
};

// displays total quantity

let totalQuantity = (product) => {
  document.getElementById("totalQuantity").innerText = totalProductQuantity +=
    product.quantity;
};

// display total product price

let totalPrice = (product) => {
  document.getElementById("totalPrice").innerText = totalProductPrice +=
    product.totalPrice();
};
