const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const formResult = document.querySelector("[data-form-result]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-category]");
const galleries = document.querySelectorAll("[data-gallery]");

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projects.forEach((project) => {
      project.hidden = selectedCategory !== "todos" && project.dataset.category !== selectedCategory;
    });
  });
});

galleries.forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const current = gallery.querySelector("[data-gallery-current]");
  let activeIndex = 0;
  let touchStartX = 0;

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    if (current) current.textContent = String(activeIndex + 1);
  };

  gallery.querySelector("[data-gallery-prev]")?.addEventListener("click", () => showSlide(activeIndex - 1));
  gallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => showSlide(activeIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });

  gallery.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  gallery.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const message = [
    "Hola Zarumi, quisiera hacer una consulta.",
    "",
    `Nombre: ${data.get("nombre")}`,
    `Localidad: ${data.get("localidad")}`,
    `Proyecto: ${data.get("proyecto")}`,
    `Contacto: ${data.get("contacto")}`,
    "",
    `Detalle: ${data.get("mensaje")}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/5491171228488?text=${encodeURIComponent(message)}`;
  whatsappLink?.setAttribute("href", whatsappUrl);
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  formResult.hidden = false;
  formResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
