document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        item.classList.toggle('active');
      });
    });
});

// Animación de máquina de escribir para .typewrite
document.addEventListener("DOMContentLoaded", function () {
  const el = document.querySelector(".typewrite");
  if (!el) return;

  const words = JSON.parse(el.getAttribute("data-words"));
  let txt = '';
  let isDeleting = false;
  let wordIndex = 0;

  function type() {
    const fullTxt = words[wordIndex];

    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length - 1);
    } else {
      txt = fullTxt.substring(0, txt.length + 1);
    }

    el.textContent = txt;

    let delta = isDeleting ? 90 : 180;

    if (!isDeleting && txt === fullTxt) {
      delta = 1500;
      isDeleting = true;
    } else if (isDeleting && txt === '') {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delta = 500;
    }

    setTimeout(type, delta);
  }

  type();
});



document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".integration-btn");

  // Agrega la clase 'active' por defecto al botón 'Tiendanube'
  const defaultButton = Array.from(buttons).find(btn => btn.textContent.trim() === "Tiendanube");
  if (defaultButton) defaultButton.classList.add("active");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Quita la clase activa de todos los botones
      buttons.forEach(b => b.classList.remove("active"));

      // Agrega la clase activa al que se clickeó
      btn.classList.add("active");
    });
  });
});

// Scroll-Activated Sticky Navigation
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav");
  if (!nav) return;
  const navTop = nav.offsetTop;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY >= navTop + nav.offsetHeight) {
      nav.classList.add("stuck");
    } else {
      nav.classList.remove("stuck");
    }
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-center a, .nav-auth a");

  function activateCurrentNavLink() {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateCurrentNavLink);
  activateCurrentNavLink();
});