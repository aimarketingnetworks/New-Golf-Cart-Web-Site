const FORM_EMAIL = "sales@lakelasvegasgolfcarts.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

async function sendForm(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Form submission failed");
  }

  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  navToggle?.addEventListener("click", () => {
    nav.classList.toggle("mobile-open");
    navToggle.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("mobile-open");
      navToggle.classList.remove("active");
    });
  });

  const contactForm = document.getElementById("contact-form");
  const newsletterForm = document.getElementById("newsletter-form");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const success = contactForm.querySelector(".form-success");
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      await sendForm({
        _subject: "Lake Las Vegas Golf Carts — Contact Form",
        _template: "table",
        "First Name": contactForm.querySelector("#first-name").value,
        "Last Name": contactForm.querySelector("#last-name").value,
        Email: contactForm.querySelector("#email").value,
        Phone: contactForm.querySelector("#phone").value || "Not provided",
        "Inquiry Type": contactForm.querySelector("#inquiry-type").value,
        Message: contactForm.querySelector("#message").value,
      });

      success?.classList.add("visible");
      contactForm.reset();
      setTimeout(() => success?.classList.remove("visible"), 5000);
    } catch {
      alert("Something went wrong. Please call us at (702) 577-2222 or email sales@lakelasvegasgolfcarts.com.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  newsletterForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector("input[type=email]");
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    if (!emailInput?.value) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Subscribing...";

    try {
      await sendForm({
        _subject: "Lake Las Vegas Golf Carts — Newsletter Signup",
        Email: emailInput.value,
        Message: "New newsletter subscription request",
      });

      alert("Thank you for subscribing! We'll send you exclusive offers soon.");
      newsletterForm.reset();
    } catch {
      alert("Something went wrong. Please email sales@lakelasvegasgolfcarts.com to subscribe.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document
    .querySelectorAll(".cart-card, .action-card, .feature-section")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  const style = document.createElement("style");
  style.textContent = ".visible { opacity: 1 !important; transform: translateY(0) !important; }";
  document.head.appendChild(style);
});
