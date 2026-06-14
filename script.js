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
    question: "What do you need?",
    hint: "Select the service that best describes your situation.",
    options: [
      { id: "rent", label: "Rent a golf cart", desc: "Lake Las Vegas & Las Vegas area rentals", icon: "calendar", next: "rent-need" },
      { id: "service", label: "Service my golf cart", desc: "Maintenance, repairs & upgrades", icon: "wrench", next: "service-need" },
      { id: "buy", label: "Buy a golf cart", desc: "New or used — personal, neighborhood, or fleet", icon: "cart", next: "buy-use" },
      { id: "battery", label: "Battery service", desc: "Lithium upgrade or lead-acid replacement", icon: "battery", next: "battery-need" },
      { id: "unsure", label: "I'm not sure", desc: "We'll point you to the right service", icon: "help", next: "unsure-help" },
    ],
  },
  "buy-use": {
    progress: 66,
    question: "Who is the golf cart for?",
    hint: "This helps us match you with the right new or used cart.",
    options: [
      { id: "personal", label: "Personal use", desc: "Individual owner at home or lake community", icon: "home", result: "buy-personal" },
      { id: "commercial", label: "Business or corporate fleet", desc: "Resort, commercial property, or organization", icon: "building", result: "buy-commercial" },
      { id: "street-legal", label: "Street-legal LSV", desc: "Neighborhood cart licensed for roads", icon: "cart", result: "buy-lsv" },
      { id: "test-drive", label: "Schedule a test drive", desc: "Try a cart before purchasing", icon: "cart", result: "test-drive" },
    ],
  },
  "rent-need": {
    progress: 66,
    question: "What type of rental do you need?",
    hint: "We rent golf carts throughout Lake Las Vegas and the Las Vegas area.",
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
      { id: "replace", label: "Replace lead-acid batteries", desc: "Traditional flooded or AGM pack replacement", icon: "battery", result: "battery-replace" },
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
    title: "Personal golf cart sales",
    text: "We sell new and used golf carts for personal use in Lake Las Vegas, Henderson, and the Las Vegas area. In-stock EPIC models start at $9,000.00.",
    primary: { label: "View Carts for Sale", href: "#inventory" },
    secondary: { label: "Request a Sales Quote", href: "#contact", inquiry: "buy" },
  },
  "buy-commercial": {
    title: "Business & corporate fleet carts",
    text: "We provide golf carts for business and corporate fleet use including resorts, commercial properties, and organizations. Contact us for fleet pricing on new and used carts.",
    primary: { label: "View Inventory", href: "#inventory" },
    secondary: { label: "Request Fleet Pricing", href: "#contact", inquiry: "buy" },
  },
  "buy-lsv": {
    title: "Street-legal neighborhood carts",
    text: "We sell street-legal LSV golf carts suited for lake communities and HOA neighborhoods. EPIC and ICON models available.",
    primary: { label: "View Carts for Sale", href: "#inventory" },
    secondary: { label: "Ask About LSV Carts", href: "#contact", inquiry: "buy" },
  },
  "test-drive": {
    title: "Schedule a test drive",
    text: "Visit our Lake Las Vegas area dealership to test drive a golf cart before you buy. Call or submit a request to schedule.",
    primary: { label: "Schedule a Test Drive", href: "#contact", inquiry: "test-drive" },
    secondary: { label: "View Inventory", href: "#inventory" },
  },
  "rent-general": {
    title: "Golf cart rentals — Lake Las Vegas & Las Vegas",
    text: "Rentals are our primary service. We provide golf carts for Lake Las Vegas, Henderson, and throughout the greater Las Vegas area.",
    primary: { label: "Rental Information", href: "#rentals" },
    secondary: { label: "Request a Rental Quote", href: "#contact", inquiry: "rent" },
  },
  "rent-weekend": {
    title: "Weekend golf cart rental",
    text: "Rent a golf cart for a weekend at Lake Las Vegas or elsewhere in the Las Vegas area. Daily and multi-day rates available.",
    primary: { label: "Request a Rental Quote", href: "#contact", inquiry: "rent" },
    secondary: { label: "Rental Details", href: "#rentals" },
  },
  "rent-event": {
    title: "Event & wedding rentals",
    text: "We rent multiple golf carts for weddings, parties, and corporate events in Lake Las Vegas and the Las Vegas area. Group rates available.",
    primary: { label: "Request Event Rental Quote", href: "#contact", inquiry: "rent" },
    secondary: { label: "Learn About Rentals", href: "#rentals" },
  },
  "rent-tour": {
    title: "Multi-day tour rental",
    text: "Extended golf cart rentals for tours and sightseeing across the Las Vegas area. Delivery available within our service area.",
    primary: { label: "Get Rental Pricing", href: "#contact", inquiry: "rent" },
    secondary: { label: "Rental Information", href: "#rentals" },
  },
  "rent-long": {
    title: "Long-term rental",
    text: "Weekly and monthly golf cart rentals available for Lake Las Vegas residents and Las Vegas area customers.",
    primary: { label: "Request Long-Term Quote", href: "#contact", inquiry: "rent" },
    secondary: { label: "Rental Details", href: "#rentals" },
  },
  "service-maint": {
    title: "Golf cart maintenance",
    text: "Routine maintenance and tune-ups for golf cart owners in Lake Las Vegas, Henderson, and the Las Vegas area.",
    primary: { label: "Schedule Service", href: "#contact", inquiry: "service" },
    secondary: { label: "View Service Details", href: "#service" },
  },
  "service-repair": {
    title: "Golf cart repair",
    text: "Mechanical and electrical golf cart repairs performed by our Henderson-area service team.",
    primary: { label: "Submit Service Request", href: "#contact", inquiry: "service" },
    secondary: { label: "Call (702) 577-2222", href: "tel:7025772222" },
  },
  "service-lsv": {
    title: "Street-legal LSV compliance",
    text: "LSV compliance upgrades for neighborhood and street-legal golf carts including safety and regulatory requirements.",
    primary: { label: "Schedule Service", href: "#contact", inquiry: "service" },
    secondary: { label: "Service Information", href: "#service" },
  },
  "service-urgent": {
    title: "Urgent service needed",
    text: "If your golf cart won't run, call (702) 577-2222 or submit a priority service request. We serve Lake Las Vegas and the Las Vegas area.",
    primary: { label: "Priority Service Request", href: "#contact", inquiry: "service" },
    secondary: { label: "Call Now", href: "tel:7025772222" },
  },
  "battery-lithium": {
    title: "Lithium battery upgrade",
    text: "Complete lithium battery replacement systems from $2,700.00 with professional installation. Ideal for Nevada heat and daily use.",
    primary: { label: "Request Battery Quote", href: "#contact", inquiry: "battery" },
    secondary: { label: "Battery Information", href: "#battery" },
  },
  "battery-replace": {
    title: "Lead-acid battery replacement",
    text: "We replace lead-acid battery packs and test charging systems to restore reliable power to your golf cart.",
    primary: { label: "Request Battery Quote", href: "#contact", inquiry: "battery" },
    secondary: { label: "Battery Services", href: "#battery" },
  },
  "battery-help": {
    title: "Battery diagnosis",
    text: "Not sure whether you need lithium or lead-acid replacement? Our technicians will assess your cart and recommend the right solution.",
    primary: { label: "Contact Our Team", href: "#contact", inquiry: "battery" },
    secondary: { label: "Battery Information", href: "#battery" },
  },
  "call-now": {
    title: "Speak with our team",
    text: "Call (702) 577-2222 to discuss rentals, service, battery work, or new and used golf cart sales. We serve Lake Las Vegas, Henderson, and Las Vegas.",
    primary: { label: "Call (702) 577-2222", href: "tel:7025772222" },
    secondary: { label: "Send a Message", href: "#contact", inquiry: "quote" },
  },
  "general-quote": {
    title: "Request a quote",
    text: "Tell us what you need and we will provide pricing for rentals, service, battery work, or golf cart sales.",
    primary: { label: "Get a Quote", href: "#contact", inquiry: "quote" },
    secondary: { label: "View Inventory", href: "#inventory" },
  },
  "browse-inventory": {
    title: "New & used golf carts for sale",
    text: "Browse in-stock new EPIC models. Used carts and fleet packages also available — call for current inventory.",
    primary: { label: "View Carts for Sale", href: "#inventory" },
    secondary: { label: "Request a Sales Quote", href: "#contact", inquiry: "buy" },
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
        <p class="need-finder-certainty">Recommended next step based on your answers:</p>
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
