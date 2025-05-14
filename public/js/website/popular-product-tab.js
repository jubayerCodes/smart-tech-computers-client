document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tabContainer = button.closest(".populer_product");
      const tabNumber = button.dataset.tab;
  
      // Remove active class from all buttons
      tabContainer
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
  
      // Hide the current active tab
      const currentActiveTab = tabContainer.querySelector(".tab-content.active");
      if (currentActiveTab) {
        currentActiveTab.classList.remove("active");
      }
  
      // Show the selected tab content with fade effect
      const newActiveTab = tabContainer.querySelector(`#${tabNumber}`);
      newActiveTab.classList.add("active");
  
      // Add active class to the selected button
      button.classList.add("active");
    });
  });
  