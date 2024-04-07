let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio

let worldResolution = Math.min(w, h)
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

// Поле всегда квадратное

// Fill with zeros
chunk = new Chunk()

var mouseX = 0
var mouseY = 0

// Function to draw the crosshair at given coordinates
function drawBlockInfo() {
    // Clear the canvas
    var x = mouseX / window.devicePixelRatio
    var y = mouseY / window.devicePixelRatio

    // Calculate block coordinates
    var blockX = Math.floor(x / (worldResolution / Chunk.dimension))
    var blockY = Math.floor(y / (worldResolution / Chunk.dimension))

    //draw nothing if mouse is not over the blocks
    if (blockX < 0 || blockY < 0 || blockX >= Chunk.dimension || blockY >= Chunk.dimension) {
        return
    }

    // Hightlight the block tinting it white
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.fillRect(blockX * (worldResolution / Chunk.dimension), blockY * (worldResolution / Chunk.dimension), worldResolution / Chunk.dimension, worldResolution / Chunk.dimension)
    // Draw info box about the block
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(x + 5, y + 5, 60, 25)
    ctx.fillStyle = "white"
    ctx.font = "8px Arial"
    // Write block type name
    ctx.fillText(Chunk.BlockTypeNames[chunk.Blocks[blockX][blockY].Type], x + 10, y + 15)
    // Write block temperature
    ctx.fillText("T: " + chunk.Blocks[blockX][blockY].Temperature, x + 10, y + 25)

}

function draw() {
    ctx.clearRect(0, 0, w, h)
    chunk.draw(ctx, Math.min(w, h))
    drawBlockInfo();
}

function loadChunkFromServer() {
    fetch('/json/chunk/').
    then(response => response.json()).
    then(data => {
        chunk.update(data)
    })
}

setInterval(loadChunkFromServer, 500)

window.requestAnimationFrame(gameLoop)
function gameLoop() {
    draw()
    window.requestAnimationFrame(gameLoop)
}



// Function to handle mouse move event
function handleMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

}

// Add event listener for mouse move
canvas.addEventListener("mousemove", handleMouseMove);
