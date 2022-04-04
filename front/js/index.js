// gets cart content

export const getCart = () => {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
      return [];
    } else {
      return JSON.parse(cart);
    }
  };