// About Page Counter Start....
const counters = document.querySelectorAll(".counter");
const animationDuration = 4000;

const startCounting = (counter) => {
  const target = +counter.getAttribute("data-target");
  const increment = target / (animationDuration / 20);

  let currentValue = 0;

  const updateCounter = () => {
    if (currentValue < target) {
      currentValue += increment;
      counter.innerText = Math.floor(currentValue);
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };

  updateCounter();
};

// Intersection Observer to detect when counters are visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Apply observer to each counter
counters.forEach((counter) => {
  counter.innerText = "0";
  observer.observe(counter);
});
// About Page Counter End..............

// Payment page Credit Card Function Start..................
// Function to format the card number with spaces after every 4 digits
function formatCardNumber(event) {
  let input = event.target;
  let value = input.value.replace(/\D/g, ""); // Remove all non-numeric characters
  if (value.length > 4) {
    value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Insert space after every 4 digits
  }
  input.value = value; // Update the input field with formatted value
}

// Function to identify card brand based on the first 1-4 digits
function getCardBrandByPrefix(cardNumber) {
  const cardPrefix = cardNumber.replace(/\D/g, "").substring(0, 4);

  if (/^4\d{0,3}$/.test(cardPrefix)) {
    return "Visa"; // Visa starts with 4
  }
  if (/^5[1-5]\d{0,2}$/.test(cardPrefix)) {
    return "MasterCard"; // MasterCard starts with 51-55
  }
  if (/^3[47]\d{0,2}$/.test(cardPrefix)) {
    return "American Express"; // American Express starts with 34 or 37
  }
  if (/^6(?:011|5\d{0,2}|4[4-9]\d{0,1})$/.test(cardPrefix)) {
    return "Discover"; // Discover starts with 6011 or 65
  }
  return "Unknown"; // If no match found
}

// Function to show or hide card logos based on detected card brand
function showCardLogo(cardBrand) {
  const logos = document.querySelectorAll(".card_logo_box .logo");

  // Hide all logos initially
  logos.forEach((logo) => {
    logo.style.display = "none";
  });

  // Show only the matching logo
  if (cardBrand !== "Unknown") {
    const matchingLogo = document.querySelector(
      `.card_logo_box .logo[data-card="${cardBrand}"]`
    );
    if (matchingLogo) {
      matchingLogo.style.display = "inline-block"; // Show the matching card logo
    }
  } else {
    // If no card is detected, show all logos again
    logos.forEach((logo) => {
      logo.style.display = "inline-block"; // Show all logos
    });
  }
}

// Function to handle card number input and update the card logo display
function handleCardInput() {
  const cardNumberInput = document.getElementById("card-number").value;
  if (cardNumberInput === "") {
    // If the input is empty, show all logos
    showCardLogo("Unknown");
  } else {
    const cardBrand = getCardBrandByPrefix(cardNumberInput);
    showCardLogo(cardBrand);
  }
}

// Attach event listener to the card-number input field for formatting and brand detection
document.addEventListener("DOMContentLoaded", function () {
  const cardNumberInput = document.getElementById("card-number");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (event) {
      formatCardNumber(event); // Format the card number
      handleCardInput(); // Show the correct card logo
    });
  }
});

// Function to format the expiration date (MM/YY)
function formatExpirationDate(event) {
  let input = event.target;
  let value = input.value.replace(/\D/g, ""); // Remove all non-numeric characters

  // Automatically insert a slash after two digits for the month part (MM)
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4); // Format MM/YY
  }

  // Limit the input to "MM/YY" format
  input.value = value.substring(0, 5); // Ensure the input only allows MM/YY
}

// Function to handle backspace and remove the slash if it's there
function handleBackspace(event) {
  const input = event.target;
  let value = input.value;

  // Check if backspace is pressed and the cursor is just before or at the slash
  if (event.key === "Backspace" && value.length === 3 && value[2] === "/") {
    input.value = value.substring(0, 2) + value.substring(3); // Remove the slash
  }
}

