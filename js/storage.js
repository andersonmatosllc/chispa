// ===============================
// CHISPA — Persistent Storage Layer
// Auto-save notes per screen
// ===============================

// Storage key prefix (keeps data organized)
const STORAGE_PREFIX = "chispa_note_";

// 1. Get all textareas in your app
const screens = ["center", "north", "south", "east", "west"];

// 2. Debounce timers per screen
const saveTimers = {};

// -------------------------------
// Load saved content on startup
// -------------------------------
function loadNotes() {
  screens.forEach((screen) => {
    const textarea = document.getElementById(`note-${screen}`);
    if (!textarea) return;

    const saved = localStorage.getItem(STORAGE_PREFIX + screen);

    if (saved !== null) {
      textarea.value = saved;
    }

    attachAutoSave(textarea, screen);
  });
}

// -------------------------------
// Auto-save with 1.5s delay
// -------------------------------
function attachAutoSave(textarea, screen) {
  textarea.addEventListener("input", () => {
    // clear previous timer (prevents constant saving)
    clearTimeout(saveTimers[screen]);

    // set new timer
    saveTimers[screen] = setTimeout(() => {
      saveNote(screen, textarea.value);
    }, 1500);
  });
}

// -------------------------------
// Save to localStorage
// -------------------------------
function saveNote(screen, content) {
  try {
    localStorage.setItem(STORAGE_PREFIX + screen, content);

    showSavedIndicator(screen);
  } catch (err) {
    console.error("Save failed:", err);
  }
}

// -------------------------------
// Visual feedback (non-intrusive)
// -------------------------------
function showSavedIndicator(screen) {
  const indicator = document.getElementById(`save-${screen}`);
  if (!indicator) return;

  indicator.textContent = "saved";

  indicator.style.opacity = "1";
  indicator.style.color = "var(--accent)";

  setTimeout(() => {
    indicator.style.opacity = "0.6";
  }, 800);
}

// -------------------------------
// OPTIONAL: manual clear helper (not used yet)
// -------------------------------
function clearNote(screen) {
  localStorage.removeItem(STORAGE_PREFIX + screen);

  const textarea = document.getElementById(`note-${screen}`);
  if (textarea) textarea.value = "";
}

// -------------------------------
// Init (wait for DOM safely)
// -------------------------------
document.addEventListener("DOMContentLoaded", loadNotes);
