'use strict';

// --------------------------
// SCREEN REFERENCES
// --------------------------

const screens = {

  center:
  document.getElementById('center'),

  north:
  document.getElementById('north'),

  south:
  document.getElementById('south'),

  east:
  document.getElementById('east'),

  west:
  document.getElementById('west')

};

let current = 'center';


// --------------------------
// RESET
// --------------------------

function resetScreens(){

  Object.values(screens)
  .forEach(screen=>{

    screen.classList.remove(
      'active'
    );

  });

}


// --------------------------
// NAVIGATE
// --------------------------

function navigate(target){

  if(!screens[target]){

    return;

  }

  resetScreens();

  screens[target]
  .classList
  .add('active');

  current = target;

}


// --------------------------
// KEYBOARD NAVIGATION
// --------------------------

document.addEventListener(
'keydown',
(e)=>{

  // Don't navigate while typing

  if(
    document.activeElement &&
    document.activeElement
    .tagName === 'TEXTAREA'
  ){

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

    case 'Backspace':

      navigate('center');

      break;

  }

});


// --------------------------
// TOUCH NAVIGATION
// --------------------------

let startX = 0;
let startY = 0;

let holdTimer = null;

let holdTriggered =
false;


// --------------------------
// TOUCH START
// --------------------------

document.addEventListener(
'touchstart',
(e)=>{

  if(
    e.target.tagName ===
    'TEXTAREA'
  ){

    return;

  }

  startX =
  e.changedTouches[0]
  .screenX;

  startY =
  e.changedTouches[0]
  .screenY;

  holdTriggered =
  false;

  // Hold 600ms
  // return center

  holdTimer =
  setTimeout(()=>{

    holdTriggered=true;

    navigate(
      'center'
    );

    if(
      navigator.vibrate
    ){

      navigator.vibrate(
        25
      );

    }

  },600);

});


// --------------------------
// TOUCH MOVE
// --------------------------

document.addEventListener(
'touchmove',
(e)=>{

  const moveX =
  e.changedTouches[0]
  .screenX;

  const moveY =
  e.changedTouches[0]
  .screenY;

  const dx =
  Math.abs(
    moveX-startX
  );

  const dy =
  Math.abs(
    moveY-startY
  );

  // tiny movement ignored

  if(
    dx>12 ||
    dy>12
  ){

    clearTimeout(
      holdTimer
    );

  }

});


// --------------------------
// TOUCH END
// --------------------------

document.addEventListener(
'touchend',
(e)=>{

  clearTimeout(
    holdTimer
  );

  if(
    e.target.tagName===
    'TEXTAREA'
  ){

    return;

  }

  if(
    holdTriggered
  ){

    return;

  }

  const endX=
  e.changedTouches[0]
  .screenX;

  const endY=
  e.changedTouches[0]
  .screenY;

  const dx=
  endX-startX;

  const dy=
  endY-startY;


  // horizontal

  if(
    Math.abs(dx)>
    Math.abs(dy)
  ){

    if(dx>70){

      navigate(
        'east'
      );

    }

    else if(
      dx<-70
    ){

      navigate(
        'west'
      );

    }

  }

  // vertical

  else{

    if(dy>70){

      navigate(
        'south'
      );

    }

    else if(
      dy<-70
    ){

      navigate(
        'north'
      );

    }

  }

});


// --------------------------
// INITIALIZE
// --------------------------

navigate(
'center'
);
