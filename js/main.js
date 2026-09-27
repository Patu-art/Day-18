const booking = document.querySelector("#booking");
const panel = booking.querySelector(".booking-panel");
const steps = [...document.querySelectorAll(".booking-step")];
const stepDots = [...document.querySelectorAll("[data-stepdot]")];

const state = {
  step: 1,
  texture: "",
  goal: "",
  services: [],
  location: "",
  slot: ""
};

const catalogue = [
  { name: "Wash, cut and style", price: 65, duration: 50, tags: ["Change my shape", "Straight / wavy"] },
  { name: "Curly hair restyle, wash & finish", price: 65, duration: 60, tags: ["Change my shape", "Curly"] },
  { name: "Afro restyle, wash & blow", price: 65, duration: 60, tags: ["Change my shape", "Afro / coily"] },
  { name: "Trim, wash & style", price: 50, duration: 45, tags: ["Tidy / trim"] },
  { name: "Dry restyle / scissors cut", price: 40, duration: 30, tags: ["Tidy / trim", "Change my shape"] },
  { name: "Full head of colour", price: 120, duration: 145, tags: ["Colour"], consultation: true },
  { name: "Balayage — full head", price: 205, duration: 150, tags: ["Colour"], consultation: true },
  { name: "Highlights — half head", price: 140, duration: 105, tags: ["Colour"], consultation: true },
  { name: "Roots touch up", price: 100, duration: 95, tags: ["Colour"], consultation: true },
  { name: "Wash & blowdry", price: 60, duration: 45, tags: ["Style / treat"] },
  { name: "Bond building repair + steam", price: 40, duration: 30, tags: ["Style / treat"] },
  { name: "Silk press / straightening", price: 40, duration: 30, tags: ["Style / treat", "Afro / coily"] }
];

function openBooking() {
  booking.classList.add("open");
  booking.setAttribute("aria-hidden", "false");
  document.body.classList.add("body-lock");
  window.setTimeout(() => booking.querySelector(".close-booking").focus(), 300);
}

function closeBooking() {
  booking.classList.remove("open");
  booking.setAttribute("aria-hidden", "true");
  document.body.classList.remove("body-lock");
}

function showStep(nextStep) {
  state.step = nextStep;
  steps.forEach(step => step.classList.toggle("active", Number(step.dataset.step) === nextStep));
  stepDots.forEach(dot => dot.classList.toggle("active", Number(dot.dataset.stepdot) <= nextStep));

  if (nextStep === 2) renderServices();
  if (nextStep === 4) renderReview();

  panel.scrollTo({ top: 0, behavior: "smooth" });
}

function serviceScore(service) {
  return Number(service.tags.includes(state.goal)) + Number(service.tags.includes(state.texture));
}

function renderServices() {
  const container = document.querySelector("#booking-services");
  const services = [...catalogue].sort((a, b) => serviceScore(b) - serviceScore(a));

  container.innerHTML = services.map(service => {
    const selected = state.services.some(item => item.name === service.name);
    const consultation = service.consultation ? " • consultation + patch test required" : "";
    const match = service.tags.includes(state.goal) ? " • matches your goal" : "";

    return `
      <button class="book-service ${selected ? "selected" : ""}" data-name="${service.name}">
        <b>${service.name}</b>
        <strong>from £${service.price}</strong>
        <small>${service.duration} min${consultation}${match}</small>
      </button>`;
  }).join("");

  container.querySelectorAll(".book-service").forEach(button => {
    button.addEventListener("click", () => toggleService(button.dataset.name));
  });

  updateBasket();
}

function toggleService(name) {
  const service = catalogue.find(item => item.name === name);
  const existingIndex = state.services.findIndex(item => item.name === name);

  if (existingIndex >= 0) state.services.splice(existingIndex, 1);
  else state.services.push(service);

  renderServices();
}

function updateBasket() {
  const total = state.services.reduce((sum, service) => sum + service.price, 0);
  document.querySelector("#basket-count").textContent = state.services.length;
  document.querySelector("#basket-total").textContent = `from £${total}`;
}

