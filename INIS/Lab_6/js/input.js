let element = document.querySelector(`.target`);

let dragging = false;

let startX = 0;
let startY = 0;

let startXDoc = 0;
let startYDoc = 0;

let previousTouch = new Date().valueOf();

document.getElementById(`workspace`).addEventListener(`touchstart`, function(e) {
  if (e.targetTouches.length != 1 && dragging == true) {
    dragging = false;
    element.style.top = `${startYDoc}px`;
    element.style.left = `${startXDoc}px`;
    return;
  }

  let currentTouch = new Date().valueOf();

  if (e.targetTouches.length == 1 && currentTouch - previousTouch < 500) {
    let touch=e.targetTouches[0];

    let elem = touch.target.closest(`.target`);

    if (!elem) return; 

    if (dragging == true){
      return;
    }

    dragging = true;

    element = elem;

    startX = touch.pageX - Number.parseInt(element.style.left || 0);
    startXDoc = Number.parseInt(element.style.left || 0);
    startY = touch.pageY - Number.parseInt(element.style.top || 0);
    startYDoc = Number.parseInt(element.style.top || 0);
  }

  previousTouch = currentTouch;
});

document.getElementById(`workspace`).addEventListener(`touchend`, function(e) {
  let currentTouch = new Date().valueOf();

  if (currentTouch - previousTouch < 250) {
    dragging = false;
  }
});

document.getElementById(`workspace`).addEventListener(`touchmove`, function(e) {
  if (!dragging) return;

  let touch = e.targetTouches[0];

  element.style.top = `${touch.pageY - startY}px`;
  element.style.left = `${touch.pageX - startX}px`; 
});