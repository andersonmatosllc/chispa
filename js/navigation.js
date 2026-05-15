'use strict';

/**
 * -------------------------------------------------------------------
 * SPATIAL NAVIGATION SYSTEM (CHISPA)
 * -------------------------------------------------------------------
 */

const screens = {
  center: document.getElementById('center'),
  north: document.getElementById('north'),
  south: document.getElementById('south'),
  east: document.getElementById('east'),
  west: document.getElementById('west')
};

let current = 'center';

// -------------------------------------------------------------------
// GENERATE MINIMALISTIC RECENTRING RECTANGLES IN DOM
// -------------------------------------------------------------------
const styleInject = document.createElement('style');
styleInject.textContent = `
  .panel {
    position: relative;
  }
  .mindful-home-bar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.3s ease, width 0.3s ease;
    z-index: 100;
  }
  .mindful-home-bar:hover {
    background: var(--accent, #8df0c8);
    width: 50px;
  }
`;
document.head.appendChild(styleInject);

Object.entries(screens).forEach(([key, screenElement]) => {
  if (!screenElement) return;
  const panel = screenElement.querySelector('.panel');
  
  if (panel && key !== 'center') {
    const homeBar = document.createElement('div');
    homeBar.className = 'mindful-home-bar';
    homeBar.setAttribute('aria-label', 'Return to Center');
    
    homeBar.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate('center');
    });
    
    panel.appendChild(homeBar);
  }
});

// -------------------------------------------------------------------
// APPLICATION VIEW PIPELINES
// -------------------------------------------------------------------
function resetScreens() {
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.remove('active');
  });
}

function navigate(target) {
  if (!screens[target]) return;
  resetScreens();
  screens[target].classList.add('active');
  current = target;
}

function isUserTyping() {
  const active = document.activeElement;
  return active && (active.tagName === 'TEXTAREA' || active.classList.contains('note-area'));
}

// -------------------------------------------------------------------
// KEYBOARD & SWIPE INPUT ACTIONS (TYPING INPUT PROTECTED)
// -------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (isUserTyping()) return;

  switch (e.key) {
    case 'ArrowUp':    navigate('north'); break;
    case 'ArrowDown':  navigate('south'); break;
    case 'ArrowLeft':  navigate('west');  break;
    case 'ArrowRight': navigate('east');  break;
    case 'Escape':
    case 'Backspace':  navigate('center'); break;
  }
});

let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
  if (isUserTyping() || e.target.tagName === 'TEXTAREA') return;

  startX = e.changedTouches[0].screenX;
  startY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (isUserTyping() || e.target.tagName === 'TEXTAREA') return;

  const endX = e.changedTouches[0].screenX;
  const endY = e.changedTouches[0].screenY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 70) {
      dx > 0 ? navigate('west') : navigate('east');
    }
  } else {
    if (Math.abs(dy) > 70) {
      dy > 0 ? navigate('north') : navigate('south');
    }
  }
}, { passive: true });

navigate('center');
