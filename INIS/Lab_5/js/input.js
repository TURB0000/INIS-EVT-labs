let element = document.querySelector(`.target`);

let dragging = false;

let startX = 0;
let startY = 0;

let startXDoc = 0;
let startYDoc = 0;

let startStyle = ``;

document.getElementById(`workspace`).addEventListener(`mousedown`, function(e) {
  if (e.which != 1) {
    return;
  }

  let elem = e.target.closest(`.target`);

  if (!elem) return; 

  if (dragging == true){
    return;
  }

  dragging = true;

  element = elem;

  startX = e.pageX - Number.parseInt(element.style.left || 0);
  startXDoc = Number.parseInt(element.style.left || 0);
  startY = e.pageY - Number.parseInt(element.style.top || 0);
  startYDoc = Number.parseInt(element.style.top || 0);
});

document.getElementById(`workspace`).addEventListener(`mousemove`, function(e) {
  if (!dragging) return;

  element.style.top = `${e.pageY - startY}px`;
  element.style.left = `${e.pageX - startX}px`;
});

document.getElementById(`workspace`).addEventListener(`mouseup`, function() {
  dragging = false;
  element.style.backgroundColor = startStyle;
});

document.addEventListener(`keyup`, function(e) {
  if (e.code == `Escape` && dragging == true) {
    dragging = false;
    element.style.top = `${startYDoc}px`;
    element.style.left = `${startXDoc}px`;
    element.style.backgroundColor = startStyle;
  }
});

document.getElementById(`workspace`).addEventListener(`dblclick`, function(e) {
  let elem = e.target.closest(`.target`);

  if (!elem) return;

  dragging = true;

  element = elem;

  startX = e.pageX - Number.parseInt(element.style.left || 0);
  startXDoc = Number.parseInt(element.style.left || 0);
  startY = e.pageY - Number.parseInt(element.style.top || 0);
  startYDoc = Number.parseInt(element.style.top || 0);
  startStyle = element.style.backgroundColor;

  element.style.backgroundColor = `green`;
});