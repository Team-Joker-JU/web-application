//===Coordinates represents api response
var realCoordinates = null

var coordinates = [
    [{x: 200, y: 300, collision: false}, {x: 432, y: 131, collision: false}, {x: 232, y: 732, collision: true}, {x: 350, y: 600, collision: false}, {x: 560, y: 21, collision: false}],
    [{x: 300, y: 200, collision: false}, {x: 323, y: 51, collision: false}, {x: 632, y: 100, collision: false}, {x: 350, y: 600, collision: true}, {x: 750, y: 500, collision: false}],
    [{x: 200, y: 300, collision: false}, {x: 432, y: 131, collision: false}, {x: 232, y: 732, collision: true}, {x: 350, y: 600, collision: false}, {x: 560, y: 21, collision: false}],
    [{x: 200, y: 300, collision: false}, {x: 332, y: 161, collision: false}, {x: 122, y: 732, collision: true}, {x: 350, y: 600, collision: false}, {x: 560, y: 21, collision: false}],
    [{x: 200, y: 300, collision: false}, {x: 432, y: 131, collision: false}, {x: 232, y: 732, collision: true}, {x: 310, y: 600, collision: false}, {x: 560, y: 21, collision: false}]
]

const MIDDLE_X = 400
const MIDDLE_Y = 400

var currentPathIndex = coordinates.length - 1
var pagination = 1

//=========================================Get Elements====================================================================
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var nextButton = document.getElementById("next")
var previousButton = document.getElementById("previous")

//Write latest run done by mower

getMowerData(pagination, (data) => {
    realCoordinates = data
    updateCanvas(ctx, coordinates, currentPathIndex, pagination)
})

//=======================================Next/Previous Buttons==========================================================
nextButton.disabled = true
previousButton.disabled = false

nextButton.addEventListener("click", function(event) {
    if(currentPathIndex < 4) {
        currentPathIndex += 1
        updateCanvas(ctx, coordinates, currentPathIndex, pagination)
    } else if (currentPathIndex == coordinates.length && pagination != 1) {
        currentPathIndex = 0
        pagination -= 1
    }

    if(currentPathIndex == coordinates.length && pagination == 1)  {
        nextButton.disabled = true
    }

    console.log(currentPathIndex)
    console.log(pagination)
})

previousButton.addEventListener("click", function(event) {
    if (currentPathIndex == 0) {
        pagination += 1
        getMowerData(pagination, (data) => {
            // realCoordinates = data       lägg till nya paths (data) i realCoordinates (ta inte bort dom gamla)
            currentPathIndex = coordinates.length - 1
            updateCanvas(ctx, coordinates, currentPathIndex)
        })
        
    } else if(currentPathIndex >= 0) {
        currentPathIndex -= 1
        updateCanvas(ctx, coordinates, currentPathIndex)
    }

    nextButton.disabled = false

    console.log(currentPathIndex)
    console.log(pagination)
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

//========================API handling=============================================================

function getMowerData(pagination, callback) {  
    console.log("run") 
    var http = new XMLHttpRequest();
    var url = 'https://ims_api.supppee.workers.dev/api/coord/297295112273134085';

    http.open("GET", url);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(http.responseText);
        } else if (this.status == 404) {
            console.log("Error fetching data");
            callback(null);
        }
    }
}