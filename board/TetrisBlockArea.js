class TetrisBlockArea {
    constructor(board) {
        this.cellSize = board.cellSize
        this.rowCells = board.rowCells
        this.colCells = board.colCells
        this.margin = 20
        this.elements = []
        this.prepare()
    }

    prepare() {
        this.x = this.margin
        this.y = this.margin
        this.width = this.cellSize * this.colCells
        this.height = this.cellSize * this.rowCells
    }

    get boundingRect() {
        return {
            left: 0,
            top: 0,
            right: this.width + this.margin * 2,
            bottom: this.height + this.margin * 2,
        }
    }

    addElement(element) {
        element.board = this.board
        this.elements.push(element)
    }

    removeElement(element) {
        let idx = this.elements.indexOf(element)
        this.elements.splice(idx, 1)
    }

    checkRange(block) {
        if (block.x < this.x) {
            return 'CrossLeft'
        }
        if (block.y < this.x) {
            return 'CrossTop'
        }
        if (block.x + block.width > this.x + this.width) {
            return 'CrossRight'
        }
        if (block.y + block.height > this.y + this.height) {
            return 'CrossBottom'
        }
        return 'OK'
    }

    checkCollide(block) {
        for (let element of this.elements) {
            if (element instanceof TetrisBlock) {
                let horizontalCollide = (Math.max(block.x, element.x) < Math.min(block.x + block.width, element.x + element.width))
                let verticalCollide = (Math.max(block.y, element.y) < Math.min(block.y + block.height, element.y + element.height))
                if (horizontalCollide && verticalCollide) {
                    return 'Collide'
                }
            }
        }
        return 'OK'
    }

    eliminateLine() {
        // Line scan, from bottom-left to top-right
        let eliminateCnt = 0
        for (let row = this.rowCells - 1; row >= 0; --row) {
            let eliminate = true
            for (let col = 0; col < this.colCells; ++col) {
                let cell = {
                    y: this.y + row * this.cellSize,
                    x: this.x + col * this.cellSize,
                    width: this.cellSize,
                    height: this.cellSize,
                }
                let result = this.checkCollide(cell)
                // Blank cell
                if (result == 'OK') {
                    eliminate = false
                    break
                }
            }
            if (eliminate == true) {
                // 消除整行
                eliminateCnt++
                this.elements.filter(block => {
                    return (block instanceof TetrisBlock) && (block.y == this.y + row * this.cellSize)
                }, this).forEach(block => {
                    block.eliminate()
                }, this)

                // 该行之上的所有block下沉
                this.elements.filter(block => {
                    return (block instanceof TetrisBlock) && (block.y < this.y + row * this.cellSize)
                }, this).forEach(block => {
                    block.moveDown()
                }, this)
            }
        }
        this.addScore(eliminateCnt)
    }

    addScore(score) {
        this.board.addScore(score)
    }

    draw() {
        const context = this.board.context
        context.fillStyle = "rgba(255,255,255,0.05)";
        context.fillRect(this.x, this.y, this.width, this.height)
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.strokeRect(this.x, this.y, this.width, this.height)

        context.lineWidth = 1
        context.strokeStyle="rgba(255,255,255,0.1)"
        // 绘制网格
        
        for (let row = 0; row < this.rowCells; ++row) {
            const y = this.y + row * this.cellSize
            context.beginPath();
            context.moveTo(this.x, y+0.5)
            context.lineTo(this.x+this.width, y+0.5)
            context.stroke()
        }
        for (let col = 0; col < this.colCells; ++col) {
            const x = this.x + col * this.cellSize
            context.beginPath();
            context.moveTo(x+0.5, this.y)
            context.lineTo(x+0.5, this.y+this.height)
            context.stroke()
        }
    }

    loop() {
        this.eliminateLine()
        this.draw()
        // 绘制方块元素
        this.elements.forEach(element => {
            if (element.loop) {
                element.loop()
            }
        }, this);
    }
}