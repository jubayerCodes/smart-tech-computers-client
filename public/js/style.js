

//   ................................................
//   ................................................
//   ................................................
//   ................................................

// Counter Animation
function counterAnimation() {
  const counters = document.querySelectorAll(".counter-value");
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = target / 250;
    const updateCounter = () => {
      const current = +counter.innerText;
      if (current < target) {
        counter.innerText = Math.ceil(current + speed);
        setTimeout(updateCounter, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
}

// Initialize Sidebar Active State on Page Load
document.addEventListener("DOMContentLoaded", function () {
  setSidebarMenuActive();
});

// Tooltip Initialization
document.querySelectorAll("[data-bs-toggle='tooltip']").forEach((tooltip) => {
  new bootstrap.Tooltip(tooltip);
});

// Popover Initialization
document.querySelectorAll("[data-bs-toggle='popover']").forEach((popover) => {
  new bootstrap.Popover(popover);
});

// Horizontal Layout Toggle
function toggleLayout() {
  const body = document.body;
  const layout = body.getAttribute("data-layout");

  if (layout === "horizontal") {
    body.setAttribute("data-layout", "vertical");
  } else {
    body.setAttribute("data-layout", "horizontal");
  }
}
document.querySelectorAll(".layout-toggle").forEach((button) => {
  button.addEventListener("click", toggleLayout);
});

// Initialize All Functions on Page Load
document.addEventListener("DOMContentLoaded", function () {
  counterAnimation();
  setActiveMenu();
});

// Right sidebar toggle functionality
document.querySelectorAll(".right-bar-toggle").forEach(function (toggleBtn) {
  toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("right-bar-enabled");
  });
});

// Close the right sidebar when clicking outside of it
document.body.addEventListener("click", function (event) {
  const isClickInside = event.target.closest(".right-bar-toggle, .right-bar");
  if (!isClickInside) {
    document.body.classList.remove("right-bar-enabled");
  }
});


//.........................................................................



