
//===Coordinates represents api response
var coordinates = [
    [{x: 200, y: 300, collision: false}, {x: 432, y: 131, collision: false}, {x: 232, y: 732, collision: true}, {x: 350, y: 600, collision: false}, {x: 560, y: 21, collision: false}],
    [{x: 300, y: 200, collision: false}, {x: 323, y: 51, collision: false}, {x: 632, y: 100, collision: false}, {x: 350, y: 600, collision: true}, {x: 750, y: 500, collision: false}]
]

const MIDDLE_X = 400
const MIDDLE_Y = 400

var currentPathIndex = coordinates.length - 1

//=========================================Get Elements====================================================================
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var nextButton = document.getElementById("next")
var previousButton = document.getElementById("previous")

//Write latest run done by mower
updateCanvas(ctx, coordinates, currentPathIndex)


//=======================================Next/Previous Buttons==========================================================
nextButton.disabled = true
previousButton.disabled = false

nextButton.addEventListener("click", function(event) {
if (!currentPathIndex == coordinates.length - 1) {
    currentPathIndex += 1
    updateCanvas(ctx, coordinates, currentPathIndex)
} 
if (currentPathIndex == coordinates.length - 1) {
    nextButton.disabled = true
    previousButton.disabled = false
}
})

previousButton.addEventListener("click", function(event) {
if (!currentPathIndex == 0) {
    currentPathIndex -= 1
    updateCanvas(ctx, coordinates, currentPathIndex)
} 
if (currentPathIndex == 0) {
    nextButton.disabled = false
    previousButton.disabled = true
}
})

//========================Functions for writing on canvas=============================================================

//Runs in beginning of program and every time previous or next button have been clicked
function updateCanvas(ctx, coordinates, currentPathIndex) {
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

ctx.beginPath();

//Paint start circle
paintCircle(ctx, "green", MIDDLE_X, MIDDLE_Y)

//Start in middle
ctx.moveTo(MIDDLE_X, MIDDLE_Y);

for (var i = 0; i < coordinates[currentPathIndex].length; i++) {
    ctx.lineTo(coordinates[currentPathIndex][i]["x"], coordinates[currentPathIndex][i]["y"]);
    ctx.moveTo(coordinates[currentPathIndex][i]["x"], coordinates[currentPathIndex][i]["y"]);
    if (coordinates[currentPathIndex][i]["collision"]) {
        //Paint collisioon circle
        paintCircle(ctx, "blue", coordinates[currentPathIndex][i]["x"], coordinates[currentPathIndex][i]["y"])
    } 
    else if (i == coordinates[currentPathIndex].length - 1) {
        //Paint end circle
        paintCircle(ctx, "red", coordinates[currentPathIndex][i]["x"], coordinates[currentPathIndex][i]["y"])
    }
}

ctx.stroke();
}


function paintCircle(ctx, color, x, y) {
ctx.stroke();
ctx.beginPath();
ctx.arc(x, y, 10, 0, 2 * Math.PI);
ctx.fillStyle = color;
ctx.fill();
}