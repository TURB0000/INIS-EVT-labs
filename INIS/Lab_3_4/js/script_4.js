const shirtNum = +localStorage.getItem('shirtNum');

let side = "front";

let color = "white";

document.getElementById('name').textContent = shirts[shirtNum].name;

document.getElementById('shirtImg').src = `../js/${shirts[shirtNum].colors[color][side]}`;

document.getElementById('price').textContent = shirts[shirtNum].price;

document.getElementById('description').textContent = shirts[shirtNum].description;

for (let i=0; i<Object.keys(shirts[shirtNum].colors).length; i++){
    let newButton = document.createElement('button');
    newButton.style.backgroundColor = Object.keys(shirts[shirtNum].colors)[i];
    if (Object.keys(shirts[shirtNum].colors)[i] != "blue"){
        newButton.style.color = "black";
    }
    newButton.onclick = function() {
        color = Object.keys(shirts[shirtNum].colors)[i];
        document.getElementById('shirtImg').src = `../js/${shirts[shirtNum].colors[color][side]}`;
    };
    newButton.appendChild(document.createTextNode(Object.keys(shirts[shirtNum].colors)[i]));
    document.getElementById('colors').appendChild(newButton);
}

document.getElementById('sideFront').onclick = function() {
    side = "front";
    document.getElementById('shirtImg').src = `../js/${shirts[shirtNum].colors[color][side]}`;
};

document.getElementById('sideBack').onclick = function() {
    side = "back";
    document.getElementById('shirtImg').src = `../js/${shirts[shirtNum].colors[color][side]}`;
};