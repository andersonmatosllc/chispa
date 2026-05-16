// ===============================
// CHISPA CORE ENGINE
// Navigation + Swipe + Storage
// UI Enhancement Layer
// ===============================

const screens = ["center", "north", "south", "east", "west"];

let currentScreen = "center";


// -------------------------------
// SCREEN LABELS
// -------------------------------

const screenMeta = {
  center: {
    title: "CENTER",
    subtitle: "Maintenance"
  },
  north: {
    title: "NORTH",
    subtitle: "Expression"
  },
  south: {
    title: "SOUTH",
    subtitle: "Upkeep"
  },
  east: {
    title: "EAST",
    subtitle: "Miscellaneous"
  },
  west: {
    title: "WEST",
    subtitle: "Resources"
  }
};


// -------------------------------
// APP COLORS
// -------------------------------

const COLORS = {
  orange:"#FF8A24",
  grey:"#6E6E6E",
  saved:"#8BE8D4"
};


// -------------------------------
// STORAGE
// -------------------------------

const STORAGE_PREFIX = "chispa_note_";

const saveTimers = {};


// -------------------------------
// SCREEN SWITCH
// -------------------------------

function showScreen(id){

  screens.forEach((s)=>{

    const el=document.getElementById(s);

    if(el) el.classList.remove("active");

  });

  const target=document.getElementById(id);

  if(target){

    target.classList.add("active");

    applyScreenUI(target,id);

  }

  currentScreen=id;

}


// -------------------------------
// DYNAMIC UI
// creates:
// orange title
// grey subtitle
// lower-right saved
// -------------------------------

function applyScreenUI(screen,id){

  let existing=screen.querySelector(".chispa-header");

  if(existing) existing.remove();


  const wrapper=document.createElement("div");

  wrapper.className="chispa-header";

  wrapper.innerHTML=`

    <div style="
      position:absolute;
      top:38px;
      left:35px;
      z-index:10;
    ">

      <div style="
        color:${COLORS.orange};
        letter-spacing:8px;
        font-size:18px;
        font-weight:300;
      ">
      ${screenMeta[id].title}
      </div>

      <div style="
        margin-top:6px;
        color:${COLORS.grey};
        font-size:14px;
        font-style:italic;
        font-family:cursive;
        opacity:.75;
      ">
      ^${screenMeta[id].subtitle}
      </div>

    </div>


    <div style="
      position:absolute;
      right:40px;
      bottom:80px;
      color:${COLORS.saved};
      font-size:15px;
      letter-spacing:5px;
      opacity:.9;
    ">
      saved
    </div>

  `;

  screen.appendChild(wrapper);

}


// -------------------------------
// LOAD SAVED NOTES
// -------------------------------

function loadNotes(){

  screens.forEach((screen)=>{

    const textarea=
      document.getElementById(`note-${screen}`);

    if(!textarea) return;


    const saved=
      localStorage.getItem(
        STORAGE_PREFIX+screen
      );

    if(saved!==null){

      textarea.value=saved;

    }

    attachAutoSave(textarea,screen);

    attachBulletSystem(textarea);

  });

}


// -------------------------------
// AUTO BULLETS
// Every new line starts orange dot
// -------------------------------

function attachBulletSystem(textarea){

textarea.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

e.preventDefault();

const start=
textarea.selectionStart;

const value=
textarea.value;

textarea.value=

value.substring(0,start)+
"\n• "+
value.substring(start);

textarea.selectionStart=
textarea.selectionEnd=
start+3;

}

});

}


// -------------------------------
// AUTO SAVE
// -------------------------------

function attachAutoSave(
textarea,
screen
){

textarea.addEventListener(
"input",
()=>{

clearTimeout(
saveTimers[screen]
);

saveTimers[screen]=
setTimeout(()=>{

localStorage.setItem(

STORAGE_PREFIX+
screen,

textarea.value

);

},1500);

});

}


// -------------------------------
// ORANGE BULLET COLOR
// visual layer only
// -------------------------------

const style=document.createElement("style");

style.innerHTML=`

textarea{

color:white;

}

textarea::selection{

background:#333;

}

.active textarea{

caret-color:white;

}

.bullet{

color:${COLORS.orange};

}

`;

document.head.appendChild(style);


// -------------------------------
// SWIPE SYSTEM
// -------------------------------

let startX=0;
let startY=0;

function isTyping(e){

return(

e.target.tagName==="TEXTAREA"||

e.target.tagName==="INPUT"

);

}


document.addEventListener(
"touchstart",
(e)=>{

if(isTyping(e)) return;

startX=
e.touches[0].screenX;

startY=
e.touches[0].screenY;

});


document.addEventListener(
"touchend",
(e)=>{

if(isTyping(e)) return;

const dx=
e.changedTouches[0].screenX
-startX;

const dy=
e.changedTouches[0].screenY
-startY;

const threshold=60;

if(
Math.abs(dx)<threshold &&
Math.abs(dy)<threshold
) return;


if(
Math.abs(dx)>
Math.abs(dy)
){

navigate(
dx>0 ?
"east":
"west"
);

}else{

navigate(
dy>0 ?
"south":
"north"
);

}

});


// -------------------------------
// SPATIAL MAP
// -------------------------------

function navigate(dir){

const map={

center:{
north:"north",
south:"south",
east:"east",
west:"west"
},

north:{
south:"center"
},

south:{
north:"center"
},

east:{
west:"center"
},

west:{
east:"center"
}

};

const next=
map[currentScreen]?.[dir];

if(next)
showScreen(next);

}


// -------------------------------
// CENTER BUTTON
// higher + orange
// -------------------------------

function createCenterButton(){

const btn=
document.createElement("div");

btn.style.position=
"fixed";

btn.style.bottom=
"35px"; // raised

btn.style.left=
"50%";

btn.style.transform=
"translateX(-50%)";

btn.style.width=
"54px";

btn.style.height=
"10px";

btn.style.borderRadius=
"8px";

btn.style.background=
COLORS.orange;

btn.style.opacity=".85";

btn.style.zIndex=
"9999";


btn.addEventListener(
"click",
()=>{

showScreen(
"center"
);

});

document.body
.appendChild(btn);

}


// -------------------------------
// INIT
// -------------------------------

document.addEventListener(
"DOMContentLoaded",
()=>{

showScreen(
"center"
);

loadNotes();

createCenterButton();

});
