//===Coordinates represents api response
// var coordinates = [
//     [{X: 200, Y: 300, collision: false}, {X: 432, Y: 131, collision: false}, {X: 232, Y: 732, collision: true}, {X: 350, Y: 600, collision: false}, {X: 560, Y: 21, collision: false}],
//     [{X: 300, Y: 200, collision: false}, {X: 323, Y: 51, collision: false}, {X: 632, Y: 100, collision: false}, {X: 350, Y: 600, collision: true}, {X: 750, Y: 500, collision: false}],
//     [{X: 200, Y: 300, collision: false}, {X: 432, Y: 131, collision: false}, {X: 232, Y: 732, collision: true}, {X: 350, Y: 600, collision: false}, {X: 560, Y: 21, collision: false}],
//     [{X: 200, Y: 300, collision: false}, {X: 332, Y: 161, collision: false}, {X: 122, Y: 732, collision: true}, {X: 350, Y: 600, collision: false}, {X: 560, Y: 21, collision: false}],
//     [{X: 200, Y: 300, collision: false}, {X: 432, Y: 131, collision: false}, {X: 232, Y: 732, collision: true}, {X: 310, Y: 600, collision: false}, {X: 560, Y: 21, collision: false}]
// ]

//=========================================Get Elements====================================================================
var c = document.getElementById("myCanvas");
var nextButton = document.getElementById("next")
var previousButton = document.getElementById("previous")
var refreshButton = document.getElementById("refresh")
var pathCounter = document.getElementById("pathCounter")
var loaderIcon = document.getElementById("loadIcon")

//Write latest run done by mower
//=========================================Init============================================================================
var coordinates = []; //Deklarerar array som paths ska ligga i

//Canvas
var ctx = c.getContext("2d");
const CANVAS_HEIGHT = ctx.canvas.height
const CANVAS_WIDTH = ctx.canvas.width
const MIDDLE_X = ctx.canvas.width/2
const MIDDLE_Y = ctx.canvas.height/2

//Globala variabler
var currentPathIndex;
var pagination = 1

//Visuals
var counter = 1 //Only used for visuals
loaderIcon.style.display = "none"

//Get data initially to draw path on screen
getMowerData(pagination, (data) => {
    coordinates = data
    currentPathIndex = data.length - 1
    updatePathCounter(0)
    updateCanvas(ctx, coordinates, currentPathIndex, pagination)
})

//=======================================Next/Previous Buttons==========================================================
nextButton.disabled = true
previousButton.disabled = false

nextButton.addEventListener("click", function(event) {
    if (currentPathIndex == 0) {
        previousButton.disabled = false
    }
    if(currentPathIndex < coordinates.length - 1) {
        currentPathIndex += 1
        updatePathCounter(-1)
        updateCanvas(ctx, coordinates, currentPathIndex, pagination)
    } else if (currentPathIndex == coordinates.length && pagination != 1) {
        currentPathIndex = 0
        pagination -= 1
    }

    if(currentPathIndex == coordinates.length - 1 && pagination == 1)  {
        nextButton.disabled = true
    }
})

previousButton.addEventListener("click", function(event) {
    if (currentPathIndex == 0) {
        pagination += 1
        previousButton.disabled = true
        toggleLoaderIcon()
        getMowerData(pagination, (data) => {
            //Adding new paths to list with paths
            if (data.length != 0) {
                for (path in data) {
                    coordinates.unshift(data[path])
                }
                currentPathIndex = data.length - 1
                updatePathCounter(1)
                toggleLoaderIcon()
                previousButton.disabled = false
                updateCanvas(ctx, coordinates, currentPathIndex)
            } else {
                toggleLoaderIcon()
                updateCanvas(ctx, coordinates, 0)
            }
        })
        
    } else if(currentPathIndex >= 0) {
        currentPathIndex -= 1
        updatePathCounter(1)
        updateCanvas(ctx, coordinates, currentPathIndex)
    }
    nextButton.disabled = false
})

refreshButton.addEventListener("click", function(event) {
    pagination = 1;
    getMowerData(pagination, (data) => {
        coordinates = data
        currentPathIndex = data.length - 1
        updatePathCounter(0)
        previousButton.disabled = false
        nextButton.disabled = true
        updateCanvas(ctx, coordinates, currentPathIndex)
    })
})

