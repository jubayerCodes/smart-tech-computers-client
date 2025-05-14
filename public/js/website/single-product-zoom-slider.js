document.addEventListener("DOMContentLoaded", function () {
  // Initialize lightSlider
  var lightSlider = document.getElementById("lightSlider");
  if (lightSlider && window.lightSlider) {
    lightSlider.lightSlider({
      gallery: true,
      item: 1,
      loop: true,
      slideMargin: 0,
      galleryMargin: 10,
      thumbItem: 5,
    });
  }

  // Zoom functionality
  document.querySelectorAll(".zoom_container").forEach(function (container) {
    var zoomBox = container.querySelector(".zoom_box");
    var zoomImg = zoomBox ? zoomBox.querySelector("img") : null;

    if (!zoomBox || !zoomImg) return;

    container.addEventListener("mouseenter", function () {
      zoomBox.style.display = "block";
    });

    container.addEventListener("mouseleave", function () {
      zoomBox.style.display = "none";
    });

    container.addEventListener("mousemove", function (event) {
      var rect = container.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;

      var xPercent = (x / container.offsetWidth) * 100;
      var yPercent = (y / container.offsetHeight) * 100;

      zoomImg.style.left =
        -((xPercent / 100) * zoomImg.width - zoomBox.offsetWidth / 2) + "px";
      zoomImg.style.top =
        -((yPercent / 100) * zoomImg.height - zoomBox.offsetHeight / 2) + "px";

      zoomBox.style.top = y - zoomBox.offsetHeight / 2 + "px";
      zoomBox.style.left = x - zoomBox.offsetWidth / 2 + "px";
    });

    // Touch events for mobile
    container.addEventListener("touchstart", handleTouchMove);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", function () {
      zoomBox.style.display = "none";
    });

    function handleTouchMove(event) {
      var touch = event.touches[0];
      var rect = container.getBoundingClientRect();
      var x = touch.clientX - rect.left;
      var y = touch.clientY - rect.top;

      zoomBox.style.display = "block";
      var xPercent = (x / container.offsetWidth) * 100;
      var yPercent = (y / container.offsetHeight) * 100;

      zoomImg.style.left =
        -((xPercent / 100) * zoomImg.width - zoomBox.offsetWidth / 2) + "px";
      zoomImg.style.top =
        -((yPercent / 100) * zoomImg.height - zoomBox.offsetHeight / 2) + "px";

      zoomBox.style.top = y - zoomBox.offsetHeight / 2 + "px";
      zoomBox.style.left = x - zoomBox.offsetWidth / 2 + "px";

      event.preventDefault();
    }
  });

  // Prevent touch events on the slider from interfering
  if (lightSlider) {
    lightSlider.addEventListener("touchstart", function (event) {
      event.stopPropagation();
    });
    lightSlider.addEventListener("touchmove", function (event) {
      event.stopPropagation();
    });
  }

  // Prevent default action on slider buttons
  document.querySelectorAll(".lSAction").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      setTimeout(function () {
        if (lightSlider && lightSlider.lightSlider) {
          lightSlider.lightSlider("refresh");
        }
      }, 300);
    });
  });
});
