'use strict';

(() => {

  // ------------------------
  // LOCAL STORAGE (SAVE NOTES)
  // ------------------------

  const noteIds = [
    'center',
    'north',
    'south',
    'east',
    'west'
  ];

  noteIds.forEach(id => {

    const textarea = document.getElementById(`note-${id}`);
    const saveStatus = document.getElementById(`save-${id}`);

    // If elements don't exist, stop (prevents crashes)
    if (!textarea || !saveStatus) return;

    // Load saved text when page opens
    const saved = localStorage.getItem(`chispa-${id}`);
    if (saved !== null) {
      textarea.value = saved;
    }

    // Save while typing
    textarea.addEventListener('input', () => {

      saveStatus.innerText = 'saving...';

      localStorage.setItem(`chispa-${id}`, textarea.value);

      // small delay just for UI effect
      setTimeout(() => {
        saveStatus.innerText = 'saved';
      }, 300);

    });

  });

})();
