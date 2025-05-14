$(document).ready(function () {
  $(".brand-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 2, // Show 2 items for small screens (mobile)
      },
      600: {
        items: 3, // Show 3 items for tablets
      },
      1000: {
        items: 5, // Show 5 items for desktop screens
      },
    },
  });
});
