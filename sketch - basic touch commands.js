document.querySelector('p').addEventListener('touchstart', f);
document.querySelector('p').addEventListener('touchend', f);
document.querySelector('p').addEventListener('touchmove', f);
document.querySelector('p').addEventListener('touchcancel', f);

function f(ev){
    ev.preventDefault();
    console.log( ev.touches, ev.type );
}
