for (let i=0; i<shirts.length; i++){
    let newDiv = document.createElement('div');
    newDiv.className = "block";

    let newImg = document.createElement('img');
    if ('white' in shirts[i].colors) {
        newImg.setAttribute("src", `../js/${shirts[i].colors.white.front}`);
    } else {
        newImg.setAttribute("src", `../js/${shirts[i].default.front}`);
    }
    newDiv.appendChild(newImg);

    let newH2 = document.createElement('h2');
    if ('name' in shirts[i] & shirts[i].name != null & shirts[i].name != "") {
        newH2.appendChild(document.createTextNode(shirts[i].name));
    } else {
        newH2.appendChild(document.createTextNode(`no name`));
    }
    newDiv.appendChild(newH2);

    let newP = document.createElement('p');
    if(Object.keys(shirts[i].colors).length == 1){
        newP.appendChild(document.createTextNode(`Available in ${Object.keys(shirts[i].colors).length} color`));
    }
    else{
        newP.appendChild(document.createTextNode(`Available in ${Object.keys(shirts[i].colors).length} colors`));
    }
    newDiv.appendChild(newP);

    let newButton = document.createElement('button');
    newButton.appendChild(document.createTextNode(`Quick View`));
    newDiv.appendChild(newButton);

    newButton = document.createElement('button');
    newButton.className = "right";
    newButton.onclick = function() {
        localStorage.setItem('shirtNum', i);
        location.assign("./details.html");
    };
    newButton.appendChild(document.createTextNode(`See Page`));
    newDiv.appendChild(newButton);

    document.getElementById('main').append(newDiv);
}