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
    case 'ArrowUp':    navigate('north'); break;
    case 'ArrowDown':  navigate('south'); break;
    case 'ArrowLeft':  navigate('west');  break;
    case 'ArrowRight': navigate('east');  break;
    case 'Escape':
    case 'Backspace':  navigate('center'); break;
  }
});

// --------------------------
// TOUCH NAVIGATION WITH MINDFUL PAUSE
// --------------------------

let startX = 0;
let startY = 0;
let holdTimer = null; // Holds the mindfulness pause anchor

document.addEventListener('touchstart', (e) => {
  if (e.target.classList.contains('notepad')) return;

  startX = e.changedTouches[0].screenX;
  startY = e.changedTouches[0].screenY;

  // Start the 500ms mindful hold anchor
  holdTimer = setTimeout(() => {
    navigate('center');
  }, 500); 
});

document.addEventListener('touchmove', () => {
  // If your finger moves to swipe, it's an action, not a pause. Cancel the hold.
  clearTimeout(holdTimer);
});

document.addEventListener('touchend', (e) => {
  // If you lift your finger before the 500ms mark, cancel the hold.
  clearTimeout(holdTimer);

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
