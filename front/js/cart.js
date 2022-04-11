import * as index from "./index.js";

// defines variables

let cartItems = index.getCart();
let cartItemsHtml = "";
let totalProductPrice = 0;
let totalProductQuantity = 0;
const cartItemsElement = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

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
      cartItemsElement.innerHTML = cartDetails(product, cartItem);
      totalQuantityElement.innerText = totalQuantity(cartItem);
      totalPriceElement.innerText = totalPrice(product, cartItem);
      deleteFromCart();
      updateQuantity();
    })

    .catch((err) => {
      cartItemsElement.innerHTML = `Une erreur est survenue: ${err}`;
    });
});

// displays the details of each cart item

const cartDetails = (apiData, cartData) => {
  cartItemsHtml += `<article class="cart__item" data-id="${cartData._id}" data-color="${cartData.color}">
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

// displays total product price

const totalPrice = (apiData, cartData) => {
  totalProductPrice += apiData.price * cartData.quantity;
  return totalProductPrice;
};

// removes the cart item from the cart and from the page

const deleteFromCart = () => {
  const deleteItemButtons = document.querySelectorAll(".deleteItem");
  deleteItemButtons.forEach((deleteItemButton) => {
    deleteItemButton.addEventListener("click", (event) => {
      event.preventDefault();
      const productToRemove = deleteItemButton.closest(".cart__item");
      itemsLeft(productToRemove.dataset.id, productToRemove.dataset.color);
      location.reload();
    });
  });
};

// updates the cart content after deleting an item

const itemsLeft = (id, color) => {
  let productFound = cartItems.find((p) => p._id == id && p.color == color);
  if (productFound) {
    cartItems = cartItems.filter((p) => p !== productFound);
    return index.setCart(cartItems);
  }
};

// updates the quantity of products in the cart

const updateQuantity = () => {
  const updateQuantityInputs = document.querySelectorAll(".itemQuantity");
  updateQuantityInputs.forEach((updateQuantityInput) => {
    updateQuantityInput.addEventListener("change", (e) => {
      e.preventDefault();
      const quantityToChange = updateQuantityInput.closest(".cart__item");
      let productFound = cartItems.find(
        (p) =>
          p._id == quantityToChange.dataset.id &&
          p.color == quantityToChange.dataset.color
      );
      if (productFound) {
        productFound.quantity = Number(updateQuantityInput.value);
        index.setCart(cartItems);
      }
    });
  });
};
