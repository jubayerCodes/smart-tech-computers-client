

// Quantity...
function updateQuantity(action, quantityInput) {
  let currentQuantity = parseInt(quantityInput.value);

  if (action === "increase") {
    currentQuantity += 1; // Increase quantity by 1
  } else if (action === "decrease" && currentQuantity > 1) {
    currentQuantity -= 1;
  }

  quantityInput.value = currentQuantity;

  // Find the quantity display element within the same container and update it
  const displayElement = quantityInput
    .closest(".price_container")
    .querySelector(".quantity");
  displayElement.innerText = currentQuantity;
}

// Event listeners for the quantity buttons
document.querySelectorAll(".btn-increase, .btn-decrease").forEach((button) => {
  button.addEventListener("click", function () {
    const action = this.classList?.contains("btn-increase")
      ? "increase"
      : "decrease";
    // Locate the quantity input field within the same container as the button
    const quantityInput =
      this.closest(".wrap").querySelector(".quantity-input");
    updateQuantity(action, quantityInput);
  });
});
// Navbar header Add to Cart Sidebar Js End...................
