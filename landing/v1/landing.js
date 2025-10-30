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

// PTS Floating Navbar: active link + mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("ptsMenuToggle");
  const navLinksContainer = document.getElementById("ptsNavLinks");
  const navLinks = document.querySelectorAll(".pts-nav__links a[href^='#']"); // solo anchors internos
  const sections = document.querySelectorAll("section[id]");

  // Toggle mobile menu
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("pts-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cerrar al hacer click en un link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("pts-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      const clickOutside =
        !menuToggle.contains(e.target) && !navLinksContainer.contains(e.target);
      if (clickOutside) {
        navLinksContainer.classList.remove("pts-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Activar link según scroll
  function updateActiveLink() {
    let currentId = "";
    const offsetTrigger = 200; // margen para activar antes

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      if (window.scrollY >= top - offsetTrigger) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("pts-active");
      const href = link.getAttribute("href");
      if (href && currentId && href === `#${currentId}`) {
        link.classList.add("pts-active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
  window.addEventListener("hashchange", updateActiveLink);
  updateActiveLink();
});

// Inline contact form handling logic moved from HTML to JS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contacto');
  const submitBtn = document.getElementById('contacto-submit-btn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mensaje enviado correctamente.';
        // Optionally clear the form fields
        form.reset();
      } else {
        submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
      }
    })
    .catch(() => {
      submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
    });
  });
});
