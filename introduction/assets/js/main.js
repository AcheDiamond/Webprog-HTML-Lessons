// Typing intro
const roles = [
  "Computer Science Student",
  "Cybersecurity & Forensics Learner",
  "Chopped Asian boi"
];

const typingEl = document.getElementById("typingText");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    typingEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 250);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}
typeLoop();

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    statusEl.textContent = "Please fix the highlighted fields.";
    return;
  }

  form.classList.remove("was-validated");
  statusEl.textContent = "Validated successfully! (Demo only — no backend.)";
  form.reset();
});

document.getElementById("copyEmailBtn").addEventListener("click", async () => {
  const email = document.getElementById("myEmail").textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    statusEl.textContent = "Email copied to clipboard!";
  } catch {
    statusEl.textContent = "Copy failed (browser blocked clipboard).";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("siteNav");

  const offset = nav ? nav.offsetHeight + 16 : 110;

  document.documentElement.style.scrollPaddingTop = offset + "px";
  document.querySelectorAll("header[id], section[id]").forEach((el) => {
    el.style.scrollMarginTop = offset + "px";
  });

  const existing = bootstrap.ScrollSpy.getInstance(document.body);
  if (existing) existing.dispose();

  new bootstrap.ScrollSpy(document.body, {
    target: "#siteNav",
    offset: offset
  });
});

