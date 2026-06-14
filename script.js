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

  initNeedFinder();
  applyInquiryFromUrl();
  initInquiryLinks();

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
    .querySelectorAll(".cart-card, .feature-section")
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

const FINDER_ICONS = {
  cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  calendar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  wrench: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  battery: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
  help: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  building: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
  users: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  check: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
};

const FINDER_STEPS = {
  start: {
    progress: 33,
    question: "What's your goal today?",
    hint: "Pick one — we'll take you straight to the right solution.",
    options: [
      { id: "rent", label: "Rent a golf cart", desc: "Our #1 specialty — book with certainty", icon: "calendar", next: "rent-need" },
      { id: "service", label: "Service my golf cart", desc: "Expert repairs — back on the road fast", icon: "wrench", next: "service-need" },
      { id: "buy", label: "Buy a golf cart", desc: "In-stock EPIC & ICON — lock in pricing", icon: "cart", next: "buy-use" },
      { id: "battery", label: "Battery help", desc: "Lithium upgrades & replacements", icon: "battery", next: "battery-need" },
      { id: "unsure", label: "I'm not sure yet", desc: "We'll help you figure it out", icon: "help", next: "unsure-help" },
    ],
  },
  "buy-use": {
    progress: 66,
    question: "What will you use the cart for?",
    hint: "This helps us recommend the right models and pricing.",
    options: [
      { id: "personal", label: "Personal & neighborhood", desc: "Lake community, HOA, or home use", icon: "home", result: "buy-personal" },
      { id: "commercial", label: "Commercial property", desc: "Resort, HOA fleet, or business", icon: "building", result: "buy-commercial" },
      { id: "street-legal", label: "Street-legal LSV", desc: "Licensed for roads up to 25 mph", icon: "cart", result: "buy-lsv" },
      { id: "test-drive", label: "Schedule a test drive", desc: "Try before you buy", icon: "cart", result: "test-drive" },
    ],
  },
  "rent-need": {
    progress: 66,
    question: "When do you need the cart?",
    hint: "Peak dates fill up — the sooner you reserve, the more certain you are.",
    options: [
      { id: "weekend", label: "Weekend getaway", desc: "1–3 days around the lake", icon: "calendar", result: "rent-weekend" },
      { id: "event", label: "Wedding or special event", desc: "Group carts for guests", icon: "heart", result: "rent-event" },
      { id: "tour", label: "Multi-day tour", desc: "Extended trips & sightseeing", icon: "users", result: "rent-tour" },
      { id: "long-term", label: "Longer-term rental", desc: "Weekly or monthly needs", icon: "calendar", result: "rent-long" },
    ],
  },
  "service-need": {
    progress: 66,
    question: "What does your cart need?",
    hint: "Our service team handles everything from tune-ups to full repairs.",
    options: [
      { id: "maintenance", label: "Routine maintenance", desc: "Tune-ups, tires, brakes & fluids", icon: "wrench", result: "service-maint" },
      { id: "repair", label: "Something isn't working", desc: "Electrical, mechanical, or performance", icon: "wrench", result: "service-repair" },
      { id: "lsv", label: "Street-legal compliance", desc: "LSV upgrades & safety requirements", icon: "cart", result: "service-lsv" },
      { id: "urgent", label: "Cart won't run", desc: "Priority service request", icon: "wrench", result: "service-urgent" },
    ],
  },
  "battery-need": {
    progress: 66,
    question: "What battery help do you need?",
    hint: "Complete lithium systems start at $2,700.00.",
    options: [
      { id: "lithium", label: "Upgrade to lithium", desc: "Longer range, less maintenance", icon: "battery", result: "battery-lithium" },
      { id: "replace", label: "Replace my batteries", desc: "Old or failing battery pack", icon: "battery", result: "battery-replace" },
      { id: "unsure-battery", label: "Not sure what's needed", desc: "We'll diagnose and recommend", icon: "help", result: "battery-help" },
    ],
  },
  "unsure-help": {
    progress: 66,
    question: "How would you like to connect?",
    hint: "Our team can walk you through every option.",
    options: [
      { id: "call", label: "Call us now", desc: "(702) 577-2222 — any day, any time", icon: "help", result: "call-now" },
      { id: "rent", label: "Request a rental", desc: "Our most popular service", icon: "calendar", result: "rent-general" },
      { id: "service", label: "Schedule service", desc: "Maintenance or repairs", icon: "wrench", result: "service-maint" },
      { id: "browse-sales", label: "Browse carts for sale", desc: "See in-stock models & pricing", icon: "cart", result: "browse-inventory" },
    ],
  },
};

