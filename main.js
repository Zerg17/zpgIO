let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio
let w = ctx.canvas.width / window.devicePixelRatio
let h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

// Enum с типами блоков
let BlockType = {
    EMPTY: 0,
    STONE: 1,
    COPPER: 2,
    IRON: 3
}

// Массив с цветами блоков
let BlockColor = {
    [BlockType.EMPTY]: "#202020",
    [BlockType.STONE]: "#808080",
    [BlockType.COPPER]: "#FFA500",
    [BlockType.IRON]: "#A9A9A9"
}

// Цвет линий
let gridColor = "#202020"
let borderColor = "#F00000"

ctx.lineWidth = 0.5

// Поле всегда квадратное
let map_size = 64

// Массив для хранения карты размером map_size x map_size с начальными значениями 0
let mapData = new Array(map_size).fill(0).map(() => new Array(map_size).fill(0))

let drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function generateMap() {
    // Генерация карты со случайными значениями из BlockType
    let blockTypesNumber = Object.keys(BlockType).length
    newMapData = new Array(map_size).fill(0).map(() => new Array(map_size).fill(0).map(() => Math.floor(Math.random() * blockTypesNumber)))
    return newMapData
}

function drawMap(ctx, map_size, mapData) {
    // Размер клетки определяется меньшей стороной канваса
    let field_size = Math.min(w, h)
    let cell_size = field_size / map_size
    // Отрисовка сетки
    for (let i = 0; i <= map_size; i++) {
        ctx.strokeStyle = gridColor
        drawLine(ctx, i * cell_size, 0, i * cell_size, field_size)
        drawLine(ctx, 0, i * cell_size, field_size, i * cell_size)
    }

    // Отрисовка блоков
    for (let i = 0; i < map_size; i++) {
        for (let j = 0; j < map_size; j++) {
            // Если блок не пустой, то отрисовываем его
            if (mapData[i][j] !== BlockType.EMPTY) {
                ctx.fillStyle = BlockColor[mapData[i][j]]
                ctx.fillRect(i * cell_size, j * cell_size, cell_size, cell_size)
            }
        }
    }

    // Отрисовка границ поля
    ctx.strokeStyle = borderColor
    drawLine(ctx, 0, 0, field_size, 0)
    drawLine(ctx, 0, 0, 0, field_size)
    drawLine(ctx, 0, field_size, field_size, field_size)
    drawLine(ctx, field_size, 0, field_size, field_size)
}

function draw() {
    ctx.clearRect(0, 0, w, h)
    drawMap(ctx, map_size, mapData)
}


mapData = generateMap()
gameSetup()
window.requestAnimationFrame(gameLoop);
function gameLoop() {
    draw();
    window.requestAnimationFrame(gameLoop);
}
