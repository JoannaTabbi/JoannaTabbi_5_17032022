// gets the id of one product

const urlSearchParams = new URLSearchParams(window.location.search);
const productId = urlSearchParams.get("id");

// gets the product data & implements the data into product page

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
  })

  .catch((err) => {
    alert(`Une erreur est survenue: ${err}`);
  });

// ------------------- add to cart section -------------------------

// creates a cart list in the local storage, converts array into string

let cart = [];
localStorage.setItem("cart", JSON.stringify(cart));

//gets the cart & converts to array

let getCart = () => JSON.perse(localStorage.getItem("cart"));

// adds products to the cart

addToCart = (product) => {
  let cart = getCart();
  let productFound = cart.find((p) => p.id == product.id);
  let colorFound = cart.find((q) => q.color == product.color);
  if (productFound != undefined && colorFound != undefined) {
    productFound.quantity++;
  } else {
    product.quantity = 1;
  }
}; // terminer la fonction

// creates chosen product (id, color option and quantity) while clicking on the add to cart button

const addToCartButton = document.getElementById("addToCart");
addToCartButton.addEventListener("click", (event) => {
  event.preventDefault();
  const idChosen = `${productId}`;
  const colorChosen = document.getElementById("colors").value;
  const quantityChosen = document.getElementById("quantity").value;
  const productChosen = [
    { id: idChosen },
    { color: colorChosen },
    { quantity: quantityChosen },
  ];
  if (colorChosen === "") {
    document.getElementById("colors").style.backgroundColor = "red";
    //enlever la couleur rouge dès que la couleur est choisie, sans attendre le click au bouton panier.
  } else {
    document.getElementById("colors").style.borderColor = "#767676";
    console.log(productChosen);
  }
});
