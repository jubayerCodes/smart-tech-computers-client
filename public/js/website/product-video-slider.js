$(document).ready(function () {
  var owl = $(".video-carousel").owlCarousel({
    // loop: true,
    margin: 10,
    nav: false, 
    dots: false, 
    autoplay: true,
    autoplayTimeout: 2000, 
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  });

  // Custom navigation
  $(".next-btn").click(function () {
    owl.trigger("next.owl.carousel");
  });
  $(".prev-btn").click(function () {
    owl.trigger("prev.owl.carousel");
  });

  // Custom dot functionality
  $(".custom-dots .dot").click(function () {
    var slideIndex = $(this).data("slide");
    owl.trigger("to.owl.carousel", [slideIndex, 300]); // Go to slide index
    updateDots(slideIndex);
  });

  // Update dot highlighting
  function updateDots(activeIndex) {
    $(".custom-dots .dot").removeClass("active");
    $('.custom-dots .dot[data-slide="' + activeIndex + '"]').addClass("active");
  }

  // Listen for owl carousel changes and update dots accordingly
  owl.on("changed.owl.carousel", function (event) {
    var currentIndex =
      event.item.index - event.relatedTarget._clones.length / 2;
    var count = event.item.count;
    var currentSlide =
      currentIndex < 0 ? count + currentIndex : currentIndex % count;
    updateDots(currentSlide);
  });

  // Initialize with the first dot active
  updateDots(0);
});
