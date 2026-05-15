// ===============================
// CHISPA — Spatial Navigation
// Swipe + Center Return Button
// ===============================

const screens = ["center", "north", "south", "east", "west"];

let currentScreen = "center";

// -------------------------------
// Screen switching
// -------------------------------
function showScreen(id) {
  screens.forEach((screen) => {
    const el = document.getElementById(screen);
    if (!el) return;

    el.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  currentScreen = id;
}

// -------------------------------
// Swipe detection
// -------------------------------
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const threshold = 60;

// Prevent swipe interference with typing
function isTypingTarget(e) {
  return (
    e.target.tagName === "TEXTAREA" ||
    e.target.tagName === "INPUT" ||
    e.target.isContentEditable
  );
}

document.addEventListener("touchstart", (e) => {
  if (isTypingTarget(e)) return;

  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  if (isTypingTarget(e)) return;

  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  handleSwipe();
});

function handleSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0) navigate("east");
    else navigate("west");
  } else {
    // Vertical swipe
    if (dy > 0) navigate("south");
    else navigate("north");
  }
}

// -------------------------------
// Navigation logic (spatial map)
// -------------------------------
function navigate(direction) {
  const map = {
    center: { north: "north", south: "south", east: "east", west: "west" },
    north: { south: "center" },
    south: { north: "center" },
    east: { west: "center" },
    west: { east: "center" }
  };

  const next = map[currentScreen]?.[direction];

  if (next) {
    showScreen(next);
  }
}

// -------------------------------
// Center button (bottom rectangle)
// -------------------------------
function createCenterButton() {
  const btn = document.createElement("div");

  btn.style.position = "fixed";
  btn.style.bottom = "18px";
  btn.style.left = "50%";
  btn.style.transform = "translateX(-50%)";
  btn.style.width = "54px";
  btn.style.height = "10px";
  btn.style.borderRadius = "6px";
  btn.style.background = "rgba(255,255,255,0.14)";
  btn.style.backdropFilter = "blur(10px)";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "9999";

  btn.style.transition = "all 0.2s ease";

  btn.addEventListener("mouseenter", () => {
    btn.style.background = "rgba(141,240,200,0.35)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.background = "rgba(255,255,255,0.14)";
  });

  btn.addEventListener("click", () => {
    showScreen("center");
  });

  document.body.appendChild(btn);
}

// -------------------------------
// Init
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  showScreen("center");
  createCenterButton();
});
