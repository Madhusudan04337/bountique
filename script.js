/* =========================================================
   FASHION STORE INTERACTIVE JS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------------------
     HERO SLIDER LOGIC
  ----------------------------------------------------- */
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll("#sliderDots .dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % heroSlides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(prev);
  }

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(slideInterval);
  }

  if (heroSlides.length > 0) {
    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); stopAutoplay(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); stopAutoplay(); startAutoplay(); });

    heroDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const slideIndex = parseInt(this.getAttribute("data-slide"), 10);
        showSlide(slideIndex);
        stopAutoplay();
        startAutoplay();
      });
    });

    startAutoplay();
  }

  /* -----------------------------------------------------
     SEARCH OVERLAY CONTROLS
  ----------------------------------------------------- */
  const searchBtn = document.getElementById("searchBtn");
  const closeSearch = document.getElementById("closeSearch");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", function () {
      searchOverlay.classList.add("show");
      searchOverlay.setAttribute("aria-hidden", "false");
      if (searchInput) searchInput.focus();
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", function () {
      searchOverlay.classList.remove("show");
      searchOverlay.setAttribute("aria-hidden", "true");
    });
  }

  /* -----------------------------------------------------
     WISHLIST TOGGLE
  ----------------------------------------------------- */
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.classList.toggle("active");
      
      const icon = this.querySelector("i");
      if (icon) {
        if (this.classList.contains("active")) {
          icon.className = "bi bi-heart-fill";
        } else {
          icon.className = "bi bi-heart";
        }
      }
    });
  });

  /* -----------------------------------------------------
     ADD TO CART FEEDBACK
  ----------------------------------------------------- */
  const cartButtons = document.querySelectorAll(".cart-action");
  cartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const icon = this.querySelector("i");
      if (!icon) return;

      const originalClass = icon.className;
      icon.className = "bi bi-check-lg";
      this.style.background = "#171717";
      this.style.color = "#ffffff";

      setTimeout(() => {
        icon.className = originalClass;
        this.style.background = "";
        this.style.color = "";
      }, 1200);
    });
  });

  /* -----------------------------------------------------
     NEWSLETTER SUBMISSION
  ----------------------------------------------------- */
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = newsletterForm.querySelector("input");
      const button = newsletterForm.querySelector("button");

      if (input && input.value.trim() !== "") {
        const originalText = button.innerHTML;
        button.innerHTML = 'Subscribed <i class="bi bi-check-lg"></i>';
        input.value = "";

        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2500);
      }
    });
  }

  /* -----------------------------------------------------
     BACK TO TOP BUTTON
  ----------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* -----------------------------------------------------
     SMOOTH SCROLL FOR NAV LINKS
  ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          const header = document.querySelector(".site-header");
          const offset = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });

});