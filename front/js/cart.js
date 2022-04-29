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

let nameAddressRegExp = new RegExp("^[\\wÀ-ú'-\\s]{2,}$", "g");
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

// validates input on change event

const validInputOnChange = (input, regex, message) => {
  input.addEventListener("change", (e) => {
    e.preventDefault();
    validInput(input, regex, message);
  });
};

const nameAddressErrorMessage =
  "Votre saisie doit contenir au moins deux caractères alphanumériques. Les tirets et les espaces sont acceptés.";
const emailErrorMessage = "Votre adresse mail n'est pas valide";

validInputOnChange(form.firstName, nameAddressRegExp, nameAddressErrorMessage);
validInputOnChange(form.lastName, nameAddressRegExp, nameAddressErrorMessage);
validInputOnChange(form.address, nameAddressRegExp, nameAddressErrorMessage);
validInputOnChange(form.city, nameAddressRegExp, nameAddressErrorMessage);
validInputOnChange(form.email, emailRegExp, emailErrorMessage);

// **************** form submit *******************

// submits form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    validInput(form.firstName, nameAddressRegExp, nameAddressErrorMessage) &&
    validInput(form.lastName, nameAddressRegExp, nameAddressErrorMessage) &&
    validInput(form.address, nameAddressRegExp, nameAddressErrorMessage) &&
    validInput(form.city, nameAddressRegExp, nameAddressErrorMessage) &&
    validInput(form.email, emailRegExp, emailErrorMessage)
  ) {
    sendForm();
  } else {
    alert(
      "Afin que votre commande soit prise en compte, merci de renseigner correctement tous les champs du formulaire."
    );
  }
});

// send form function

const sendForm = () => {
  // creates contact object

  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };

  // creates an array of strings of product-ID

  let products = [];
  cartItems.forEach((product) => {
    products.push(product._id);
  });

  let order = { contact, products };

  //sends the order to the server

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
    window.location.href = `./confirmation.html?orderId=${data.orderId}`;
    localStorage.clear()  //deletes localStorage content
  })
  .catch((err) => {
    alert(`Une erreur est survenue: ${err}`);
  })
};
