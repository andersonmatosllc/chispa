// ===================================================================
// CHISPA CORE ENGINE — MINIMALIST EDITION
// Navigation + Swipe + Storage + Custom UI Injection
// ===================================================================

const screens = ["center", "north", "south", "east", "west"];
let currentScreen = "center";

// -------------------------------------------------------------------
// CONFIGURATION & THEME DICTIONARIES
// -------------------------------------------------------------------
const STORAGE_PREFIX = "chispa_note_";
const saveTimers = {};

const SUBTITLES = {
  center: "Currently",
  north: "Expression",
  south: "Upkeep",
  west: "Resources",
  east: "Miscellaneous"
};

// -------------------------------------------------------------------
// DYNAMIC UI RESTYLING INJECTION (Pristine Index Preservation)
// -------------------------------------------------------------------
function injectCustomTheme() {
  const style = document.createElement("style");
  style.textContent = `
    /* 1. Turn all headers to fine minimalist copper orange */
    .direction {
      color: #e57c23 !important;
      font-weight: 500;
      letter-spacing: 7px;
    }

    /* 2. Style Subtitles with subtle italic grey look */
    .app-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 4px;
      letter-spacing: 1px;
    }

    /* 3. Re-anchor panel flow and shift "Saved" badge to Bottom Right Corner */
    .panel {
      position: relative !important;
      display: flex;
      flex-direction: column;
    }
    .topbar {
      display: flex;
      flex-direction: column; /* Stacks Title and Subtitle */
      justify-content: flex-start;
    }
    .save-status {
      position: absolute !important;
      bottom: 28px;
      right: 38px;
      z-index: 100;
      font-size: 14px;
      letter-spacing: 2px;
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      color: #8df0c8;
    }

    /* 4. Styled native list counters inside writing frames */
    textarea {
      background: transparent;
      line-height: 2.1 !important;
    }
  `;
  document.head.appendChild(style);

  // Structural Injection loop for subheadings across elements
  screens.forEach(s => {
    const screenEl = document.getElementById(s);
    if (!screenEl) return;

    // Create and attach Subtitle
    const topbar = screenEl.querySelector(".topbar");
    if (topbar) {
      const sub = document.createElement("div");
      sub.className = "app-subtitle";
      sub.textContent = `^${SUBTITLES[s]}`;
      topbar.appendChild(sub);
    }
  });
}

// -------------------------------------------------------------------
// AUTOMATIC LIST/BULLET HANDLER
// -------------------------------------------------------------------
function attachBulletEngine(textarea) {
  // Pre-load a bullet point if the field initializes completely empty
  if (textarea.value.trim() === "") {
    textarea.value = "• ";
  }

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      // Locate current row values
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const currentLine = text.substring(lineStart, start);

      // Verify if current line is already an unpopulated list row
      if (currentLine.trim() === "•") {
        // Break out of the list if user hits enter on an empty bullet line
        textarea.value = text.substring(0, lineStart) + "\n" + text.substring(end);
        textarea.selectionStart = textarea.selectionEnd = lineStart + 1;
        return;
      }

      // Generate a brand new matching orange bullet point row entry
      const insertion = "\n• ";
      textarea.value = text.substring(0, start) + insertion + text.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + insertion.length;

      // Fire change update events manually
      textarea.dispatchEvent(new Event("input"));
    }
  });

  // Re-verify if text is entirely cleared during manual selection deletes
  textarea.addEventListener("input", () => {
    if (textarea.value === "") {
      textarea.value = "• ";
    }
  });
}

// -------------------------------------------------------------------
// SCREEN SWITCH EXECUTION
// -------------------------------------------------------------------
function showScreen(id) {
  screens.forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  currentScreen = id;
}

// -------------------------------------------------------------------
// STORAGE PIPELINE
// -------------------------------------------------------------------
function loadNotes() {
  screens.forEach((screen) => {
    const textarea = document.getElementById(`note-${screen}`);
    if (!textarea) return;

    const saved = localStorage.getItem(STORAGE_PREFIX + screen);
    if (saved !== null) textarea.value = saved;

    attachBulletEngine(textarea);
    attachAutoSave(textarea, screen);
  });
}

function attachAutoSave(textarea, screen) {
  const statusEl = document.getElementById(`save-${screen}`);
  
  textarea.addEventListener("input", () => {
    if (statusEl) statusEl.style.opacity = "0.3"; // Dim while user is active
    clearTimeout(saveTimeouts[screen]);

    saveTimers[screen] = setTimeout(() => {
      localStorage.setItem(STORAGE_PREFIX + screen, textarea.value);
      if (statusEl) {
        statusEl.style.opacity = "1";
        statusEl.textContent = "saved";
      }
    }, 1500);
  });
}

// -------------------------------------------------------------------
// SWIPE NAVIGATION RECOGNITION
// -------------------------------------------------------------------
let startX = 0;
let startY = 0;

function isTyping(e) {
  return e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT";
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

// -------------------------------------------------------------------
// BACK BAR SHORTCUT
// -------------------------------------------------------------------
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
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    showScreen("center");
  });

  document.body.appendChild(btn);
}

// -------------------------------------------------------------------
// SYSTEM INITIALIZATION
// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  injectCustomTheme();
  showScreen("center");
  loadNotes();
  createCenterButton();
});
