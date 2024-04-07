// const World = window.World

let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

// Поле всегда квадратное
let worldSize = 64

world = new World(worldSize, generateMap(worldSize))

function draw() {
    ctx.clearRect(0, 0, w, h)
    world.drawWorld(ctx, Math.min(w, h))
}

window.requestAnimationFrame(gameLoop);
function gameLoop() {
    draw();
    window.requestAnimationFrame(gameLoop);
}
