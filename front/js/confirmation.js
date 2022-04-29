// gets the id of one product

const urlSearchParams = new URLSearchParams(window.location.search);
const lastOrderId = urlSearchParams.get("orderId");

//dispays order number

document.getElementById("orderId").innerHTML = `<br>${lastOrderId}`;