// Filter Select Search Box Js Start................................................................
document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = document.querySelectorAll(".select-box-dropdown");

  dropdowns.forEach(function (dropdown) {
    const dropdownSelected = dropdown.querySelector(
      ".select-dropdown-selected"
    );
    const dropdownItems = dropdown.querySelector(".select-dropdown-items");
    const searchBox = dropdown.querySelector(".select-search-box");
    const icon = dropdown.querySelector(".icon i");

    // Function to toggle visibility of search box based on number of items
    function toggleSearchInput() {
      const itemCount = dropdownItems.querySelectorAll(".option").length;
      if (itemCount >= 4) {
        searchBox.style.display = "block";
      } else {
        searchBox.style.display = "none";
      }
    }

    // Function to position the dropdown dynamically
    function positionDropdown() {
      const rect = dropdown.getBoundingClientRect(); // Get the position of the dropdown container
      const dropdownHeight = dropdownItems.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom; // Space below the dropdown
      const spaceAbove = rect.top; // Space above the dropdown

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        // If not enough space below, position the dropdown above
        dropdownItems.style.bottom = `${rect.height}px`; // Place above, accounting for the selected height
        dropdownItems.style.top = "auto";
      } else {
        // Otherwise, position the dropdown below
        dropdownItems.style.top = "100%";
        dropdownItems.style.bottom = "auto";
      }
    }

    // Toggle dropdown visibility
    dropdownSelected.addEventListener("click", function (e) {
      e.stopPropagation();

      // Close all other dropdowns
      dropdowns.forEach(function (otherDropdown) {
        if (otherDropdown !== dropdown) {
          otherDropdown
            .querySelector(".select-dropdown-items")
            .classList.remove("show");
          otherDropdown
            .querySelector(".icon i")
            .classList.remove("fa-angle-up");
          otherDropdown.querySelector(".icon i").classList.add("fa-angle-down");
        }
      });

      // Toggle current dropdown visibility
      dropdownItems.classList.toggle("show");

      // Toggle icon rotation
      if (dropdownItems.classList?.contains("show")) {
        icon.classList.remove("fa-angle-down");
        icon.classList.add("fa-angle-up");
      } else {
        icon.classList.remove("fa-angle-up");
        icon.classList.add("fa-angle-down");
      }

      // Call function to toggle search input visibility
      toggleSearchInput();

      // Position the dropdown based on available space
      if (dropdownItems.classList?.contains("show")) {
        positionDropdown();
      }
    });

    // Filter dropdown items based on search
    searchBox.addEventListener("input", function () {
      const filter = searchBox.value.toLowerCase();
      const items = dropdownItems.querySelectorAll(".option");

      items.forEach(function (item) {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });

    // Close the dropdown if clicked outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".select-box-dropdown")) {
        dropdownItems.classList.remove("show");
        icon.classList.remove("fa-angle-up");
        icon.classList.add("fa-angle-down");
        searchBox.style.display = "none";
      }
    });

    // Select dropdown item
    dropdownItems.addEventListener("click", function (e) {
      if (e.target.tagName === "OPTION") {
        dropdownSelected.querySelector("span").textContent =
          e.target.textContent;
        dropdownItems.classList.remove("show");
        icon.classList.remove("fa-angle-up");
        icon.classList.add("fa-angle-down");
        searchBox.style.display = "none";
      }
    });
  });
});
// Filter Select Search Box Js End........................................................