const FINDER_RESULTS = {
  "buy-personal": {
    title: "You've made the right call",
    text: "Owning a cart for lake life is a great decision. Our in-stock EPIC models start at $9,000.00 — absolutely the best value in Nevada.",
    primary: { label: "See What's In Stock", href: "#inventory" },
    secondary: { label: "Lock In My Quote", href: "#contact", inquiry: "quote" },
  },
  "buy-commercial": {
    title: "Fleet & commercial — we've got you",
    text: "We'll put together the best fleet pricing on EPIC and ICON models. No runaround — just straight numbers.",
    primary: { label: "View Inventory", href: "#inventory" },
    secondary: { label: "Get Fleet Pricing Now", href: "#contact", inquiry: "quote" },
  },
  "buy-lsv": {
    title: "Street-legal LSV — done right",
    text: "Our EPIC and ICON street-legal LSVs are in stock and fully compliant. You'll drive off with total peace of mind.",
    primary: { label: "Shop Street-Legal Carts", href: "#inventory" },
    secondary: { label: "Talk to an Expert", href: "#contact", inquiry: "buy" },
  },
  "test-drive": {
    title: "Smart move — test drive first",
    text: "You'll know within five minutes if it's the right cart. Let's schedule your drive — no pressure, just certainty.",
    primary: { label: "Schedule My Test Drive", href: "#contact", inquiry: "test-drive" },
    secondary: { label: "Browse Inventory", href: "#inventory" },
  },
  "rent-general": {
    title: "Rentals are what we do best",
    text: "Without a doubt, we'll find the right cart for your dates. Multi-day and group rates that beat the competition.",
    primary: { label: "See Rental Options", href: "#rentals" },
    secondary: { label: "Yes — Reserve My Rental", href: "#contact", inquiry: "rent" },
  },
  "rent-weekend": {
    title: "Weekend sorted — let's lock it in",
    text: "Picture yourself cruising the lake Saturday morning. We'll make that happen — but weekend carts go fast.",
    primary: { label: "Reserve My Weekend Cart", href: "#contact", inquiry: "rent" },
    secondary: { label: "See Rental Details", href: "#rentals" },
  },
  "rent-event": {
    title: "Your event deserves this",
    text: "Weddings and group events are our specialty. 2, 4, and 6-passenger carts — delivered and ready. Absolutely stress-free.",
    primary: { label: "Yes — Book Event Carts", href: "#contact", inquiry: "rent" },
    secondary: { label: "Learn More", href: "#rentals" },
  },
  "rent-tour": {
    title: "Multi-day tour — perfect fit",
    text: "Extended trips need reliable carts and fair pricing. We've got both — delivery included.",
    primary: { label: "Get My Tour Pricing", href: "#contact", inquiry: "rent" },
    secondary: { label: "Explore Rentals", href: "#rentals" },
  },
  "rent-long": {
    title: "Long-term rental — smart choice",
    text: "Weekly and monthly rates that make sense. Call us and we'll put together a number you'll feel great about.",
    primary: { label: "Lock In Long-Term Rate", href: "#contact", inquiry: "rent" },
    secondary: { label: "Rental Info", href: "#rentals" },
  },
  "service-maint": {
    title: "Maintenance keeps you moving",
    text: "Don't wait for a breakdown. Routine service now means zero surprises later — that's certainty.",
    primary: { label: "Yes — Book My Service", href: "#contact", inquiry: "service" },
    secondary: { label: "View Services", href: "#service" },
  },
  "service-repair": {
    title: "We'll fix it — guaranteed effort",
    text: "Something's off? Our techs diagnose fast and repair right. You'll be back on the cart path before you know it.",
    primary: { label: "Submit Service Request", href: "#contact", inquiry: "service" },
    secondary: { label: "Call (702) 577-2222", href: "tel:7025772222" },
  },
  "service-lsv": {
    title: "LSV compliance — handled",
    text: "Street-legal requirements are non-negotiable. We'll upgrade your cart to full compliance — done professionally.",
    primary: { label: "Schedule Compliance Work", href: "#contact", inquiry: "service" },
    secondary: { label: "Service Details", href: "#service" },
  },
  "service-urgent": {
    title: "Cart down? We're on it.",
    text: "Call (702) 577-2222 now — or submit a priority request below. We treat urgent jobs with urgency. Period.",
    primary: { label: "Priority Service Request", href: "#contact", inquiry: "service" },
    secondary: { label: "Call Now", href: "tel:7025772222" },
  },
  "battery-lithium": {
    title: "Lithium upgrade — worth every penny",
    text: "Complete systems from $2,700.00. Longer range, less maintenance, built for desert heat. You'll feel the difference immediately.",
    primary: { label: "Lock In Battery Quote", href: "#contact", inquiry: "battery" },
    secondary: { label: "Learn More", href: "#battery" },
  },
  "battery-replace": {
    title: "Time for new batteries",
    text: "We'll assess your pack and recommend the best path — including full lithium conversion if it makes sense for you.",
    primary: { label: "Get My Battery Quote", href: "#contact", inquiry: "battery" },
    secondary: { label: "Battery Info", href: "#battery" },
  },
  "battery-help": {
    title: "Not sure? We'll diagnose it",
    text: "Our battery specialists will tell you exactly what you need — no upsell, no guesswork. Just a straight answer.",
    primary: { label: "Talk to a Specialist", href: "#contact", inquiry: "battery" },
    secondary: { label: "Battery Services", href: "#battery" },
  },
  "call-now": {
    title: "Best move — call now",
    text: "You'll get a real person who can answer every question in under two minutes. (702) 577-2222 — any day, any time.",
    primary: { label: "Call (702) 577-2222", href: "tel:7025772222" },
    secondary: { label: "Send a Quick Message", href: "#contact", inquiry: "quote" },
  },
  "general-quote": {
    title: "Let's get you a number",
    text: "Tell us what you need and we'll come back with the best price — fast, fair, and no games.",
    primary: { label: "Get My Quote", href: "#contact", inquiry: "quote" },
    secondary: { label: "Browse Inventory", href: "#inventory" },
  },
  "browse-inventory": {
    title: "Here's what's in stock",
    text: "EPIC models from $9,000.00 — limited availability. When you see the right one, lock in the price before it's gone.",
    primary: { label: "View Carts for Sale", href: "#inventory" },
    secondary: { label: "Lock In My Quote", href: "#contact", inquiry: "quote" },
  },
};

