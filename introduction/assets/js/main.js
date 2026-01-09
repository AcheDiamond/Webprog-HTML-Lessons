document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Typing effect (Hero)
  // =========================
  const typingEl = document.getElementById("typingText");
  const words = ["Chopped Asian boi", "Computer Science Student", "Blue Lover"];

  let wi = 0;
  let ci = 0;
  let deleting = false;

  const typingSpeed = 70;
  const deletingSpeed = 45;
  const pauseAfterType = 1100;
  const pauseAfterDelete = 350;

  function typeLoop() {
    if (!typingEl) return;

    const word = words[wi];

    if (!deleting) {
      typingEl.textContent = word.slice(0, ci + 1);
      ci++;

      if (ci < word.length) {
        setTimeout(typeLoop, typingSpeed);
      } else {
        // Pause then start deleting
        setTimeout(() => {
          deleting = true;
          typeLoop();
        }, pauseAfterType);
      }
    } else {
      typingEl.textContent = word.slice(0, ci - 1);
      ci--;

      if (ci > 0) {
        setTimeout(typeLoop, deletingSpeed);
      } else {
        // Move to next word
        deleting = false;
        wi = (wi + 1) % words.length;

        setTimeout(typeLoop, pauseAfterDelete);
      }
    }
  }

  typeLoop();

  const nav = document.getElementById("siteNav");
  const navH = nav ? nav.offsetHeight : 0;

  document.documentElement.style.scrollPaddingTop = `${navH + 12}px`;

  if (nav && window.bootstrap?.ScrollSpy) {
    const existing = bootstrap.ScrollSpy.getInstance(document.body);
    if (existing) existing.dispose();

    new bootstrap.ScrollSpy(document.body, {
      target: "#siteNav",
      offset: navH + 12
    });
  }

  const navLinks = document.querySelectorAll('#siteNav a.nav-link[href^="#"]');

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
      window.scrollTo({ top: y, behavior: "smooth" });

      navLinks.forEach((x) => x.classList.remove("active"));
      a.classList.add("active");

      const collapse = document.getElementById("navLinks");
      if (collapse && collapse.classList.contains("show") && window.bootstrap?.Collapse) {
        const bsCollapse =
          bootstrap.Collapse.getInstance(collapse) ||
          new bootstrap.Collapse(collapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // =========================
  // Contact form validation (demo)
  // =========================
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        if (status) status.textContent = "Please fix the errors above.";
        return;
      }

      form.classList.add("was-validated");
      if (status) status.textContent = "Message sent (demo). Thank you!";
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  // Copy email button
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const myEmail = document.getElementById("myEmail");

  if (copyEmailBtn && myEmail) {
    copyEmailBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(myEmail.textContent.trim());
        if (status) status.textContent = "Email copied!";
      } catch {
        if (status) status.textContent = "Copy failed — please copy manually.";
      }
    });
  }

  // Copy social handles (buttons)
  const toast = document.getElementById("copyToast");

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
        if (toast) {
          toast.textContent = `Copied: ${value}`;
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 1200);
        }
      } catch {
        if (toast) {
          toast.textContent = "Copy failed";
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 1200);
        }
      }
    });
  });
});
