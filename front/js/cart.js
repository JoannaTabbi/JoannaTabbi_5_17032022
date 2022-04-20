import * as index from "./index.js";

// defines variables

let cartItems = index.getCart();
let cartItemsHtml = "";
const cartItemsElement = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

cartItems.forEach((cartItem) => {
  //gets the product information from API

  fetch(`http://localhost:3000/api/products/${cartItem._id}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((product) => {
      cartItemsElement.innerHTML = cartDetails(product, cartItem);
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

const totalQuantity = () => {
  let qty = 0;
  cartItems.forEach((cartItem) => {
    qty += cartItem.quantity;
  });
  totalQuantityElement.innerText = qty;
};
totalQuantity();

// displays total product price

const totalPrice = () => {
  let total = 0;
  cartItems.forEach((cartItem) => {
    fetch(`http://localhost:3000/api/products/${cartItem._id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((product) => {
        total += cartItem.quantity * product.price;
        totalPriceElement.innerText = total;
      })
      .catch((err) => {
        cartItemsElement.innerHTML = `Une erreur est survenue: ${err}`;
      });
  });
};
totalPrice();

// removes the cart item from the cart and from the page

const deleteFromCart = () => {
  const deleteItemButtons = document.querySelectorAll(".deleteItem");
  deleteItemButtons.forEach((deleteItemButton) => {
    deleteItemButton.addEventListener("click", (event) => {
      event.preventDefault();
      const productToRemove = deleteItemButton.closest(".cart__item");
      removeItem(productToRemove.dataset.id, productToRemove.dataset.color);
      location.reload();
    });
  });
};

// updates the cart content after deleting an item

const removeItem = (id, color) => {
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
        totalQuantity();
        totalPrice();
      }
    });
  });
};

// **************** form validation ******************

const form = document.querySelector(".cart__order__form");

// defines the reg exp rules for inputs

let nameCityRegExp = /^[A-ZÀ-ß]{1}[\wÀ-ú'-\s]*$/g;
let addressRegExp = /^[\wÀ-ú',-\s]*$/g;
let emailRegExp = /^[\w.-]+[@]{1}[\w.-]+[.]{1}[a-z]{2,10}$/g;

//listens to the input change, validates client's input

const validInput = (input, regex) => {
  input.addEventListener("change", (e) => {
    e.preventDefault();
    let testRegex = regex.test(input.value);
    let errorMessage = input.nextElementSibling;
    console.log(regex, input.value, testRegex);
    if (!testRegex) {
        errorMessage.innerHTML = "Saisie incorrecte";   
    } else {
        errorMessage.innerHTML = ""; 
    }
  });
};
validInput(form.firstName, nameCityRegExp);
validInput(form.lastName, nameCityRegExp);
validInput(form.address, addressRegExp);
validInput(form.city, nameCityRegExp);
validInput(form.email, emailRegExp);