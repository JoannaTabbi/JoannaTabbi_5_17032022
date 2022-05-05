import * as index from "./index.js";

// gets the id of one product from the url of the page

const urlSearchParams = new URLSearchParams(window.location.search);
const productId = urlSearchParams.get("id");

// gets the product data from the API & implements the data into product page

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((product) => {
    document.querySelector("head > title").innerText = `${product.name}`;
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById("title").innerText = `${product.name}`;
    document.getElementById("price").innerText = `${product.price}`;
    document.getElementById("description").innerText = `${product.description}`;

    product.colors.forEach((color) => {
      const colorOption = document.createElement("option");
      colorOption.setAttribute("value", `${color}`);
      colorOption.innerText = `${color}`;
      document.getElementById("colors").appendChild(colorOption);
    });

    document.getElementById("quantity").setAttribute("value", "1");

    addToCart(product);
  })

  .catch((err) => {
    alert(`Une erreur est survenue: ${err}`);
  });

// ------------------- add to cart section -------------------------

// checks if the product already exists in the cart

const productMatch = (product) => {
  let cartItems = index.getCart();
  let productFound = cartItems.find(
    (p) => p._id == product._id && p.color == product.colors
  );
  if (productFound) {
    productFound.quantity += product.quantity;
  } else {
    product.quantity = Number(document.getElementById("quantity").value);

    const productInCart = {
      name: product.name,
      color: product.colors,
      _id: product._id,
      quantity: product.quantity,
    };
    cartItems.push(productInCart);
  }
  index.setCart(index.orderedList(cartItems));
};

// adds the product to the cart while clicking on the add-to-cart button
const addToCartButton = document.getElementById("addToCart");
const addToCart = (product) => {
  addToCartButton.addEventListener("click", (event) => {
    event.preventDefault();
    let selectedColor = document.getElementById("colors").value;
    product.colors = selectedColor;
    product.quantity = Number(document.getElementById("quantity").value);
    if (product.colors === "") {
      document.getElementById("colors").style.color = "red";
    } else {
      document.getElementById("colors").style.color =
        "var(--footer-secondary-color)";
      productMatch(product);
      confirmationMessage();
    }
  });
};

//  displays the confirmation that the product has been added to the cart

const confirmationMessage = () => {
  alert("Votre produit a été ajouté au panier");
};
