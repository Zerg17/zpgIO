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
        canvas.style.cursor = "default"
        return
    } else {
        canvas.style.cursor = "none"
    }

    // Highlight the block tinting it white
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.fillRect(blockX * (worldResolution / Chunk.dimension), blockY * (worldResolution / Chunk.dimension), worldResolution / Chunk.dimension, worldResolution / Chunk.dimension)
    // Draw info box about the block
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(x, y, 60, 25)
    ctx.fillStyle = "white"
    ctx.font = "8px Arial"
    // Write block type name
    ctx.fillText(Chunk.BlockTypeNames[chunk.Blocks[blockX][blockY].Type], x + 5, y + 10)
    // Write block temperature
    ctx.fillText("T: " + chunk.Blocks[blockX][blockY].Temperature, x + 5, y + 20)

    //draw a crosshair
    ctx.strokeStyle = "white"
    ctx.beginPath()
    ctx.moveTo(x,y)
    ctx.lineTo(x + 60, y)
    ctx.moveTo(x,y)
    ctx.lineTo(x - 5, y)
    ctx.moveTo(x,y)
    ctx.lineTo(x, y + 25)
    ctx.moveTo(x,y)
    ctx.lineTo(x, y - 5)
    ctx.stroke()
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

const fps = 60
let then = performance.now()
window.requestAnimationFrame(gameLoop)
function gameLoop() {
    const delta = now - then
    if (delta > 1000 / fps) {
        then = now - (delta % (1000 / fps))
        draw()
    }
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
