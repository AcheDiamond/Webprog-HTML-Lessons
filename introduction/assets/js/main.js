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

/* ========= DOM ready ========= */
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form validation (demo)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if(!form.checkValidity()){
        e.stopPropagation();
        form.classList.add("was-validated");
        if(status) status.textContent = "Please fix the highlighted fields.";
        return;
      }
      form.classList.add("was-validated");
      if(status) status.textContent = "Message sent (demo only). Thanks!";
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  // Copy email button
  const copyBtn = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("myEmail");
  if(copyBtn && emailText){
    copyBtn.addEventListener("click", async () => {
      const raw = (emailText.textContent || "").trim();
      const email = raw.split(" ")[0]; // keep email only
      try{
        await navigator.clipboard.writeText(email);
        if(status) status.textContent = "Email copied!";
      }catch{
        if(status) status.textContent = "Copy failed. Please copy manually.";
      }
    });
  }

  const nav = document.getElementById("siteNav");
  const collapseEl = document.getElementById("navLinks");

  const getOffset = () => (nav ? nav.offsetHeight + 16 : 90);

  const applyScrollOffsets = () => {
    const offset = getOffset();
    document.documentElement.style.scrollPaddingTop = offset + "px";
    document.querySelectorAll("section[id], header[id]").forEach((sec) => {
      sec.style.scrollMarginTop = offset + "px";
    });
  };

  applyScrollOffsets();
  window.addEventListener("resize", applyScrollOffsets);

  document.querySelectorAll('#siteNav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if(!href || href === "#") return;

      const target = document.querySelector(href);
      if(!target) return;

      e.preventDefault();

      const doScroll = () => {
        const offset = getOffset();
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      };

      if(collapseEl && collapseEl.classList.contains("show") && window.bootstrap){
        const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
        bsCollapse.hide();
        setTimeout(() => {
          applyScrollOffsets();
          doScroll();
        }, 250);
      } else {
        doScroll();
      }
    });
  });
});