//========================Functions for writing on canvas=============================================================

//Runs in beginning of program and every time previous or next button have been clicked
function updateCanvas(ctx, coordinates, currentPathIndex) {
    const offset = getOffset(coordinates[currentPathIndex])
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.beginPath();

    //Paint start circle
    paintCircle(ctx, "green", MIDDLE_X, MIDDLE_Y)

    //Start in middle
    ctx.moveTo(MIDDLE_X, MIDDLE_Y);

    for (var i = 0; i < coordinates[currentPathIndex].length; i++) {
        const X = coordinates[currentPathIndex][i]["X"] * offset + MIDDLE_X
        const Y = coordinates[currentPathIndex][i]["Y"] * offset + MIDDLE_Y
        const collision = coordinates[currentPathIndex][i]["collision"]

        ctx.lineTo(X, Y);
        ctx.moveTo(X, Y);
        if (collision) {
            //Paint collisioon circle
            paintCircle(ctx, "blue", X, Y)
        } 
        else if (i == coordinates[currentPathIndex].length - 1) {
            //Paint end circle
            paintCircle(ctx, "red", X, Y)
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

function getOffset(paths) {
    const standardOffset = 20
    var offset = standardOffset
    furthestDistanceX = 0
    furthestDistanceY = 0
    for (i in paths) {
        var path = paths[i]
        if (Math.abs(path["X"]) > furthestDistanceX) furthestDistanceX = Math.abs(path["X"])
        if (Math.abs(path["Y"]) > furthestDistanceY) furthestDistanceY = Math.abs(path["Y"])
    }


    if ((furthestDistanceX * (CANVAS_WIDTH / CANVAS_HEIGHT)) >= (furthestDistanceY *(CANVAS_HEIGHT / CANVAS_WIDTH))) {
        if ((furthestDistanceX * standardOffset + MIDDLE_X) > CANVAS_WIDTH) {
            offset = Math.floor(MIDDLE_X / furthestDistanceX)

            //Offset får inte vara noll:
            offset = (offset == 0) ? 1 : offset
            //Kolla om offset fortfarande är för stor, annars räkna ut nu offset
            console.log("Comes here")
            if ((furthestDistanceX * offset + MIDDLE_X) > CANVAS_WIDTH) {
                offset = 1 / Math.ceil((furthestDistanceX * offset + MIDDLE_X) / CANVAS_WIDTH) //tar 1 dividerat på uträkningen för att få division istället för multiplikation i updateCanvas
            }
        }
    } else {
        if ((furthestDistanceY * standardOffset + MIDDLE_Y) > CANVAS_HEIGHT) {
            offset = Math.floor(MIDDLE_Y / furthestDistanceY)

            //Offset får inte vara noll:
            offset = (offset == 0) ? 1 : offset

            //Kolla om offset fortfarande är för stor, annars räkna ut ny offset
            if ((furthestDistanceY * offset + MIDDLE_Y) > CANVAS_HEIGHT) {
                offset = 1 / Math.ceil((furthestDistanceY * offset + MIDDLE_Y) / CANVAS_HEIGHT) //tar 1 dividerat på uträkningen för att få division istället för multiplikation i updateCanvas
            }
        }
    }
    return offset

}

//========================API handling=============================================================

function getMowerData(pagination, callback) {  
    console.log("Fetching data") 
    var http = new XMLHttpRequest();
    var url = 'https://ims_api.supppee.workers.dev/api/coord/' + pagination;

    http.open("GET", url);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(http.responseText));
        } else if (this.status == 404) {
            console.log("Error fetching data");
            callback(null);
        }
    }
}

//========================Functions==================================================================

function updatePathCounter(value) {
    if (value == 0) {
        counter = 1
        pathCounter.innerHTML = "Path: " + counter + " (Latest)"
    } else {
        counter += value
        if (counter == 1) {
            pathCounter.innerHTML = "Path: " + counter + " (Latest)"
        }
        else {
            pathCounter.innerHTML = "Path: " + counter
        }
    }
}

function toggleLoaderIcon() {
    if (loaderIcon.style.display == "none") {
        loaderIcon.style.display = ""
    }
    else {
        loaderIcon.style.display = "none"
    }
}