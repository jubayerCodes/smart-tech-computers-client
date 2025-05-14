// Shopping Cart Quantity Start.........

document.addEventListener("DOMContentLoaded", function () {
  // Select all quantity control blocks
  const quantityControls = document.querySelectorAll(".quantity_control");

  // Loop over each quantity control block
  quantityControls.forEach((control) => {
    // Select the decrease button, input, and increase button within each block
    const decreaseBtn = control.querySelector(".decrease-btn");
    const increaseBtn = control.querySelector(".increase-btn");
    const quantityInput = control.querySelector(".quantity-input");

    // Event listener for decreasing quantity
    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value, 10) || 1;

      // Decrease value but don't go below 1
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    // Event listener for increasing quantity
    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value, 10) || 1;

      // Increase value
      quantityInput.value = currentValue + 1;
    });
  });
});
// Shopping Cart Quantity End.........
