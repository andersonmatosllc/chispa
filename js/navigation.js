'use strict';

// --------------------------
// SCREENS
// --------------------------

const screens = {
  center: document.getElementById('center'),
  north: document.getElementById('north'),
  south: document.getElementById('south'),
  east: document.getElementById('east'),
  west: document.getElementById('west')
};

let current = 'center';

// --------------------------
// RESET SCREENS (iPHONE SAFE)
// --------------------------

function resetScreens() {
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });
}

// --------------------------
// NAVIGATE
// --------------------------

function navigate(target) {
  resetScreens();
  screens[target].classList.add('active');
  current = target;
}

// --------------------------
// KEYBOARD NAVIGATION
// --------------------------

document.addEventListener('keydown', (e) => {
  if (document.activeElement.classList.contains('notepad')) return;

  switch (e.key) {
    case 'ArrowUp':
      navigate('north');
      break;

    case 'ArrowDown':
      navigate('south');
      break;

    case 'ArrowLeft':
      navigate('west');
      break;

    case 'ArrowRight':
      navigate('east');
      break;

    case 'Escape':
    case 'Backspace':
      navigate('center');
      break;
  }
});

// --------------------------
// TOUCH NAVIGATION (iPHONE SAFE)
// --------------------------

let startX = 0;
let startY = 0;
let lastTap = 0; // Tracks the timestamp of the last tap for double-tap detection

document.addEventListener('touchstart', (e) => {
  if (e.target.classList.contains('notepad')) return;

  // --- DOUBLE TAP TO CENTER COMMAND ---
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  // If two taps happen within 300 milliseconds, it's a double tap
  if (tapLength < 300 && tapLength > 0) {
    navigate('center');
    e.preventDefault(); // Prevents zooming behavior on mobile devices
    return;
  }
  lastTap = currentTime;
  // ------------------------------------

  startX = e.changedTouches[0].screenX;
  startY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  if (e.target.classList.contains('notepad')) return;

  const endX = e.changedTouches[0].screenX;
  const endY = e.changedTouches[0].screenY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 70) navigate('east');
    else if (dx < -70) navigate('west');
  } else {
    if (dy > 70) navigate('south');
    else if (dy < -70) navigate('north');
  }
});

// --------------------------
// INIT
// --------------------------

navigate('center');
