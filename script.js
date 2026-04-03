document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // 1. Hero Slider with Thumbnails
  // ============================================================
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroThumbs = document.querySelectorAll(".hero-thumb");
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    if (index === currentSlide && heroSlides[currentSlide] && heroSlides[currentSlide].classList.contains("active")) return;

    heroSlides.forEach((slide) => slide.classList.remove("active"));

    currentSlide = index;
    if (currentSlide >= heroSlides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = heroSlides.length - 1;

    if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetSlider() {
    clearInterval(slideInterval);
    startSlider();
  }

  // Thumbnail click handlers
  heroThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const slideIndex = parseInt(thumb.getAttribute("data-slide"));
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
        resetSlider();
      }
    });
  });

  if (heroSlides.length > 0) {
    startSlider();
  }

  // Detect which thumbnail is in the center and lift it up
  function updateCenterThumb() {
    const container = document.querySelector('.hero-thumbnails');
    const track = document.querySelector('.hero-thumb-track');
    if (!container || !track) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const thumbs = track.querySelectorAll('.hero-thumb');
    let closestThumb = null;
    let closestDist = Infinity;

    thumbs.forEach(thumb => {
      const rect = thumb.getBoundingClientRect();
      const thumbCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(thumbCenterX - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestThumb = thumb;
      }
    });

    thumbs.forEach(t => t.classList.remove('active'));
    if (closestThumb && closestDist < 120) {
      closestThumb.classList.add('active');
    }

    requestAnimationFrame(updateCenterThumb);
  }
  requestAnimationFrame(updateCenterThumb);

  // ============================================================
  // 2. Mobile Menu
  // ============================================================
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
    document.body.style.overflow = "";
  }

  function toggleMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("active");
    if (hamburger) hamburger.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ============================================================
  // 3. Welcome Popup
  // ============================================================
  const popupOverlay = document.querySelector(".popup-overlay");
  const popupCloseBtn = document.querySelector(".popup-close");
  const popupDismissBtn = document.querySelector(".popup-dismiss");

  function showPopup() {
    if (popupOverlay) popupOverlay.classList.add("active");
  }

  function hidePopup() {
    if (popupOverlay) popupOverlay.classList.remove("active");
  }

  function shouldShowPopup() {
    const dismissed = localStorage.getItem("twineshots_popup_dismissed");
    if (!dismissed) return true;
    const today = new Date().toISOString().split("T")[0];
    return dismissed !== today;
  }

  if (popupOverlay && shouldShowPopup()) {
    setTimeout(showPopup, 1000);
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", hidePopup);
  }

  if (popupDismissBtn) {
    popupDismissBtn.addEventListener("click", () => {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("twineshots_popup_dismissed", today);
      hidePopup();
    });
  }

  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) hidePopup();
    });
  }

  // ============================================================
  // 4. WhatsApp Modal
  // ============================================================
  const whatsappBtn = document.querySelector(".whatsapp-btn");
  const whatsappModal = document.querySelector(".whatsapp-modal");
  const whatsappClose = document.querySelector(".whatsapp-modal .modal-close");

  if (whatsappBtn && whatsappModal) {
    whatsappBtn.addEventListener("click", () => {
      whatsappModal.classList.toggle("active");
    });
  }

  if (whatsappClose && whatsappModal) {
    whatsappClose.addEventListener("click", () => {
      whatsappModal.classList.remove("active");
    });
  }

  if (whatsappModal) {
    whatsappModal.addEventListener("click", (e) => {
      if (e.target === whatsappModal) {
        whatsappModal.classList.remove("active");
      }
    });
  }

  // ============================================================
  // 5. Scroll Animations (GSAP + ScrollTrigger)
  // ============================================================
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const cardSelectors = [
      ".service-card",
      ".value-card",
      ".review-card",
      ".discover-card",
    ];

    cardSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Subtle card reveal — barely any movement
        gsap.from(elements, {
          y: 15,
          opacity: 0.3,
          duration: 0.6,
          stagger: 0.06,
          ease: "power1.out",
          scrollTrigger: {
            trigger: elements[0].parentElement || elements[0],
            start: "top 88%",
          },
        });

        // Image inside card zooms out (scales from 1.15 to 1) — the "peek out" effect
        elements.forEach((card) => {
          // Target the background image via the card itself (for service-card) or an inner img/thumb-img
          gsap.fromTo(card,
            { backgroundSize: "115%" },
            {
              backgroundSize: "100%",
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
            }
          );
        });
      }
    });

    const sectionTitles = document.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
      gsap.from(title, {
        y: 10,
        opacity: 0.2,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: title,
          start: "top 90%",
        },
      });
    });

    const formContainer = document.querySelector(".form-container");
    if (formContainer) {
      gsap.from(formContainer, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formContainer,
          start: "top 85%",
        },
      });
    }
  }

  // ============================================================
  // 6. Navbar Scroll Effect
  // ============================================================
  const navbar = document.querySelector(".navbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // ============================================================
  // 7. Active Nav Link Highlight
  // ============================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;
  const currentFile =
    currentPath.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const linkFile = href.split("/").pop() || "index.html";

    if (
      href === currentPath ||
      linkFile === currentFile ||
      (currentFile === "" && linkFile === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // ============================================================
  // 8. Smooth Scroll for Anchor Links
  // ============================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
});
