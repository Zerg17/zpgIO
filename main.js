let canvas = document.getElementById('canvas')

let ctx  = canvas.getContext('2d')

ctx.canvas.width  = ctx.canvas.parentNode.clientWidth * window.devicePixelRatio;
ctx.canvas.height = ctx.canvas.parentNode.clientHeight * window.devicePixelRatio;
w = ctx.canvas.width / window.devicePixelRatio
h = ctx.canvas.height / window.devicePixelRatio
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

ctx.strokeStyle = "#FFFA"
ctx.fillStyle = "#FFFA"
ctx.lineWidth = 0.5

let drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

drawLine(ctx, 0, 50, 0, 50)
drawLine(ctx, 0, 50, 50, 0)