const shirts = [{
    "name": "Beep Boop",
    "description": "Once upon a time, a mighty guide guarded the intersection of Forbes and Morewood, and would dutifully direct distracted college students when it was safe to cross the street. Its voice was soothing, strong, and steady. Its name was beep boop.",
    "price": "$19.99",
    "colors": {
        "white": {
            "front": "shirt_images/beepboop-white-front.png",
            "back": "shirt_images/beepboop-white-back.png"
        },
        "blue": {
            "front": "shirt_images/beepboop-blue-front.png",
            "back": "shirt_images/beepboop-blue-back.png"
        },
        "pink": {
            "front": "shirt_images/beepboop-pink-front.png",
            "back": "shirt_images/beepboop-pink-back.png"
        },
        "red": {
            "front": "shirt_images/beepboop-red-front.png",
            "back": "shirt_images/beepboop-red-back.png"
        }
    },
    "default": {
        "front": "shirt_images/default-m-front.png",
        "back": "shirt_images/default-m-back.png"
    }
},
{
    "name": "Car",
    "description": "As you move in to campus, one of the first memories so many students have is driving up to their dorm, unloading their bags, and moving in. How do they arrive to campus? By car, of course!",
    "price": "$10.99",
    "colors": {
        "white": {
            "front": "shirt_images/car-white-front.png",
            "back": "shirt_images/car-white-back.png"
        },
        "blue": {
            "front": "shirt_images/car-blue-front.png",
            "back": "shirt_images/car-blue-back.png"
        },
        "green": {
            "front": "shirt_images/car-green-front.png",
            "back": "shirt_images/car-green-back.png"
        },
        "yellow": {
            "front": "shirt_images/car-yellow-front.png",
            "back": "shirt_images/car-yellow-back.png"
        },
        "red": {
            "front": "shirt_images/car-red-front.png",
            "back": "shirt_images/car-red-back.png"
        }
    },
    "default": {
        "front": "shirt_images/default-w-front.png",
        "back": "shirt_images/default-w-back.png"
    }
},
{
    "name": "Forever Plaid",
    "price": "$13.99",
    "description": "Proudly wear your tartan plaid as a patch on your front shirt pocket. And on the back, ask the important question that all CMU students should know the answer to: got plaid?",
    "colors": {
        "white": {
            "front": "shirt_images/plaid-white-front.png",
            "back": "shirt_images/plaid-white-back.png"
        },
        "pink": {
            "front": "shirt_images/plaid-pink-front.png",
            "back": "shirt_images/plaid-pink-back.png"
        }
    },
    "default": {
        "front": "shirt_images/default-w-front.png",
        "back": "shirt_images/default-w-back.png"
    }
},
{
    "name": "BSUIR",
    "description": "BSUIR mission is to train engineers and scientists capable of generating and implementing innovative ideas, creating competitive high technology products in the spheres of computer science and electronics.",
    "price": "$6.99",
    "colors": {
        "white": {
            "front": "shirt_images/bsuir-white-front.png",
            "back": "shirt_images/bsuir-white-back.png"
        }
    },
    "default": {
        "front": "shirt_images/default-m-front.png",
        "back": "shirt_images/default-m-back.png"
    }
},
{
    "name": "",
    "description": "BSUIR mission is to train engineers and scientists capable of generating and implementing innovative ideas, creating competitive high technology products in the spheres of computer science and electronics.",
    "price": "$6.99",
    "colors": {
        //"white": {
        //    "front": "shirt_images/bsuir-white-front.png",
        //    "back": "shirt_images/bsuir-white-back.png"
        //}
    },
    "default": {
        "front": "shirt_images/default-m-front.png",
        "back": "shirt_images/default-m-back.png"
    }
}];

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
    newButton.appendChild(document.createTextNode(`See Page`));
    newDiv.appendChild(newButton);

    const main = document.querySelector("#main");
    main.append(newDiv);
}