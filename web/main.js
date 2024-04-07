let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

// Поле всегда квадратное

// Fill with zeros
chunk = new Chunk()

function draw() {
    ctx.clearRect(0, 0, w, h)
    chunk.draw(ctx, Math.min(w, h))
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
