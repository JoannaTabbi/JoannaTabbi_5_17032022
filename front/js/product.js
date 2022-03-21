const urlSearchParams = new URLSearchParams(window.location.search);
const productId = urlSearchParams.get("id");

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
