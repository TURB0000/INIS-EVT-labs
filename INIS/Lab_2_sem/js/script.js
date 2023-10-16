const config = {
    'borderColor': '#000000',
    'borderOpacity': 255,
    'fillColor': '#000000',
    'fillOpacity': 255
}

function hexAndOpacityToRgba(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r},${g},${b},${opacity / 255})`;
}

function lineSizePic(value) {
    context.lineWidth = value;
    if(selectedSvgElement) selectedSvgElement.setAttribute("stroke-width", value);
}

function borderColorPic(value) {
    config.borderColor = value;
    context.strokeStyle = hexAndOpacityToRgba(config.borderColor, config.borderOpacity);
    if(selectedSvgElement) selectedSvgElement.setAttribute("stroke", context.strokeStyle);
}

function borderOpacityPic(value) {
    config.borderOpacity = value;
    context.strokeStyle = hexAndOpacityToRgba(config.borderColor, config.borderOpacity);
    if(selectedSvgElement) selectedSvgElement.setAttribute("stroke", context.strokeStyle);
}

function fillColorPic(value) {
    config.fillColor = value;
    context.fillStyle = hexAndOpacityToRgba(config.fillColor, config.fillOpacity);
    if(selectedSvgElement && selectedSvgElement.getAttribute("fill") != "none") selectedSvgElement.setAttribute("fill", context.fillStyle);
}

function fillOpacityPic(value) {
    config.fillOpacity = value;
    context.fillStyle = hexAndOpacityToRgba(config.fillColor, config.fillOpacity);
    if(selectedSvgElement && selectedSvgElement.getAttribute("fill") != "none") selectedSvgElement.setAttribute("fill", context.fillStyle);
}

var currentTool;

function changeTool(value) {
    switch (value) {
        case "cursor":
            currentTool = cursorMode;
            break;
        case "pen":
            currentTool = penMode;
            break;
        case "ellipse":
            currentTool = ellipseMode;
            break;
        case "rectangle":
            currentTool = rectangleMode;
            break;
        case "line":
            currentTool = lineMode;
            break;
        case "fill":
            currentTool = fillMode;
            break;
    }
    currentTool();

    unselectSvgElement();
}

function changeLayer(value) {
    switch (value) {
        case "canvas":
            canvas.style.visibility = (canvas.style.visibility == "visible"? "hidden": "visible");
            break;
        case "svg":
            svg.style.visibility = (svg.style.visibility == "visible"? "hidden": "visible");
            break;
    }
    currentTool();

    unselectSvgElement();
}

function eraseAll() {
    unselectSvgElement();

    if(canvas.style.visibility == svg.style.visibility){
        return;
    } else if(canvas.style.visibility == "visible"){
        context.clearRect(0, 0, canvas.width, canvas.height);
    } else if(svg.style.visibility == "visible"){
        svg.replaceChildren();
    }
}

const xmlns = "http://www.w3.org/2000/svg";

var penTracker = document.getElementById("penTracker");
var svg = document.getElementById("svg");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.setAttribute('width', window.innerWidth - 2 * canvas.offsetLeft + penTracker.offsetLeft);
canvas.setAttribute('height', window.innerHeight - 2 * canvas.offsetTop + penTracker.offsetTop);

svg.setAttribute('width', canvas.width);
svg.setAttribute('height', canvas.height);

context.lineJoin = 'round';
context.lineCap = 'round';

var bufferCanvas;

var currentSvgElement;

var startDrawX;
var startDrawY;
var endDrawX;
var endDrawY;

var dragging = false;
var selectedSvgElement;
var startTranslateX;
var startTranslateY;

function unselectSvgElement(){
    if(selectedSvgElement){
        selectedSvgElement.classList.remove("selectedSvgFigure");
        selectedSvgElement == null;
        dragging = false;
    }
}

document.addEventListener(`keydown`, function(e) {
    if (selectedSvgElement && e.code == `Escape` && dragging == true) {
      dragging = false;
      selectedSvgElement.setAttribute("transform", `translate(${startTranslateX},${startTranslateY})`);
    } else if (selectedSvgElement && e.code == `Delete`) {
        dragging = false;
        selectedSvgElement.remove();
        selectedSvgElement == null;
    }
});

function cursorMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = null;
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            unselectSvgElement();
            selectedSvgElement = e.target.closest(".svgFigure");

            if(!selectedSvgElement) return;
            selectedSvgElement.classList.add("selectedSvgFigure");

            dragging = true;
            svg.append(selectedSvgElement);
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;

            let xforms = selectedSvgElement.transform.baseVal;
            startTranslateX = xforms.getItem(0).matrix.e;
            startTranslateY = xforms.getItem(0).matrix.f;

            penTracker.onpointermove = function(e) {
                if (!dragging) return;
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                selectedSvgElement.setAttribute("transform", `translate(${startTranslateX + endDrawX - startDrawX},${startTranslateY + endDrawY - startDrawY})`);
            }

            penTracker.onpointerup = function() {
                dragging = false;
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    }
}

var polylinePoints;
var path = new Path2D();

function penMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            bufferCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
            path.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);

            penTracker.onpointermove = function(e) {
                context.putImageData(bufferCanvas, 0, 0);
                path.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
                context.stroke(path);
            }

            penTracker.onpointerup = function() {
                path = new Path2D();
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            polylinePoints = `${e.pageX - canvas.offsetLeft},${e.pageY - canvas.offsetTop}`;
            currentSvgElement = document.createElementNS(xmlns, "polyline");
            svg.appendChild(currentSvgElement);
            currentSvgElement.setAttribute("class", "svgFigure");
            currentSvgElement.setAttribute("stroke-width", context.lineWidth);
            currentSvgElement.setAttribute("stroke-linecap", context.lineCap);
            currentSvgElement.setAttribute("stroke-linejoin", context.lineJoin);
            currentSvgElement.setAttribute("stroke", context.strokeStyle);
            currentSvgElement.setAttribute("fill", "none");
            currentSvgElement.setAttribute("transform", `translate(0,0)`);

            penTracker.onpointermove = function(e) {
                polylinePoints += ` ${e.pageX - canvas.offsetLeft},${e.pageY - canvas.offsetTop}`;
                currentSvgElement.setAttribute("points", polylinePoints);
            }

            penTracker.onpointerup = function() {
                currentSvgElement = null;
                polylinePoints = null;
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    }
}

function ellipseMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            bufferCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;

            penTracker.onpointermove = function(e) {
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                context.putImageData(bufferCanvas, 0, 0);
                context.beginPath();
                context.ellipse((startDrawX + endDrawX) / 2, (startDrawY + endDrawY) / 2,
                                 Math.abs(startDrawX - endDrawX) / 2, Math.abs(startDrawY - endDrawY) / 2, 0, 0, Math.PI * 2);
                context.fill();
                context.stroke();
            }

            penTracker.onpointerup = function() {
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;
            currentSvgElement = document.createElementNS(xmlns, "ellipse");
            svg.appendChild(currentSvgElement);
            currentSvgElement.setAttribute("class", "svgFigure");
            currentSvgElement.setAttribute("stroke-width", context.lineWidth);
            currentSvgElement.setAttribute("stroke-linecap", context.lineCap);
            currentSvgElement.setAttribute("stroke-linejoin", context.lineJoin);
            currentSvgElement.setAttribute("stroke", context.strokeStyle);
            currentSvgElement.setAttribute("fill", context.fillStyle);

            penTracker.onpointermove = function(e) {
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                currentSvgElement.setAttribute("transform", `translate(${(startDrawX + endDrawX) / 2},${(startDrawY + endDrawY) / 2})`);
                currentSvgElement.setAttribute("rx", Math.abs(startDrawX - endDrawX) / 2);
                currentSvgElement.setAttribute("ry", Math.abs(startDrawY - endDrawY) / 2);
            }

            penTracker.onpointerup = function() {
                currentSvgElement = null;
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    }
}

function rectangleMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            bufferCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;

            penTracker.onpointermove = function(e) {
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                context.putImageData(bufferCanvas, 0, 0);
                context.beginPath();
                context.rect((startDrawX > endDrawX? endDrawX: startDrawX), (startDrawY > endDrawY? endDrawY: startDrawY),
                              Math.abs(startDrawX - endDrawX), Math.abs(startDrawY - endDrawY));
                
                context.fill();
                context.stroke();
            }

            penTracker.onpointerup = function() {
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;
            currentSvgElement = document.createElementNS(xmlns, "rect");
            svg.appendChild(currentSvgElement);
            currentSvgElement.setAttribute("class", "svgFigure");
            currentSvgElement.setAttribute("stroke-width", context.lineWidth);
            currentSvgElement.setAttribute("stroke-linecap", context.lineCap);
            currentSvgElement.setAttribute("stroke-linejoin", context.lineJoin);
            currentSvgElement.setAttribute("stroke", context.strokeStyle);
            currentSvgElement.setAttribute("fill", context.fillStyle);

            penTracker.onpointermove = function(e) {
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                currentSvgElement.setAttribute("transform", `translate(${(startDrawX > endDrawX? endDrawX: startDrawX)},${(startDrawY > endDrawY? endDrawY: startDrawY)})`);
                currentSvgElement.setAttribute("width", Math.abs(startDrawX - endDrawX));
                currentSvgElement.setAttribute("height", Math.abs(startDrawY - endDrawY));
            }

            penTracker.onpointerup = function() {
                currentSvgElement = null;
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    }
}

function lineMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            bufferCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;

            penTracker.onpointermove = function(e) {
                context.putImageData(bufferCanvas, 0, 0);
                context.beginPath();
                context.moveTo(startDrawX, startDrawY);
                context.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
                context.stroke();
            }

            penTracker.onpointerup = function() {
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            startDrawX = e.pageX - canvas.offsetLeft;
            startDrawY = e.pageY - canvas.offsetTop;
            currentSvgElement = document.createElementNS(xmlns, "line");
            svg.appendChild(currentSvgElement);
            currentSvgElement.setAttribute("class", "svgFigure");
            currentSvgElement.setAttribute("stroke-width", context.lineWidth);
            currentSvgElement.setAttribute("stroke-linecap", context.lineCap);
            currentSvgElement.setAttribute("stroke-linejoin", context.lineJoin);
            currentSvgElement.setAttribute("stroke", context.strokeStyle);
            currentSvgElement.setAttribute("fill", context.fillStyle);
            currentSvgElement.setAttribute("transform", `translate(${startDrawX},${startDrawY})`);

            penTracker.onpointermove = function(e) {
                endDrawX = e.pageX - canvas.offsetLeft;
                endDrawY = e.pageY - canvas.offsetTop;
                currentSvgElement.setAttribute("x2", endDrawX - startDrawX);
                currentSvgElement.setAttribute("y2", endDrawY - startDrawY);
            }

            penTracker.onpointerup = function() {
                currentSvgElement = null;
                penTracker.onpointermove = null;
                penTracker.releasePointerCapture(e.pointerId);
                penTracker.onpointerup = null;
            }

            penTracker.setPointerCapture(e.pointerId);
        }
    }
}

function fillMode() {
    if(canvas.style.visibility == svg.style.visibility){
        penTracker.onpointerdown = null;
    } else if(canvas.style.visibility == "visible"){
        penTracker.onpointerdown = function(e) {
            let x = Math.round(e.pageX - canvas.offsetLeft);
            let y = Math.round(e.pageY - canvas.offsetTop);
        
            let w = canvas.width;
            let h = canvas.height;
        
            if (x < 0 || y < 0 || x > w - 1 || y > h - 1) return;
        
            bufferCanvas = context.getImageData(0, 0, w, h);
        
            let buf = (x + y * w) * 4;
            let startR = bufferCanvas.data[buf];
            let startG = bufferCanvas.data[buf + 1];
            let startB = bufferCanvas.data[buf + 2];
            let startA = bufferCanvas.data[buf + 3];
        
            let endR = parseInt(config.fillColor.slice(1, 3), 16);
            let endG = parseInt(config.fillColor.slice(3, 5), 16);
            let endB = parseInt(config.fillColor.slice(5, 7), 16);
            let endA = parseInt(config.fillOpacity);
        
            if ((startA == 0 && endA == 0) || (startR == endR && startG == endG && startB == endB && startA == endA)) return;
        
            let posX = [x];
            let posY = [y];
        
            while(posX.length != 0){
                x = posX.pop();
                y = posY.pop();
        
                buf = (x + y * w) * 4;
                bufferCanvas.data[buf] = endR;
                bufferCanvas.data[buf + 1] = endG;
                bufferCanvas.data[buf + 2] = endB;
                bufferCanvas.data[buf + 3] = endA;
        
                if(x > 0){
                    buf = (x - 1 + y * w) * 4;
                    if(bufferCanvas.data[buf + 3] == startA && bufferCanvas.data[buf] == startR && bufferCanvas.data[buf + 1] == startG && bufferCanvas.data[buf + 2] == startB){
                        posX.push(x - 1);
                        posY.push(y);
                    }
                }
                if(x < w - 1){
                    buf = (x + 1 + y * w) * 4;
                    if(bufferCanvas.data[buf + 3] == startA && bufferCanvas.data[buf] == startR && bufferCanvas.data[buf + 1] == startG && bufferCanvas.data[buf + 2] == startB){
                        posX.push(x + 1);
                        posY.push(y);
                    }
                }
                if(y > 0){
                    buf = (x + (y - 1) * w) * 4;
                    if(bufferCanvas.data[buf + 3] == startA && bufferCanvas.data[buf] == startR && bufferCanvas.data[buf + 1] == startG && bufferCanvas.data[buf + 2] == startB){
                        posX.push(x);
                        posY.push(y - 1);
                    }
                }
                if(y < h - 1){
                    buf = (x + (y + 1) * w) * 4;
                    if(bufferCanvas.data[buf + 3] == startA && bufferCanvas.data[buf] == startR && bufferCanvas.data[buf + 1] == startG && bufferCanvas.data[buf + 2] == startB){
                        posX.push(x);
                        posY.push(y + 1);
                    }
                }
            }
            context.putImageData(bufferCanvas, 0, 0);
        }
    } else if(svg.style.visibility == "visible"){
        penTracker.onpointerdown = null;
    }
}