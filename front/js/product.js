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

    addToCart(product);
  })

  .catch((err) => {
    alert(`Une erreur est survenue: ${err}`);
  });

// ------------------- add to cart section -------------------------

// saves a cart list in the local storage, converts array into string

let setCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

//gets the cart & converts it to an array

let getCart = () => {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};
// checks if the product already exists in the cart

productMatch = (product) => {
  let cart = getCart();
  let productFound = cart.find((p) => p._id == product._id);
  let colorFound = cart.find((q) => q.colors == product.colors);
  if (productFound != undefined && colorFound != undefined) {
    productFound.quantity += product.quantity;
  } else {
    product.quantity = Number(document.getElementById("quantity").value);
    cart.push(product);
  }
  setCart(cart);
};

// adds the product to the cart while clicking on the add to cart button

function addToCart(product) {
  const addToCartButton = document.getElementById("addToCart");
  addToCartButton.addEventListener("click", (event) => {
    event.preventDefault();
    let selectedColor = document.getElementById("colors").value;
    product.colors = selectedColor;
    product.quantity = Number(document.getElementById("quantity").value);
    if (product.colors === "") {
      document.getElementById("colors").style.color = "red";
      //enlever la couleur rouge dès que la couleur est choisie, sans attendre le click au bouton panier.
    } else {
      document.getElementById("colors").style.color = "#767676";
      console.log(product);
      productMatch(product);
    }
  });
}
