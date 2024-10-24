/* ===================================================================
 * Monica 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function (html) {
  ("use strict");

  const cfg = {
    // MailChimp URL
    mailChimpURL:
      "https://facebook.us1.list-manage.com/subscribe/post?u=1abf75f6981256963a47d197a&amp;id=37c6d8f4d6",
  };

  /* preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    const siteBody = document.querySelector("body");
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;

    html.classList.add("ss-preload");

    window.addEventListener("load", function () {
      html.classList.remove("ss-preload");
      html.classList.add("ss-loaded");

      preloader.addEventListener("transitionend", function afterTransition(e) {
        if (e.target.matches("#preloader")) {
          siteBody.classList.add("ss-show");
          e.target.style.display = "none";
          preloader.removeEventListener(e.type, afterTransition);
        }
      });
    });
  }; // end ssPreloader

  /* mobile menu
   * ---------------------------------------------------- */
  const ssMobileMenu = function () {
    const toggleButton = document.querySelector(".s-header__menu-toggle");
    const mainNavWrap = document.querySelector(".s-header__nav");
    const siteBody = document.querySelector("body");

    if (!(toggleButton && mainNavWrap)) return;

    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();
      toggleButton.classList.toggle("is-clicked");
      siteBody.classList.toggle("menu-is-open");
    });

    mainNavWrap.querySelectorAll(".s-header__nav a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        // at 900px and below
        if (window.matchMedia("(max-width: 900px)").matches) {
          toggleButton.classList.toggle("is-clicked");
          siteBody.classList.toggle("menu-is-open");
        }
      });
    });

    window.addEventListener("resize", function () {
      // above 900px
      if (window.matchMedia("(min-width: 901px)").matches) {
        if (siteBody.classList.contains("menu-is-open"))
          siteBody.classList.remove("menu-is-open");
        if (toggleButton.classList.contains("is-clicked"))
          toggleButton.classList.remove("is-clicked");
      }
    });
  }; // end ssMobileMenu

  /* swiper
   * ------------------------------------------------------ */
  const ssSwiper = function () {
    const homeSliderSwiper = new Swiper(".home-slider", {
      slidesPerView: 1,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        // when window width is > 400px
        401: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // when window width is > 800px
        801: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        // when window width is > 1330px
        1331: {
          slidesPerView: 3,
          spaceBetween: 48,
        },
        // when window width is > 1773px
        1774: {
          slidesPerView: 4,
          spaceBetween: 48,
        },
      },
    });

    const pageSliderSwiper = new Swiper(".page-slider", {
      slidesPerView: 1,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        // when window width is > 400px
        401: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // when window width is > 800px
        801: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        // when window width is > 1240px
        1241: {
          slidesPerView: 3,
          spaceBetween: 48,
        },
      },
    });
  }; // end ssSwiper
  /* mailchimp form
   * ---------------------------------------------------- */
  const ssMailChimpForm = function () {
    const mcForm = document.querySelector("#mc-form");

    if (!mcForm) return;

    // Add novalidate attribute
    mcForm.setAttribute("novalidate", true);

    // Field validation
    function hasError(field) {
      if (
        field.disabled ||
        field.type === "file" ||
        field.type === "reset" ||
        field.type === "submit" ||
        field.type === "button"
      )
        return;

      let validity = field.validity;

      if (validity.valid) return;

      if (validity.valueMissing) return "Please enter an email address.";
      if (validity.typeMismatch) {
        if (field.type === "email")
          return "Please enter a valid email address.";
      }
      if (validity.patternMismatch) {
        if (field.hasAttribute("title")) return field.getAttribute("title");
        return "Please match the requested format.";
      }

      return "The value you entered for this field is invalid.";
    }

    // Show error message
    function showError(field, error) {
      let id = field.id || field.name;
      if (!id) return;

      let errorMessage = field.form.querySelector(".mc-status");

      errorMessage.classList.remove("success-message");
      errorMessage.classList.add("error-message");
      errorMessage.innerHTML = error;
    }

    // Display form status
    window.displayMailChimpStatus = function (data) {
      let mcStatus = document.querySelector(".mc-status");
      if (!mcStatus) return;

      mcStatus.innerHTML = data.msg;

      if (data.result === "error") {
        mcStatus.classList.remove("success-message");
        mcStatus.classList.add("error-message");
      } else {
        mcStatus.classList.remove("error-message");
        mcStatus.classList.add("success-message");
      }
    };

    // Submit the email to a direct endpoint
    function submitEmail(form) {
      let url = "https://your-server.com/send-email"; // Replace with your server's endpoint
      let emailField = form.querySelector("#mce-EMAIL");
      let emailData = {
        email: emailField.value,
        recipient: "jose.djunk@gmail.com",
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })
        .then((response) => response.json())
        .then((data) => displayMailChimpStatus(data))
        .catch((error) => {
          console.error("Error:", error);
          showError(
            emailField,
            "An error occurred while submitting your email."
          );
        });
    }

    // Check email field on submit
    mcForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        let emailField = event.target.querySelector("#mce-EMAIL");
        let error = hasError(emailField);

        if (error) {
          showError(emailField, error);
          emailField.focus();
          return;
        }

        submitEmail(this);
      },
      false
    );
  }; // end ssMailChimpForm

  /* alert boxes
   * ------------------------------------------------------ */
  const ssAlertBoxes = function () {
    const boxes = document.querySelectorAll(".alert-box");

    boxes.forEach(function (box) {
      box.addEventListener("click", function (e) {
        if (e.target.matches(".alert-box__close")) {
          e.stopPropagation();
          e.target.parentElement.classList.add("hideit");

          setTimeout(function () {
            box.style.display = "none";
          }, 500);
        }
      });
    });
  }; // end ssAlertBoxes

  /* Back to Top
   * ------------------------------------------------------ */
  const ssBackToTop = function () {
    const pxShow = 900;
    const goTopButton = document.querySelector(".ss-go-top");

    if (!goTopButton) return;

    // Show or hide the button
    if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

    window.addEventListener("scroll", function () {
      if (window.scrollY >= pxShow) {
        if (!goTopButton.classList.contains("link-is-visible"))
          goTopButton.classList.add("link-is-visible");
      } else {
        goTopButton.classList.remove("link-is-visible");
      }
    });
  }; // end ssBackToTop

  /* smoothscroll
   * ------------------------------------------------------ */
  const ssMoveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll(".smoothscroll");

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
      },
      easeFunctions
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  }; // end ssMoveTo

  /* Initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    ssPreloader();
    ssMobileMenu();
    ssSwiper();
    ssMailChimpForm();
    ssAlertBoxes();
    ssMoveTo();
  })();
})(document.documentElement);

function sendmail(params) {
  var params = {
    from_name: document.getElementById("fullName").value,
    email_id: document.getElementById("emailId").value,
    message: document.getElementById("message").value,
  };
  emailjs
    .send("service_f2cspir", "template_ng52bco", params)
    .then(function (res, err) {
      alert("Email sent succesfully");
      if (err) {
        console.log("error " + err);
      }
    });
}
