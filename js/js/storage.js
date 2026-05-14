'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const noteIds = [
    'center',
    'north',
    'south',
    'east',
    'west'
  ];

  noteIds.forEach(id => {

    const textarea =
      document.getElementById(`note-${id}`);

    const saveStatus =
      document.getElementById(`save-${id}`);

    if (!textarea) {
      console.log(`Missing textarea: note-${id}`);
      return;
    }

    // Load saved content
    const savedText =
      localStorage.getItem(`chispa-${id}`);

    if(savedText){

      textarea.value = savedText;

    }

    textarea.addEventListener('input', () => {

      try{

        localStorage.setItem(
          `chispa-${id}`,
          textarea.value
        );

        if(saveStatus){

          saveStatus.textContent='saved';

          setTimeout(()=>{

            saveStatus.textContent='';

          },800);

        }

      }

      catch(error){

        console.error(
          'Storage failed:',
          error
        );

      }

    });

  });

});
