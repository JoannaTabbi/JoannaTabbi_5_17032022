// displays products details at the cart page

fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    let cart = getCart();
    let cartItemsHtml = "";
    let cartProductPrice = 0;

    cart.forEach((cartItem) => {
      products.forEach((product) => {
        if (product._id == cartItem._id) {
          cartItemsHtml += ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${cartItem.colors}</p>
              <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

          // displays total product price

          cartProductPrice += cartItem.quantity * product.price;
          document.getElementById("totalPrice").innerText = cartProductPrice;
        }
      });
    });

    document.getElementById("cart__items").innerHTML = cartItemsHtml;
    document.getElementById("totalQuantity").innerText = totalQuantity();
  })

  .catch((err) => {
    const items = document.getElementById("cart__items");
    items.innerHTML = `Une erreur est survenue: ${err}`;
  });

// gets cart content

let getCart = () => {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};

// obtains total product quantity

let totalQuantity = () => {
  let cart = getCart();
  let cartProductQuantity = 0;
  for (let cartItem of cart) {
    cartProductQuantity += cartItem.quantity;
  }
  return cartProductQuantity;
};
