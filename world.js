class World {
    static BlockType = {
        EMPTY: 0,
        STONE: 1,
        COPPER: 2,
        IRON: 3
    }

    static BlockColor = {
        [World.BlockType.EMPTY]: "#202020",
        [World.BlockType.STONE]: "#808080",
        [World.BlockType.COPPER]: "#FFA500",
        [World.BlockType.IRON]: "#A9A9A9"
    }
    static gridColor = "#202020"
    static borderColor = "#F00000"

    static gridThickness = 0.5
    static borderThickness = 1

    static drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    constructor(dimension, data) {
        this.dimension = dimension
        this.updateWorld(data)
    }

    updateWorld(map) {
        this.map = map
    }

    drawWorld(ctx, resolution) {
        let cellResolution = resolution / this.dimension
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                if (this.map[i][j] !== World.BlockType.EMPTY) {
                    ctx.fillStyle = World.BlockColor[this.map[i][j]]
                    ctx.fillRect(i * cellResolution, j * cellResolution, cellResolution, cellResolution)
                }
            }
        }

        for (let i = 0; i <= this.dimension; i++) {
            ctx.strokeStyle = World.gridColor
            World.drawLine(ctx, i * cellResolution, 0, i * cellResolution, resolution)
            World.drawLine(ctx, 0, i * cellResolution, resolution, i * cellResolution)
        }

        ctx.strokeStyle = World.borderColor
        World.drawLine(ctx, 0, 0, resolution, 0)
        World.drawLine(ctx, 0, 0, 0, resolution)
        World.drawLine(ctx, 0, resolution, resolution, resolution)
        World.drawLine(ctx, resolution, 0, resolution, resolution)
    }
}

function generateMap(worldSize) {
    // Генерация карты со случайными значениями из BlockType
    let blockTypesNumber = Object.keys(World.BlockType).length
    newMapData = new Array(worldSize).fill(0).map(() => new Array(worldSize).fill(0).map(() => Math.floor(Math.random() * blockTypesNumber)))
    return newMapData
}

window.World = World
window.generateMap = generateMap
