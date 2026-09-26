const packages = {
  silver: {
    name: "Silver Wash",
    price: "$40"
  },
  platinum: {
    name: "Platinum Wash",
    price: "$75"
  },
  diamond: {
    name: "Diamond Wash",
    price: "$95"
  },
  full: {
    name: "Full Detail",
    price: "$350"
  },
  showroom: {
    name: "Show Room Detail",
    price: "$550"
  }
};

const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");
const revealItems = document.querySelectorAll("[data-reveal]");

const intentButtons = document.querySelectorAll("[data-recommend]");
const packageCards = document.querySelectorAll("[data-package]");
const packageButtons = document.querySelectorAll("[data-package-select]");
const selectedPackage = document.querySelector("#selectedPackage");
const selectedPrice = document.querySelector("#selectedPrice");
const supportPackage = document.querySelector("#supportPackage");

const vehicleModel = document.querySelector("#vehicleModel");
const bookingNotes = document.querySelector("#bookingNotes");
const createBriefButton = document.querySelector("#createBrief");
const briefResult = document.querySelector("#briefResult");

const vehicleType = document.querySelector("#vehicleType");
const customHeightWrap = document.querySelector("#customHeightWrap");
const customHeight = document.querySelector("#customHeight");
const clearanceState = document.querySelector("#clearanceState");
const clearanceResult = document.querySelector("#clearanceResult");
const heightBar = document.querySelector("#heightBar");

const issueForm = document.querySelector("#issueForm");
const issuePhotos = document.querySelector("#issuePhotos");
const fileLabel = document.querySelector("#fileLabel");
const trackReference = document.querySelector("#trackReference");
const trackButton = document.querySelector("#trackButton");
const ticketResult = document.querySelector("#ticketResult");

let selectedPackageKey = "platinum";

function closeMenu() {
  mainNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

function toggleMenu() {
  const isOpen = mainNav.classList.toggle("is-open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
}

function selectPackage(packageKey) {
  const details = packages[packageKey];

  if (!details) {
    return;
  }

  selectedPackageKey = packageKey;
  selectedPackage.textContent = details.name;
  selectedPrice.textContent = details.price;

  packageCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.package === packageKey);
  });

  if (supportPackage) {
    supportPackage.value = details.name;
  }
}

function recommendPackage(packageKey, button) {
  intentButtons.forEach((item) => item.classList.remove("is-active"));
  packageCards.forEach((card) => card.classList.remove("is-recommended"));

  if (button) {
    button.classList.add("is-active");
  }

  const recommendedCard = document.querySelector(
    `[data-package="${packageKey}"]`
  );

  if (recommendedCard) {
    recommendedCard.classList.add("is-recommended");
    recommendedCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }

  selectPackage(packageKey);
}

