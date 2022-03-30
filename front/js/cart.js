// get cart content

let getCart = () => {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};
console.log(getCart());

// display cart content

let cartItemsHtml = "";
let products = getCart();
products.forEach((product) => {
  cartItemsHtml += ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.colors}</p>
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
});

document.getElementById("cart__items").innerHTML = cartItemsHtml;

//display total product quantity

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
document.getElementById("totalPrice").innerText = totalPrice();
