'use strict';

window.onload = function(){

    console.log("Storage loaded");

    const areas = document.querySelectorAll("textarea");

    areas.forEach(area=>{

        const key = area.id;

        // LOAD

        const saved =
        localStorage.getItem(key);

        if(saved){

            area.value = saved;

            console.log(
              "Loaded:",
              key
            );

        }

        // SAVE

        area.addEventListener(
          "keyup",
          ()=>{

            localStorage.setItem(
              key,
              area.value
            );

            console.log(
              "Saved:",
              key
            );

          }

        );

    });

};
