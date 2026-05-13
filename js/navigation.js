'use strict';

(() => {

  // ------------------------
  // SPATIAL NAVIGATION
  // ------------------------

  const screens = {

    center:document.getElementById('center'),
    north:document.getElementById('north'),
    south:document.getElementById('south'),
    east:document.getElementById('east'),
    west:document.getElementById('west')

  };

  let current = 'center';

  function resetScreens(){

    screens.center.className = 'screen center';
    screens.north.className = 'screen north';
    screens.south.className = 'screen south';
    screens.east.className = 'screen east';
    screens.west.className = 'screen west';

  }

  function navigate(direction){

    resetScreens();

    if(direction === 'up'){

      screens.north.classList.add('active');
      current = 'north';

    }

    else if(direction === 'down'){

      screens.south.classList.add('active');
      current = 'south';

    }

    else if(direction === 'right'){

      screens.east.classList.add('active');
      current = 'east';

    }

    else if(direction === 'left'){

      screens.west.classList.add('active');
      current = 'west';

    }

    else{

      screens.center.classList.add('active');
      current = 'center';

    }

  }

  // ------------------------
  // KEYBOARD NAVIGATION
  // ------------------------

  document.addEventListener('keydown',(e)=>{

    if(current !== 'center'){

      if(
        e.key === 'Escape' ||
        e.key === 'Backspace'
      ){

        navigate('center');
        return;

      }

    }

    switch(e.key){

      case 'ArrowUp':
        navigate('up');
        break;

      case 'ArrowDown':
        navigate('down');
        break;

      case 'ArrowLeft':
        navigate('left');
        break;

      case 'ArrowRight':
        navigate('right');
        break;

    }

  });

  // ------------------------
  // TOUCH NAVIGATION
  // ------------------------

  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart',e=>{

    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;

  });

  document.addEventListener('touchend',e=>{

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if(current !== 'center'){

      navigate('center');
      return;

    }

    if(Math.abs(dx) > Math.abs(dy)){

      if(dx > 50){

        navigate('right');

      }

      else if(dx < -50){

        navigate('left');

      }

    }

    else{

      if(dy > 50){

        navigate('down');

      }

      else if(dy < -50){

        navigate('up');

      }

    }

  });

})();