function initNeedFinder() {
  const body = document.getElementById("need-finder-body");
  const progress = document.getElementById("finder-progress");
  const backBtn = document.getElementById("finder-back");
  const resetBtn = document.getElementById("finder-reset");
  if (!body) return;

  const history = ["start"];

  const renderStep = (stepId) => {
    const step = FINDER_STEPS[stepId];
    progress.style.width = `${step.progress}%`;
    backBtn.hidden = history.length <= 1;
    resetBtn.hidden = history.length <= 1;

    body.innerHTML = `
      <div class="need-finder-step">
        <p class="need-finder-question">${step.question}</p>
        <p class="need-finder-hint">${step.hint}</p>
        <div class="need-finder-options">
          ${step.options.map((opt) => `
            <button type="button" class="need-finder-option" data-next="${opt.next || ""}" data-result="${opt.result || ""}">
              <span class="need-finder-option-icon">${FINDER_ICONS[opt.icon] || ""}</span>
              <span class="need-finder-option-text">
                <strong>${opt.label}</strong>
                <span>${opt.desc}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    body.querySelectorAll(".need-finder-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.next;
        const result = btn.dataset.result;
        if (next) {
          history.push(next);
          renderStep(next);
        } else if (result) {
          renderResult(result);
        }
      });
    });
  };

  const renderResult = (resultId) => {
    const result = FINDER_RESULTS[resultId];
    progress.style.width = "100%";
    backBtn.hidden = false;
    resetBtn.hidden = false;

    body.innerHTML = `
      <div class="need-finder-result">
        <div class="need-finder-result-icon">${FINDER_ICONS.check}</div>
        <h3>${result.title}</h3>
        <p>${result.text}</p>
        <p class="need-finder-certainty">You're in the right place — let's move forward.</p>
        <div class="need-finder-result-actions">
          <a href="${result.primary.href}" class="btn btn-primary finder-cta" data-inquiry="${result.primary.inquiry || ""}">${result.primary.label}</a>
          ${result.secondary ? `<a href="${result.secondary.href}" class="btn btn-outline-dark finder-cta" data-inquiry="${result.secondary.inquiry || ""}">${result.secondary.label}</a>` : ""}
        </div>
      </div>
    `;

    body.querySelectorAll(".finder-cta").forEach((link) => {
      link.addEventListener("click", (e) => {
        const inquiry = link.dataset.inquiry;
        if (inquiry) {
          sessionStorage.setItem("llvgc-inquiry", inquiry);
        }
        if (link.getAttribute("href")?.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute("href"));
          if (inquiry) applyInquiryPreset(inquiry);
          target?.scrollIntoView({ behavior: "smooth" });
          history.replaceState?.(null, "", link.getAttribute("href"));
        }
      });
    });
  };

  backBtn.addEventListener("click", () => {
    if (history.length > 1) {
      history.pop();
      renderStep(history[history.length - 1]);
    }
  });

  resetBtn.addEventListener("click", () => {
    history.length = 1;
    history[0] = "start";
    renderStep("start");
  });

  renderStep("start");
}

function applyInquiryPreset(inquiry) {
  const select = document.getElementById("inquiry-type");
  if (select && inquiry) select.value = inquiry;
}

function applyInquiryFromUrl() {
  const hash = window.location.hash;
  const stored = sessionStorage.getItem("llvgc-inquiry");
  const inquiry = stored || (hash === "#contact" ? new URLSearchParams(window.location.search).get("inquiry") : null);
  if (inquiry) {
    applyInquiryPreset(inquiry);
    sessionStorage.removeItem("llvgc-inquiry");
  }
}

function initInquiryLinks() {
  document.querySelectorAll("[data-inquiry]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const inquiry = link.dataset.inquiry;
      const href = link.getAttribute("href");
      if (!inquiry || !href?.startsWith("#")) return;
      e.preventDefault();
      applyInquiryPreset(inquiry);
      sessionStorage.setItem("llvgc-inquiry", inquiry);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}
