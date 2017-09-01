class TetrisBlock {
    constructor(board) {
        this.board = board
        this.x = 0
        this.y = 0
        this.dx = this.dx | 0
        this.dy = this.dy | 0
        this.width = this.board.cellSize
        this.height = this.board.cellSize
        this.colors = ['red', 'blue', 'lightblue', 'yellow', 'purple', 'green', 'orange']
        this.color = 'red'
    }


    moveLeft() {
        this.x -= this.moveStep
    }

    moveRight() {
        this.x += this.moveStep
    }

    fall() {
        this.y += this.moveStep
    }

    freeze() {
        this.frozen = true
    }

    checkPos() {
        // Out of range
        if ((this.realX + this.realWidth) > this.board.canvas.width) {
            return false
        }

        // Less than -1, prevent this.realX equals a minus minum value (like -0.00000000001)
        if (this.realX < 0) {
            return false
        }

        // Land on bottom
        if ((this.realY + this.realHeight) > this.board.canvas.height) {
            return false
        }

        // Land on other blocks
        let otherBlocks = this.board.elements

        return true
    }

    get moveStep() {
        return this.width
    }

    draw() {
        let blocks = this.board.imgs['blocks']
        let context = board.context
        context.save()
        let radius = this.angle * Math.PI / 180
        let center = this.rotateCenter
        context.transform(Math.cos(radius),
            Math.sin(radius),
            -Math.sin(radius),
            Math.cos(radius),
            center.x,
            center.y)
        context.drawImage(blocks, this.dx, this.dy, this.dw, this.dh, this.x - center.x, this.y - center.y, this.width, this.height)
        context.restore()
    }

    loop() {
        // loop per frame: (1000ms/fps = 25ms)
        // 自然下落
        if (!this.frozen) {
            if (this.fallCount != this.fallRate) {
                this.fallCount++
            } else {
                this.fallCount = 0
                this.fall()
            }
        }

        this.draw();
    }
}