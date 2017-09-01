class TetrisBlock {
    constructor(board) {
        this.board = board
        this.x = this.board.cellSize * Math.floor(this.board.rowCells / 2)
        this.y = 0
        this.dx = this.dx | 0
        this.dy = this.dy | 0
        this.cellSize = this.board.cellSize

        this.fallRate = 40
        this.fallCount = 0
        this.frozen = false

        this.angle = 0

        this.registerKeyboard('ArrowLeft|a', () => {
            if (!this.frozen) {
                this.moveLeft()
            }
        })

        this.registerKeyboard('ArrowRight|d', () => {
            if (!this.frozen) {
                this.moveRight()
            }
        })

        this.registerKeyboard('ArrowDown|s', () => {
            if (!this.frozen) {
                this.fall()
            }
        })

        this.registerKeyboard('Enter| ', () => {
            if (!this.frozen) {
                this.rotate()
            }
        })
    }

    get horizontalCells() {
        return 2
    }

    get verticalCells() {
        return 2
    }

    get dw() {
        return this.horizontalCells * 73
    }

    get dh() {
        return this.verticalCells * 73
    }

    get width() {
        return this.board.cellSize * this.horizontalCells
    }

    get height() {
        return this.board.cellSize * this.verticalCells
    }

    registerKeyboard(key, callback) {
        let $this = this
        let keys = key.split('|')
        window.addEventListener("keydown", evt => {
            if (keys.indexOf(evt.key) != -1) {
                callback.apply($this)
            }
        })
    }

    moveLeft() {
        this.x -= this.moveStep
        if (!this.checkPos()) {
            this.x += this.moveStep
        }
    }

    moveRight() {
        this.x += this.moveStep
        if (!this.checkPos()) {
            this.x -= this.moveStep
        }
    }

    fall() {
        this.y += this.moveStep
        if (!this.checkPos()) {
            this.y -= this.moveStep
            let $this = this
            // Delay freeze
            $this.freeze()
            // New block falls
            $this.board.generateNewBlock()
        }
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

    static newRandomBlock(board) {
        // random val between [0, 7)
        let blockType = parseInt(Math.random() * 7, 10)
        let blocks = [TetrisLBlock, TetrisLongBar, TetrisReverseLBlock, TetrisReverseZBlock, TetrisSquare, TetrisTBlock, TetrisZBlock]
        return new blocks[blockType](board)
    }

    rotate() {
        this.angle = (this.angle + 90) % 360
        if (!this.checkPos()) {
            while (this.realX < 0) {
                this.x += this.moveStep
            }
            while (this.realX + this.realWidth > this.board.canvas.width) {
                this.x -= this.moveStep
            }
            while (this.realY + this.realHeight > this.board.canvas.height) {
                this.y -= this.moveStep
            }
        }
    }

    get moveStep() {
        return this.board.cellSize
    }

    get realWidth() {
        if (this.angle % 180 == 0) {
            return this.width
        }
        if (this.angle % 90 == 0) {
            return this.height
        }
    }

    get realHeight() {
        if (this.angle % 180 == 0) {
            return this.height
        }
        if (this.angle % 90 == 0) {
            return this.width
        }
    }

    get convertOriginX() {
        if (this.angle == 90 || this.angle == 0) {
            return this.x
        } else if (this.angle == 180 || this.angle == 270) {
            return this.x + this.width
        }
    }

    get convertOriginY() {
        if (this.angle == 90 || this.angle == 180) {
            return this.y + this.height
        } else if (this.angle == 0 || this.angle == 270) {
            return this.y
        }
    }

    // TODO: 获取realX的方法
    // x'= (x - x0)*cos(a) - (y - y0)*sin(a) + x0
    get realX() {
        let radius = this.angle * Math.PI / 180
        return Math.round((this.convertOriginX - this.rotateCenter.x) * Math.cos(radius) - (this.convertOriginY - this.rotateCenter.y) * Math.sin(radius) + this.rotateCenter.x)
    }

    // y'= (x - x0)*sin(a) + (y - y0)*cos(a) + y0
    get realY() {
        let radius = this.angle * Math.PI / 180
        return Math.round((this.convertOriginX - this.rotateCenter.x) * Math.sin(radius) + (this.convertOriginY - this.rotateCenter.y) * Math.cos(radius) + this.rotateCenter.y)
    }

    get rotateCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
        }
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