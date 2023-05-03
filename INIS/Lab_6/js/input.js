let element = document.querySelector(`.target`);

let dragging = false;
let follow = false;
let followStart = false;

let startX = 0;
let startY = 0;

let startXDoc = 0;
let startYDoc = 0;

let previousTouch = new Date().valueOf();

document.getElementById(`workspace`).addEventListener(`touchstart`, function(e) {
  if (e.targetTouches.length > 1 && dragging == true) {
    dragging = false;
    follow = false;
    element.style.top = `${startYDoc}px`;
    element.style.left = `${startXDoc}px`;
    return;
  }

  let currentTouch = new Date().valueOf();

  if (e.targetTouches.length == 1 && dragging == false) {
    let touch=e.targetTouches[0];

    let elem = touch.target.closest(`.target`);

    if (!elem) return;

    dragging = true;
    if (currentTouch - previousTouch < 500) {
      follow = true;
      followStart = true;
    }

    element = elem;

    startX = touch.pageX - Number.parseInt(element.style.left || 0);
    startXDoc = Number.parseInt(element.style.left || 0);
    startY = touch.pageY - Number.parseInt(element.style.top || 0);
    startYDoc = Number.parseInt(element.style.top || 0);
  }

  previousTouch = currentTouch;
});

document.getElementById(`workspace`).addEventListener(`touchend`, function(e) {
  if(dragging == true) {
    let currentTouch = new Date().valueOf();

    if (currentTouch - previousTouch < 250 && follow == true && followStart == false) {
      dragging = false;
      follow = false;
    }
    if (followStart == true) {
      followStart = false;
    }
    if (follow == false) {
      dragging = false;
    }
  }
});

document.getElementById(`workspace`).addEventListener(`touchmove`, function(e) {
  if (e.targetTouches.length == 1 && dragging == true) {
    let touch = e.targetTouches[0];

    element.style.top = `${touch.pageY - startY}px`;
    element.style.left = `${touch.pageX - startX}px`;
  }
});