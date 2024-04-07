let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

// Поле всегда квадратное
let worldSize = 64

// Fill with zeros
world = new World(worldSize, new Array(worldSize).fill(0).map(() => new Array(worldSize).fill(0)))

function draw() {
    ctx.clearRect(0, 0, w, h)
    world.draw(ctx, Math.min(w, h))
}

function loadWorldFromServer() {
    fetch('/json/chunk/').
    then(response => response.json()).
    then(data => {
        world.update(data)
    })
}

setInterval(loadWorldFromServer, 500)

window.requestAnimationFrame(gameLoop)
function gameLoop() {
    draw()
    window.requestAnimationFrame(gameLoop)
}
