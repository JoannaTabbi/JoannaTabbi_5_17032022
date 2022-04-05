//gets the cart & converts it to an array

export const getCart = () => {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};

// saves a cart list in the local storage, converts array into string

export const setCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));

// sort products by their name then color

export const orderedList = (products) => {
  const orderedData = products.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else if (a.color < b.color) {
      return -1;
    } else if (a.color > b.color) {
      return 1;
    } else {
      return 0;
    }
  });
  return orderedData;
};