// Attach event listener to the expiration date input field for formatting
document.addEventListener("DOMContentLoaded", function () {
  const expirationDateInput = document.getElementById("expiration-date");

  if (expirationDateInput) {
    // Add the input event listener for formatting
    expirationDateInput.addEventListener("input", function (event) {
      formatExpirationDate(event); // Format the expiration date as MM/YY
    });

    // Add the keydown event listener for backspace handling
    expirationDateInput.addEventListener("keydown", function (event) {
      handleBackspace(event); // Handle backspace for removing the slash
    });
  }
});

// Payment page Credit Card Function End..................

// Blog Single page youtube video player Start..............
window.onload = function () {
  function stopAllVideos() {
    var iframe = document.getElementById("videoIframe");
    if (!iframe) return; // Check if iframe exists

    var iframeSrc = iframe.src;

    // Stop YouTube/Vimeo videos by sending the "pause" message
    if (iframeSrc.includes("youtube.com") || iframeSrc.includes("vimeo.com")) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );

      // Remove autoplay from iframe to stop autoplay if clicked outside
      var newSrc = iframeSrc.replace(/(\?|\&)autoplay=1/, ""); // Remove autoplay parameter
      iframe.src = newSrc;
    }

    // Stop background video if present
    var backgroundVideo = document.getElementById("backgroundVideo");
    if (backgroundVideo && backgroundVideo.tagName === "VIDEO") {
      backgroundVideo.pause(); // Pause background video
      backgroundVideo.currentTime = 0; // Reset to the beginning
    }

    // Hide the iframe and show the play button and thumbnail again
    iframe.style.display = "none";
    var videoThumbnail = document.getElementById("videoThumbnail");
    var playButton = document.getElementById("playButton");
    if (videoThumbnail) videoThumbnail.style.display = "block";
    if (playButton) playButton.style.display = "block";
  }

  // Play the embedded video when play button is clicked
  var playButton = document.getElementById("playButton");
  if (playButton) {
    playButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior

      // Hide the thumbnail and play button
      var videoThumbnail = document.getElementById("videoThumbnail");
      if (videoThumbnail) videoThumbnail.style.display = "none";
      playButton.style.display = "none";

      // Show the iframe
      var iframe = document.getElementById("videoIframe");
      if (iframe) {
        iframe.style.display = "block";

        // Play the embedded video or background video
        var iframeSrc = iframe.src;
        if (
          iframeSrc.includes("youtube.com") ||
          iframeSrc.includes("vimeo.com")
        ) {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "*"
          );

          // Add autoplay if it's not already there
          var newSrc = iframeSrc.includes("autoplay=1")
            ? iframeSrc
            : iframeSrc + (iframeSrc.includes("?") ? "&" : "?") + "autoplay=1";
          iframe.src = newSrc;
        }
      }

      // Pause the background video (if any)
      var backgroundVideo = document.getElementById("backgroundVideo");
      if (backgroundVideo && backgroundVideo.tagName === "VIDEO") {
        backgroundVideo.pause();
      }
    });
  }

  // Close the video when clicking anywhere outside the iframe or play button
  document.addEventListener("click", function (event) {
    var iframe = document.getElementById("videoIframe");
    var videoThumbnail = document.getElementById("videoThumbnail");
    var playButton = document.getElementById("playButton");

    if (
      iframe &&
      videoThumbnail &&
      playButton &&
      !iframe.contains(event.target) &&
      !videoThumbnail.contains(event.target) &&
      !playButton.contains(event.target)
    ) {
      stopAllVideos(); // Stop both the embedded and background video and disable autoplay
    }
  });

  // Prevent clicks inside the iframe from triggering the "outside click" logic
  var iframe = document.getElementById("videoIframe");
  if (iframe) {
    iframe.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop propagation to prevent triggering the outside click listener
    });
  }
};

// Blog Single page youtube video player Ed..............
