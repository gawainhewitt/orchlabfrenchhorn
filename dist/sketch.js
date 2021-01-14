var synth = new Tone.PolySynth().toDestination();        // call a new tone synth and patch it to the sound
var info = true;    // this tells us whether to display the info screen or not
var notePlaying = [0,0,0,0,0,0,0,0,0]; // array to store if a note is playing - not using this at the moment, but might
var ongoingTouches = []; // to store ongoing touches in for multitouch
const now = Tone.now(); // time variable to tell the tone.js when to play - i.e play now! (when function called for example)

document.addEventListener("DOMContentLoaded", startup); // adding an event listener to the document which fires once the DOM is loaded and then triggers the startup function

synth.set(  // setup the synth - this is audio stuff really
  {
    "volume": 0,
    "detune": 0,
    "portamento": 0,
    "envelope": {
      "attack": 2,
      "attackCurve": "linear",
      "decay": 0.1,
      "decayCurve": "exponential",
      "release": 2,
      "releaseCurve": "exponential",
      "sustain": 0.3
    },
    "oscillator": {
      "partialCount": 0,
      "partials": [],
      "phase": 0,
      "type": "triangle"
    }
  }
);

function startup() {
  if (document.images) {   // preload the images for speed
    img0 = new Image();
    img0.src = "images/image0.jpg";
    img0_2 = new Image();
    img0_2.src = "images/image0_2.jpg";
    img1 = new Image();
    img1.src = "images/image1.jpg";
    img1_2 = new Image();
    img1_2.src = "images/image1_2.jpg";
    img2 = new Image();
    img2.src = "images/image2.jpg";
    img2_2 = new Image();
    img2_2.src = "images/image2_2.jpg";
    img3 = new Image();
    img3.src = "images/image3.jpg";
    img3_2 = new Image();
    img3_2.src = "images/image3_2.jpg";
    img4 = new Image();
    img4.src = "images/image4.jpg";
    img4_2 = new Image();
    img4_2.src = "images/image4_2.jpg";
    img5 = new Image();
    img5.src = "images/image5.jpg";
    img5_2 = new Image();
    img5_2.src = "images/image5_2.jpg";
    img6 = new Image();
    img6.src = "images/image6.jpg";
    img6_2 = new Image();
    img6_2.src = "images/image6_2.jpg";
    img7 = new Image();
    img7.src = "images/image7.jpg";
    img7_2 = new Image();
    img7_2.src = "images/image7_2.jpg";
    img8 = new Image();
    img8.src = "images/image8.jpg";
    img8_2 = new Image();
    img8_2.src = "images/image8_2.jpg";
  }
  for(var i = 0; i < 9; i++) {    // loop through the divs containing images and add event listeners
    var el = document.getElementById("image"+i);
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
    }

}

var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"];    // array containing our musical notes that we are currently using (tone.js will respond to these as is)
var allTheNotes = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
                    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
                    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
                    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
                    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6"]; // all the notes available to us in the code
var major = [1, 3, 5, 6, 8, 10, 12, 13, 15]; // intervals for a major scale for 9 notes
var pentatonic = [1, 3, 5, 8, 10, 13, 15, 17, 20]; // intervals for a pentatonic scale for 9 notes
var minor = [];
var majorBlues = [];
var minorBlues = [];
var scales = ["default", pentatonic, major, minor, majorBlues, minorBlues];
var scale = major; // this variable sets the default scale on load
var theKey = 0; // this variable sets the default key on load

