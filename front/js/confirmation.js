// gets the order id from the url

const urlSearchParams = new URLSearchParams(window.location.search);
const lastOrderId = urlSearchParams.get("orderId");

// dispays order number on the page

document.getElementById("orderId").innerHTML = `<br>${lastOrderId}`;
