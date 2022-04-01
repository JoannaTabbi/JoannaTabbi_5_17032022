//gets the products information frop API

fetch("http://localhost:3000/api/products")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    let cart = getCart();
    let cartItemsHtml = "";
    let totalProductPrice = 0;
    let totalProductQuantity = 0;

    // reconstructs cart products with name, image and price from API

    cart.forEach((cartItem) => {
      products.forEach((product) => {
        if (product._id == cartItem._id) {
          let productFromCart = {
            _id: product._id,
            name: product.name,
            colors: cartItem.colors,
            imageUrl: product.imageUrl,
            altTxt: product.altTxt,
            price: product.price,
            quantity: cartItem.quantity,
            totalPrice: function () {
              let x = this.quantity * this.price;
              return x;
            },
          };
          // displays products details

          document.getElementById("cart__items").innerHTML =
            cartItemsHtml += ` <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
          <div class="cart__item__img">
            <img src="${productFromCart.imageUrl}" alt="${productFromCart.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${productFromCart.name}</h2>
              <p>${productFromCart.colors}</p>
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
        }
      });
    });
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
