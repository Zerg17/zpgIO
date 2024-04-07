let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

ctx.strokeStyle = "#202020"
ctx.fillStyle = "#808080"
ctx.lineWidth = 1

// Поле всегда квадратное
let map_size = 64

// Массив для хранения карты размером map_size x map_size с рандомными значениями
let mapData = new Array(map_size).fill(0).map(() => new Array(map_size).fill(0).map(() => Math.random() > 0.5 ? 1 : 0))

let drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

let drawMap = (ctx, map_size, mapData) => {
    // Размер клетки определяется меньшей стороной канваса
    let field_size = Math.min(w, h)
    let cell_size = field_size / map_size
    for (let i = 0; i <= map_size; i++) {
        drawLine(ctx, i * cell_size, 0, i * cell_size, field_size)
        drawLine(ctx, 0, i * cell_size, field_size, i * cell_size)
    }
    for (let i = 0; i < map_size; i++) {
        for (let j = 0; j < map_size; j++) {
            if (mapData[i][j] === 1) {
                ctx.fillRect(i * cell_size, j * cell_size, cell_size, cell_size)
            }
        }
    }

}

drawMap(ctx, map_size, mapData)
