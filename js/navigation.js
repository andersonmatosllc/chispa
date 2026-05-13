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
// RESET (FIXED FOR iPHONE)
// --------------------------

function resetScreens(){

  // DO NOT use className (breaks iOS focus/DOM stability)
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
  });

}

// --------------------------
// NAVIGATION
// --------------------------

function navigate(target){

  resetScreens();

  screens[target].classList.add('active');

  current = target;

}

// --------------------------
// KEYBOARD NAVIGATION
// --------------------------

document.addEventListener('keydown', (e)=>{

  // Prevent navigation while typing
  if(document.activeElement.tagName === 'TEXTAREA'){
    return;
  }

  switch(e.key){

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
      navigate('center');
      break;

  }

});

// --------------------------
// TOUCH NAVIGATION (iPHONE SAFE)
// --------------------------

let touchStartX = 0;
let touchStartY = 0;
let isTouchingInput = false;

document.addEventListener('touchstart', e => {

  // If user is interacting with textarea, ignore swipe system
  if(e.target.tagName === 'TEXTAREA'){
    isTouchingInput = true;
    return;
  }

  isTouchingInput = false;

  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;

});

document.addEventListener('touchend', e => {

  // Prevent swipe interfering with typing
  if(isTouchingInput) return;

  if(document.activeElement.tagName === 'TEXTAREA'){
    return;
  }

  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  // Horizontal swipe
  if(Math.abs(dx) > Math.abs(dy)){

    if(dx > 70){
      navigate('east');
    }
    else if(dx < -70){
      navigate('west');
    }

  }

  // Vertical swipe
  else{

    if(dy > 70){
      navigate('south');
    }
    else if(dy < -70){
      navigate('north');
    }

  }

});

// --------------------------
// DOUBLE TAP CENTER
// --------------------------

document.addEventListener('dblclick', ()=>{

  navigate('center');

});

// --------------------------
// IMPORTANT: SAFE INITIAL STATE
// --------------------------

// ensures iOS renders active state correctly
navigate('center');
