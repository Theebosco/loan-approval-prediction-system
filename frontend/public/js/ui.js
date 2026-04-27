const animatedItems = document.querySelectorAll("[data-animate]");

animatedItems.forEach(item => {
  item.style.opacity = "0";
  item.style.transform = "translateY(16px)";
  item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0px)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

animatedItems.forEach(item => observer.observe(item));

const nav = document.querySelector("[data-nav]");
if (nav) {
  const toggleShadow = () => {
    if (window.scrollY > 10) {
      nav.classList.add("shadow-lg", "shadow-rose-100");
    } else {
      nav.classList.remove("shadow-lg", "shadow-rose-100");
    }
  };

  toggleShadow();
  window.addEventListener("scroll", toggleShadow, { passive: true });
}

window.addEventListener("error", () => {
  const errorPage = document.querySelector("[data-error-page]");
  if (errorPage) {
    return;
  }
  window.location.href = "404.html";
});