function createVisitSummary() {
  const details = packages[selectedPackageKey];
  const model = vehicleModel.value.trim() || "Vehicle not entered";
  const notes = bookingNotes.value.trim() || "No extra notes";

  briefResult.hidden = false;
  briefResult.innerHTML = `
    <strong>${details.name} · ${details.price}</strong>
    <div><b>Vehicle:</b> ${escapeHtml(model)}</div>
    <div><b>Notes:</b> ${escapeHtml(notes)}</div>
    <div><b>Next:</b> confirm availability with the business before travelling.</div>
  `;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function getVehicleHeight() {
  if (vehicleType.value === "custom") {
    return Number.parseFloat(customHeight.value);
  }

  return Number.parseFloat(vehicleType.value);
}

function updateClearanceCheck() {
  const height = getVehicleHeight();

  customHeightWrap.hidden = vehicleType.value !== "custom";
  clearanceResult.classList.remove("is-good", "is-warning");

  if (!Number.isFinite(height)) {
    clearanceState.textContent = "Waiting for vehicle";
    clearanceResult.textContent =
      "Choose a vehicle type to run the demo access check.";
    heightBar.style.height = "0";
    return;
  }

  const visualHeight = Math.min((height / 2.4) * 100, 100);
  heightBar.style.height = `${visualHeight}%`;

  if (height <= 2.1) {
    clearanceState.textContent = "Within demo limit";
    clearanceResult.classList.add("is-good");
    clearanceResult.textContent =
      `Estimated height: ${height.toFixed(2)} m. This is within the 2.1 m demo clearance limit. Confirm the actual vehicle height before travel.`;
    heightBar.style.background = "var(--green)";
  } else {
    clearanceState.textContent = "Check before travel";
    clearanceResult.classList.add("is-warning");
    clearanceResult.textContent =
      `Estimated height: ${height.toFixed(2)} m. This exceeds the 2.1 m demo clearance limit. Call the business before booking or travelling.`;
    heightBar.style.background = "var(--red)";
  }
}

function createReference() {
  const now = new Date();
  const date = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");

  const suffix = Math.floor(100 + Math.random() * 900);

  return `TCW-${date}-${suffix}`;
}

function getResolution() {
  const selected = document.querySelector(
    'input[name="resolution"]:checked'
  );

  return selected ? selected.value : "Discuss options";
}

function saveTicket(ticket) {
  const tickets = JSON.parse(localStorage.getItem("tcw-demo-tickets") || "{}");
  tickets[ticket.reference] = ticket;
  localStorage.setItem("tcw-demo-tickets", JSON.stringify(tickets));
}

function getTicket(reference) {
  const tickets = JSON.parse(localStorage.getItem("tcw-demo-tickets") || "{}");
  return tickets[reference] || null;
}

function renderTicket(ticket) {
  if (!ticket) {
    ticketResult.innerHTML = `
      <div class="ticket-empty">
        <span>×</span>
        <p>No demo ticket found for that reference.</p>
      </div>
    `;
    return;
  }

  ticketResult.innerHTML = `
    <div class="ticket-card">
      <span class="ticket-card__ref">${escapeHtml(ticket.reference)}</span>
      <span class="ticket-card__status">${escapeHtml(ticket.status)}</span>

      <dl>
        <div>
          <dt>Customer</dt>
          <dd>${escapeHtml(ticket.name)}</dd>
        </div>
        <div>
          <dt>Service</dt>
          <dd>${escapeHtml(ticket.package)}</dd>
        </div>
        <div>
          <dt>Issue</dt>
          <dd>${escapeHtml(ticket.issueType)}</dd>
        </div>
        <div>
          <dt>Preferred resolution</dt>
          <dd>${escapeHtml(ticket.resolution)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>${escapeHtml(ticket.createdAt)}</dd>
        </div>
      </dl>
    </div>
  `;
}

function submitIssue(event) {
  event.preventDefault();

  const ticket = {
    reference: createReference(),
    status: "Received",
    name: document.querySelector("#supportName").value.trim(),
    email: document.querySelector("#supportEmail").value.trim(),
    package: document.querySelector("#supportPackage").value,
    issueType: document.querySelector("#issueType").value,
    details: document.querySelector("#issueDetails").value.trim(),
    resolution: getResolution(),
    photoCount: issuePhotos.files.length,
    createdAt: new Date().toLocaleString()
  };

  saveTicket(ticket);
  renderTicket(ticket);
  trackReference.value = ticket.reference;

  ticketResult.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function trackTicket() {
  const reference = trackReference.value.trim().toUpperCase();

  if (!reference) {
    renderTicket(null);
    return;
  }

  renderTicket(getTicket(reference));
}

menuButton.addEventListener("click", toggleMenu);

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

intentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    recommendPackage(button.dataset.recommend, button);
  });
});

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectPackage(button.dataset.packageSelect);
  });
});

createBriefButton.addEventListener("click", createVisitSummary);

vehicleType.addEventListener("change", updateClearanceCheck);
customHeight.addEventListener("input", updateClearanceCheck);

issuePhotos.addEventListener("change", () => {
  const count = issuePhotos.files.length;

  fileLabel.textContent = count
    ? `${count} photo${count === 1 ? "" : "s"} selected for this demo form.`
    : "Optional — photos are not uploaded in this frontend demo.";
});

issueForm.addEventListener("submit", submitIssue);
trackButton.addEventListener("click", trackTicket);

trackReference.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    trackTicket();
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

selectPackage("platinum");
