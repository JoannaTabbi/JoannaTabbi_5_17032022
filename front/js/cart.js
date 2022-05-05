import * as index from "./index.js";

// defines variables

let cartItems = index.getCart();
let cartItemsHtml = "";
const cartItemsElement = document.getElementById("cart__items");
const totalQuantityElement = document.getElementById("totalQuantity");
const totalPriceElement = document.getElementById("totalPrice");

//gets the product information from API for the items stocked in the cart

let getProductFromAPI = () => {
  cartItems.forEach((cartItem) => {
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
};

// if the cart is empty, displays a message and redirects the user to the homepage;

if (cartItems == "") {
  cartItemsElement.innerText =
    "Votre panier est vide. Rendez-vous sur la page d'accueil de notre site et faites votre choix parmi nos modèles KANAP disponibles.";
  document.getElementsByClassName("cart__price")[0].remove();
  document.getElementsByClassName("cart__order")[0].remove();
} else {
  getProductFromAPI();
}

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

// calculates total quantity of products

const totalQuantity = () => {
  let qty = 0;
  cartItems.forEach((cartItem) => {
    qty += cartItem.quantity;
  });
  totalQuantityElement.innerText = qty;
};
totalQuantity();

// calculates total product price

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

let nameCityRegExp = new RegExp("^[A-Za-zÀ-ú'-\\s]{2,}$", "g");
let addressRegExp = new RegExp("^[\\wÀ-ú'-\\s]{2,}$", "g");
let emailRegExp = new RegExp("^[\\w.-]+[@]{1}[\\w.-]+[.]{1}[a-z]{2,10}$", "g");

// checks if client's input matches the regex

const validInput = (input, regex, message) => {
  let testRegex = new RegExp(regex).test(input.value);
  let errorMessage = input.nextElementSibling;
  if (!testRegex) {
    errorMessage.innerHTML = message;
    return false;
  } else {
    errorMessage.innerHTML = "";
    return true;
  }
};

// validates input on change, displays a personalized error message if the input is incorrect

const validInputOnChange = (input, regex, message) => {
  input.addEventListener("change", (e) => {
    e.preventDefault();
    validInput(input, regex, message);
  });
};

const nameCityErrorMessage =
  "Votre saisie doit contenir au moins deux caractères, dont lettres, tirets, espaces ou apostrophes.";
const addressErrorMessage =
  "Votre saisie doit contenir au moins deux caractères alphanumériques. Les tirets, espaces et apostrophes sont acceptés.";
const emailErrorMessage =
  "Votre adresse email doit avoir un format valide, ex.: abc@domaine.com";

validInputOnChange(form.firstName, nameCityRegExp, nameCityErrorMessage);
validInputOnChange(form.lastName, nameCityRegExp, nameCityErrorMessage);
validInputOnChange(form.address, addressRegExp, addressErrorMessage);
validInputOnChange(form.city, nameCityRegExp, nameCityErrorMessage);
validInputOnChange(form.email, emailRegExp, emailErrorMessage);

// **************** form submit *******************

// submits form only if all the inputs are correctly fulfilled

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    validInput(form.firstName, nameCityRegExp, nameCityErrorMessage) &&
    validInput(form.lastName, nameCityRegExp, nameCityErrorMessage) &&
    validInput(form.address, addressRegExp, addressErrorMessage) &&
    validInput(form.city, nameCityRegExp, nameCityErrorMessage) &&
    validInput(form.email, emailRegExp, emailErrorMessage)
  ) {
    sendOrder();
  }
});

/* creates an order : contact object containing the information from inputs and
an array of strings of product IDs, then sends it to the server */

const sendOrder = () => {
  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };
  let products = cartItems.map((item) => item._id);
  let order = { contact, products };

  fetch(`http://localhost:3000/api/products/order`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      localStorage.clear(); //deletes localStorage content
      window.location.href = `./confirmation.html?orderId=${data.orderId}#orderId`;
      //redirects user client to the confirmation page
    })
    .catch((err) => {
      alert(`Une erreur est survenue: ${err}`);
    });
};
