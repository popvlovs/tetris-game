class TetrisBlock {
    constructor(board) {
        this.board = board
        this.x = 0
        this.y = 0
        this.dw = 74
        this.dh = 74
        this.colors = ['red', 'blue', 'lightblue', 'yellow', 'purple', 'green', 'orange']
        this.color = 'red'
    }

    static newRandomBlock(board) {
        // random val between [0, 7)
        let blockType = parseInt(Math.random() * 7, 10)
        let blocks = [TetrisLBlock, TetrisLongBar, TetrisReverseLBlock, TetrisReverseZBlock, TetrisSquare, TetrisTBlock, TetrisZBlock]
        return new blocks[blockType](board)
    }

    moveLeft() {
        this.x -= this.moveStep
    }

    moveRight() {
        this.x += this.moveStep
    }

    moveDown() {
        this.y += this.moveStep
    }

    moveUp() {
        this.y -= this.moveStep
    }

    checkPos() {
        if (this.board.checkRange(this) != true
            || this.board.checkCollide(this)) {
            return false
        } else {
            return true
        }
    }

    get width() {
        return this.board.cellSize
    }

    get height() {
        return this.width
    }

    get moveStep() {
        return this.width
    }

    get center() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        }
    }

    get angle() {
        if (['lightblue', 'orange'].indexOf(this.color) != -1) {
            return 270
        } else {
            return 0
        }
    }

    get imageSlicePos() {
        let pos = { x: 0, y: 0 }
        switch (this.color) {
            case 'red':
                pos.x = 79
                pos.y = 8
                break

            case 'blue':
                pos.x = 224
                pos.y = 349
                break

            case 'lightblue':
                pos.x = 4
                pos.y = 202
                break

            case 'yellow':
                pos.x = 370
                pos.y = 230
                break

            case 'purple':
                pos.x = 516
                pos.y = 420
                break

            case 'green':
                pos.x = 735
                pos.y = 420
                break

            case 'orange':
                pos.x = 807
                pos.y = 163
                break
        }
        return pos
    }

    get dx() {
        return this.imageSlicePos.x
    }

    get dy() {
        return this.imageSlicePos.y
    }

    set color(color) {
        if (this.colors.indexOf(color) == -1) {
            console.log(`不正确的颜色\'${color}\'，${this.colors.toString()}`)
            return
        }
        this._color = color
    }

    get color() {
        return this._color
    }

    draw() {
        let blocks = this.board.imgs['blocks']
        let context = board.context
        context.save()
        let radius = this.angle * Math.PI / 180
        let center = this.center
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
        this.draw();
    }
}