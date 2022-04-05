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
