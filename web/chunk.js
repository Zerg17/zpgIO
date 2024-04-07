class Chunk {
    static BlockType = {
        EMPTY: 0,
        STONE: 1,
        COPPER: 2,
        IRON: 3,
        RUBY: 4
    }

    static BlockTypeNames = {
        [Chunk.BlockType.EMPTY]: "EMPTY",
        [Chunk.BlockType.STONE]: "STONE",
        [Chunk.BlockType.COPPER]: "COPPER",
        [Chunk.BlockType.IRON]: "IRON",
        [Chunk.BlockType.RUBY]: "RUBY"
    }

    static BlockColor = {
        [Chunk.BlockType.EMPTY]: "#202020",
        [Chunk.BlockType.STONE]: "#808080",
        [Chunk.BlockType.COPPER]: "#FFA500",
        [Chunk.BlockType.IRON]: "#A9A9A9",
        [Chunk.BlockType.RUBY]: "#FF0000"
    }
    static gridColor = "#202020"
    static borderColor = "#F00000"
    static dimension = 64

    static gridThickness = 0.5
    static borderThickness = 1

    static drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    constructor() {
        this.Blocks = new Array(Chunk.dimension).fill(0).map(() => new Array(Chunk.dimension).fill(0).map(() => ({Type: Chunk.BlockType.EMPTY})))
        console.log(this.Blocks)
    }

    update(data) {
        this.Blocks = data.Blocks
    }

    draw(ctx, resolution) {
        let blockResolution = resolution / Chunk.dimension
        for (let i = 0; i < Chunk.dimension; i++) {
            for (let j = 0; j < Chunk.dimension; j++) {
                if (this.Blocks[i][j].Type !== Chunk.BlockType.EMPTY) {
                    ctx.fillStyle = Chunk.BlockColor[this.Blocks[i][j].Type]
                    ctx.fillRect(i * blockResolution, j * blockResolution, blockResolution, blockResolution)
                }
            }
        }

        for (let i = 0; i <= Chunk.dimension; i++) {
            ctx.strokeStyle = Chunk.gridColor
            Chunk.drawLine(ctx, i * blockResolution, 0, i * blockResolution, resolution)
            Chunk.drawLine(ctx, 0, i * blockResolution, resolution, i * blockResolution)
        }

        ctx.strokeStyle = Chunk.borderColor
        ctx.strokeRect(0, 0, resolution, resolution)
    }
}

window.Chunk = Chunk
