// ===============================
// CHISPA CORE ENGINE
// Navigation + Swipe + Storage
// ===============================

const screens = ["center", "north", "south", "east", "west"];
let currentScreen = "center";

// -------------------------------
// STORAGE
// -------------------------------
const STORAGE_PREFIX = "chispa_note_";
const saveTimers = {};

// -------------------------------
// SCREEN SWITCH
// -------------------------------
function showScreen(id) {
  screens.forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  currentScreen = id;
}

// -------------------------------
// LOAD SAVED NOTES
// -------------------------------
function loadNotes() {
  screens.forEach((screen) => {
    const textarea = document.getElementById(`note-${screen}`);
    if (!textarea) return;

    const saved = localStorage.getItem(STORAGE_PREFIX + screen);
    if (saved !== null) textarea.value = saved;

    attachAutoSave(textarea, screen);
  });
}

// -------------------------------
// AUTO SAVE (1.5s debounce)
// -------------------------------
function attachAutoSave(textarea, screen) {
  textarea.addEventListener("input", () => {
    clearTimeout(saveTimers[screen]);

    saveTimers[screen] = setTimeout(() => {
      localStorage.setItem(
        STORAGE_PREFIX + screen,
        textarea.value
      );
    }, 1500);
  });
}

// -------------------------------
// SWIPE SYSTEM
// -------------------------------
let startX = 0;
let startY = 0;

function isTyping(e) {
  return (
    e.target.tagName === "TEXTAREA" ||
    e.target.tagName === "INPUT"
  );
}

document.addEventListener("touchstart", (e) => {
  if (isTyping(e)) return;

  startX = e.touches[0].screenX;
  startY = e.touches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  if (isTyping(e)) return;

  const dx = e.changedTouches[0].screenX - startX;
  const dy = e.changedTouches[0].screenY - startY;

  const threshold = 60;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    navigate(dx > 0 ? "east" : "west");
  } else {
    navigate(dy > 0 ? "south" : "north");
  }
});

// -------------------------------
// SPATIAL NAVIGATION LOGIC
// -------------------------------
function navigate(dir) {
  const map = {
    center: { north: "north", south: "south", east: "east", west: "west" },
    north: { south: "center" },
    south: { north: "center" },
    east: { west: "center" },
    west: { east: "center" }
  };

  const next = map[currentScreen]?.[dir];
  if (next) showScreen(next);
}

// -------------------------------
// CENTER BUTTON
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
  btn.style.zIndex = "9999";

  btn.addEventListener("click", () => {
    showScreen("center");
  });

  document.body.appendChild(btn);
}

// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  showScreen("center");
  loadNotes();
  createCenterButton();
});
