document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Footer year
  // =========================
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
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(typeLoop, pauseAfterDelete);
      }
    }
  }
  typeLoop();

  const nav = document.getElementById("siteNav");
  const navH = nav ? nav.offsetHeight : 0;
  const OFFSET = navH + 40;

  document.documentElement.style.scrollPaddingTop = `${OFFSET}px`;

  const navLinks = document.querySelectorAll('#siteNav a[href^="#"]');

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });

      const collapse = document.getElementById("navLinks");
      if (collapse && collapse.classList.contains("show") && window.bootstrap?.Collapse) {
        const bsCollapse =
          bootstrap.Collapse.getInstance(collapse) ||
          new bootstrap.Collapse(collapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  const guestbookHost = document.getElementById("vueGuestbook");
  if (guestbookHost) {
    const card = guestbookHost.closest(".profile-card");
    if (card) card.remove();
  }

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && !document.getElementById("vueContactGuestbook")) {
    const mount = document.createElement("div");
    mount.id = "vueContactGuestbook";
    mount.className = "mt-3";
    form.appendChild(mount);
  }

  function saveToGuestbook(entry) {
    const key = "guestbookEntries";
    const saved = localStorage.getItem(key);
    const arr = saved ? JSON.parse(saved) : [];
    arr.unshift(entry);
    localStorage.setItem(key, JSON.stringify(arr));
    window.dispatchEvent(new Event("guestbook:updated"));
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        if (status) status.textContent = "Please fix the errors above.";
        return;
      }

      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const msgEl = document.getElementById("message");

      saveToGuestbook({
        name: nameEl ? nameEl.value.trim() : "",
        email: emailEl ? emailEl.value.trim() : "",
        message: msgEl ? msgEl.value.trim() : "",
        time: new Date().toLocaleString()
      });

      form.classList.add("was-validated");
      if (status) status.textContent = "Message sent (demo). Thank you!";
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  function showToast(text) {
    const toast = document.getElementById("copyToast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1200);
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    } finally {
      document.body.removeChild(ta);
    }
    return ok;
  }

  async function copyText(text) {
    const value = (text || "").trim();
    if (!value) return { ok: false, value: "" };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return { ok: true, value };
      }
    } catch {
    }

    const ok = fallbackCopy(value);
    return { ok, value };
  }

  // =========================
  // Copy my email button
  // =========================
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const myEmail = document.getElementById("myEmail");

  if (copyEmailBtn && myEmail) {
    copyEmailBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const { ok, value } = await copyText(myEmail.textContent);
      if (ok) {
        if (status) status.textContent = "Email copied!";
        showToast(`Copied: ${value}`);
      } else {
        if (status) status.textContent = "Copy failed — please copy manually.";
        showToast("Copy failed");
      }
    });
  }

  // =========================
  // Copy social buttons
  // =========================
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn, [data-copy]");
    if (!btn) return;

    e.preventDefault();

    let value = btn.getAttribute("data-copy");

    if (!value) {
      const row = btn.closest(".social-item") || btn.closest("li") || btn.closest("div");
      const handleEl = row ? row.querySelector(".social-handle") : null;
      value = handleEl ? handleEl.textContent : "";
    }

    const result = await copyText(value);

    if (result.ok) {
      showToast(`Copied: ${result.value}`);
    } else {
      showToast("Copy failed");
      if (!document.getElementById("copyToast")) {
        alert("Copy failed — please copy manually.");
      }
    }
  });
});