function handleMenu(menu, index) { // function to handle the menu selections and change scales and keys
  if(menu === "keymenu"){
    theKey = index -1; // set the variable to the correct scale - the minus 1 is because of the default menu setting
    console.log("the key is "+theKey); //debugging
    for(var i = 0; i < 9; i++) {
      var theNote = scale[i] + 24 + theKey; // the note plus the octave plus the offset from the key menu
      notes[i] = allTheNotes[theNote]; // pick the notes from the all the notes array
    }
  }else if(menu === "scalemenu"){
    console.log("the scale is "+index);
    scale = scales[index];
    console.log(scale);
    for(var i = 0; i < 9; i++) {
      var theNote = scale[i] + 24 + theKey; // the note plus the octave plus the offset from the key menu
      notes[i] = allTheNotes[theNote]; // pick the notes from the all the notes array
    }
  } else {
                          //octave switching here WORKING HERE
  }
}

  function handleStart(evt) { // this function handles touchstart
    evt.preventDefault(); // prevent default touch actions like scroll

    if(info === true) { // is the info screen on?
      Tone.start(); // we need this to allow audio to start. probably best to put it on a different button soon though
      info = false;
    }

    console.log("touchstart."); //debugging
    var touches = evt.changedTouches; //assign the changedTouches to an array called touches
    ongoingTouches.push(copyTouch(touches[0])); //copy the new touch into the ongoingTouches array
    var elem = evt.targetTouches[0].target.id; //returns the id of the element that triggered the touch
    console.log("image id = "+elem); //debugging
    for(var i = 0; i < 9; i++) { // for loop to check which element it is and get a number to send to the synth
      if(elem === "i"+i){ // this looks confusing because the id name also contains "i" - see that HTML
        playSynth(i); // call the playSynth function
      }
    }
  }

  function handleMove(evt) { // this function handles touchmove
    evt.preventDefault(); // prevent default touch actions like scroll
    var touches = evt.changedTouches; //assign the changedTouches to an array called touches

    for (var i = 0; i < touches.length; i++) {

      var idx = ongoingTouchIndexById(touches[i].identifier); //call a function that will compare this touch against the list and assign the return to idx

      if (idx >= 0) { // did we get a match?
        // console.log("continuing touch "+idx); // debugging

        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        // console.log(".");
      } else { // no match
        console.log("can't figure out which touch to continue");
      }
    }
  }

  function handleEnd(evt) {  // this function handles touchend
    evt.preventDefault(); // prevent default touch actions like scroll

    var touches = evt.changedTouches; //assign the changedTouches to an array called touches
    var elem = touches[0].target.id //returns the id of the element that triggered the touch (that has just ended)
    console.log("ended image id = "+elem); //debugging
    for(var i = 0; i < 9; i++) { //get a number to end the right note
        if(elem === "i"+i){
          stopSynth(i); // call stopSynth
        }
      }
    for (var i = 0; i < touches.length; i++) {

      var idx = ongoingTouchIndexById(touches[i].identifier); //call a function that will compare this touch against the list and assign the return to idx

      if (idx >= 0) { // did we get a match?
        console.log("touchend "+idx);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      } else { // no match
        console.log("can't figure out which touch to end");
      }
    }
  }

  function handleCancel(evt) { // this handles touchcancel
    evt.preventDefault();  // prevent default touch actions like scroll
    console.log("touchcancel."); //debugging
    var touches = evt.changedTouches; //assign the changedTouches to an array called touches

    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier); //call a function that will compare this touch against the list and assign the return to idx
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }


  function copyTouch({ identifier, pageX, pageY }) { // this function is used to facilitate copying touch ID properties
    return { identifier, pageX, pageY };
  }

  function ongoingTouchIndexById(idToFind) { //compares the more complex stuff to give a simple answer to the question "which touch"
    for (var i = 0; i < ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }


  // the following is to do with the select boxes and making them look pretty


selectBoxes("keymenu"); //make a pretty keymenu
selectBoxes("scalemenu"); //make a pretty scalemenu
selectBoxes("octavemenu"); //make a pretty octavemenu

function selectBoxes(name) {

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName(name);
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            console.log(name + (" ") + s.selectedIndex); //debugging
            handleMenu(name, s.selectedIndex);   // send the menu name and the index of the selection to the handlemenu function
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
    //console.log(a.innerHTML);
  });
}
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);


//following is to do with sound and image management

function playSynth(i) {
  synth.triggerAttack(notes[i], Tone.now());
  document.getElementById('i'+i).src='images/image'+i+'_2.jpg';

}

function stopSynth(i) {
  synth.triggerRelease(notes[i], Tone.now());
  document.getElementById('i'+i).src='images/image'+i+'.jpg';
}
