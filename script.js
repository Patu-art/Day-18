const comparison = document.querySelector("#comparison");
const afterScene = document.querySelector("#afterScene");
const divider = document.querySelector("#comparisonDivider");
const services = document.querySelectorAll(".service");
const serviceWord = document.querySelector("#serviceWord");
const projectButtons = document.querySelectorAll(".project-options button");

let isDragging = false;
let comparisonValue = 50;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateComparison(value) {
  comparisonValue = clamp(value, 4, 96);

  afterScene.style.clipPath = `inset(0 0 0 ${comparisonValue}%)`;
  divider.style.left = `${comparisonValue}%`;
  divider.setAttribute("aria-valuenow", Math.round(comparisonValue));
}

function updateComparisonFromPointer(clientX) {
  const bounds = comparison.getBoundingClientRect();
  const percentage = ((clientX - bounds.left) / bounds.width) * 100;

  updateComparison(percentage);
}

function startDragging(event) {
  isDragging = true;
  divider.setPointerCapture(event.pointerId);
}

function dragComparison(event) {
  if (!isDragging) {
    return;
  }

  updateComparisonFromPointer(event.clientX);
}

function stopDragging() {
  isDragging = false;
}

function handleDividerKeydown(event) {
  const step = event.shiftKey ? 10 : 2;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateComparison(comparisonValue - step);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    updateComparison(comparisonValue + step);
  }

  if (event.key === "Home") {
    event.preventDefault();
    updateComparison(4);
  }

  if (event.key === "End") {
    event.preventDefault();
    updateComparison(96);
  }
}

function activateService(service) {
  services.forEach((item) => item.classList.remove("is-active"));
  service.classList.add("is-active");
  serviceWord.textContent = service.dataset.word;
}

function selectProject(button) {
  projectButtons.forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
}

divider.addEventListener("pointerdown", startDragging);
divider.addEventListener("pointermove", dragComparison);
divider.addEventListener("pointerup", stopDragging);
divider.addEventListener("pointercancel", stopDragging);
divider.addEventListener("keydown", handleDividerKeydown);

comparison.addEventListener("pointerdown", (event) => {
  if (event.target === divider || divider.contains(event.target)) {
    return;
  }

  updateComparisonFromPointer(event.clientX);
});

services.forEach((service) => {
  service.addEventListener("mouseenter", () => activateService(service));
  service.addEventListener("focusin", () => activateService(service));
});

projectButtons.forEach((button) => {
  button.addEventListener("click", () => selectProject(button));
});