function selectLocationButton() {
  document.querySelectorAll("[data-book-location]").forEach(button => {
    button.classList.toggle("selected", button.dataset.bookLocation === state.location);
  });
}

function renderReview() {
  const total = state.services.reduce((sum, service) => sum + service.price, 0);
  const hasColour = state.services.some(service =>
    service.consultation || /colour|balayage|highlight|roots/i.test(service.name)
  );

  document.querySelector("#review-location").textContent = state.location || "Not selected";
  document.querySelector("#review-slot").textContent = state.slot || "Not selected";
  document.querySelector("#review-total").textContent = `from £${total}`;

  document.querySelector("#review-services").innerHTML = state.services.length
    ? state.services.map(service =>
        `<div><span>${service.name}</span><b>from £${service.price}</b></div>`
      ).join("")
    : "<div>No service selected — go back and add one.</div>";

  const confirmButton = document.querySelector("#confirm-demo");
  confirmButton.textContent = hasColour ? "Request colour consultation →" : "Confirm demo booking →";

  document.querySelector(".legal-demo").textContent = hasColour
    ? "Colour requires consultation and patch-test follow-up. Demo only — no request is sent."
    : "Demo only. This button does not create an appointment or take payment.";
}

document.querySelectorAll("[data-open-booking]").forEach(button => button.addEventListener("click", openBooking));
document.querySelectorAll("[data-close-booking]").forEach(button => button.addEventListener("click", closeBooking));
document.addEventListener("keydown", event => { if (event.key === "Escape" && booking.classList.contains("open")) closeBooking(); });

document.querySelectorAll(".choices").forEach(group => {
  group.addEventListener("click", event => {
    if (event.target.tagName !== "BUTTON") return;

    group.querySelectorAll("button").forEach(button => button.classList.remove("selected"));
    event.target.classList.add("selected");
    state[group.dataset.choice] = event.target.dataset.value;

    document.querySelector('[data-step="1"] [data-next]').disabled = !(state.texture && state.goal);
  });
});

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showStep(Math.min(4, state.step + 1)));
});

document.querySelectorAll("[data-service]").forEach(button => {
  button.addEventListener("click", () => {
    const catalogueService = catalogue.find(item => item.name === button.dataset.service);
    const service = catalogueService || {
      name: button.dataset.service,
      price: Number(button.dataset.price),
      duration: Number(button.dataset.duration)
    };

    if (!state.services.some(item => item.name === service.name)) state.services.push(service);
    openBooking();
    showStep(2);
  });
});

document.querySelectorAll("[data-location]").forEach(button => {
  button.addEventListener("click", () => {
    state.location = button.dataset.location;
    openBooking();
    showStep(3);
    selectLocationButton();
  });
});

document.querySelectorAll("[data-book-location]").forEach(button => {
  button.addEventListener("click", () => {
    state.location = button.dataset.bookLocation;
    selectLocationButton();
  });
});

document.querySelectorAll("[data-slot]").forEach(button => {
  button.addEventListener("click", () => {
    state.slot = button.dataset.slot;
    document.querySelectorAll("[data-slot]").forEach(slot => slot.classList.toggle("selected", slot === button));
  });
});

document.querySelector("#confirm-demo").addEventListener("click", () => {
  steps.forEach(step => step.classList.remove("active"));
  document.querySelector(".stepper").style.display = "none";
  document.querySelector(".booking-success").classList.add("active");
  panel.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#accept-change").addEventListener("click", () => {
  document.querySelector(".change-result").textContent =
    "✓ Demo: change accepted. A real system would send an updated confirmation.";
});

document.querySelector("#other-slot").addEventListener("click", () => {
  document.querySelector(".change-result").textContent =
    "Demo: alternate-slot picker would open without cancelling the existing appointment.";
});

const menuButton = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

menuButton.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

mobileMenu.querySelectorAll("a, button").forEach(item => {
  item.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 24), { passive: true });

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }],
        { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }
      );
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });

  document.querySelectorAll(".service-card, .work-shot, .salon-grid article, .receipt, .change-card, .club-card")
    .forEach(element => observer.observe(element));
}
