class TetrisGeometry {
    constructor(board) {
        this.blocks = []
        this.events = []

        // 每秒钟下落的次数
        this.fallSpeed = 1
        this.fallCount = 0

        this.board = board

        let cellsPerLine = Math.round(this.board.canvas.width / this.board.cellSize)
        this.x = Math.round(cellsPerLine / 2) * this.board.cellSize
        this.y = 0

        this.init()
    }

    init() {
        this.usePattern(this.defaultPattern)

        this.moveLeftEvt = this.registerKeyboard('ArrowLeft|a', () => {
            this.moveLeft()
        })

        this.moveRightEvt = this.registerKeyboard('ArrowRight|d', () => {
            this.moveRight()
        })

        this.fallEvt = this.registerKeyboard('ArrowDown|s', () => {
            this.fall()
        })

        this.rotateEvt = this.registerKeyboard('Enter| ', () => {
            this.rotate()
        })
    }

    get moveStep() {
        return this.board.cellSize
    }

    get patterns() {
        return []
    }

    get color() {
        return 'red'
    }

    get defaultPattern() {
        this.currentPattern = 0
        return this.patterns[this.currentPattern]
    }

    get nextPattern() {
        this.currentPattern = (this.currentPattern + 1) % this.patterns.length
        return this.patterns[this.currentPattern]
    }

    get prevPattern() {
        this.currentPattern = (this.currentPattern - 1 + this.patterns.length) % this.patterns.length
        return this.patterns[this.currentPattern]
    }

    usePattern(pattern) {
        if (!pattern) {
            console.log("错误的pattern，NULL")
            return
        }

        let blockIdx = 0
        for (let row = 0; row < pattern.length; ++row) {
            for (let col = 0; col < pattern[row].length; ++col) {
                // pattern 中此处有 block
                if (pattern[row][col] == 1) {

                    // 将 block 置入合适的位置
                    while (this.blocks.length <= blockIdx) {
                        let newBlock = new TetrisBlock(this.board)
                        newBlock.color = this.color
                        this.blocks.push(newBlock)
                    }
                    let block = this.blocks[blockIdx]
                    block.x = this.x + col * block.width
                    block.y = this.y + row * block.height

                    blockIdx++
                }
            }
        }
        this.updatePos()
    }

    updatePos() {
        let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = 0, maxY = 0
        this.blocks.forEach(block => {
            minX = Math.min(minX, block.x)
            minY = Math.min(minY, block.y)
            maxX = Math.max(maxX, block.x + block.width)
            maxY = Math.max(maxY, block.y + block.height)
        })
        // 更新 Geometry 的 bounding rect
        this.x = minX
        this.y = minY
        this.width = maxX - minX
        this.height = maxY - minY
    }

    registerKeyboard(key, callback) {
        let $this = this
        let keys = key.split('|')
        let listener = evt => {
            if (keys.indexOf(evt.key) != -1) {
                callback.apply($this)
            }
        }
        window.addEventListener("keydown", listener)
        return {
            key: "keydown",
            listener: listener
        }
    }

    moveLeft() {
        // 全体向左一格
        this.blocks.forEach(block => {
            block.moveLeft()
        }, this);
        // 越出边界，回退操作
        if (!this.checkPos()) {
            this.moveRight()
        }
        this.updatePos()
    }

    moveRight() {
        // 全体向右一格
        this.blocks.forEach(block => {
            block.moveRight()
        }, this);
        this.x += this.board.cellSize
        // 越出边界，回退操作
        if (!this.checkPos()) {
            this.moveLeft()
        }
        this.updatePos()
    }

    fall() {
        // 全体下落一格
        this.blocks.forEach(block => {
            block.moveDown()
        }, this);
        // 非法下落，回退操作
        if (!this.checkPos()) {
            this.blocks.forEach(block => {
                block.moveUp()
            }, this);
        }
        this.updatePos()
    }

    rotate() {
        this.usePattern(this.nextPattern)
        if (!this.checkPos()) {
            this.usePattern(this.prevPattern)
        }
    }

    checkPos() {
        let isLegal = true
        this.blocks.forEach(block => {
            if (!block.checkPos()) {
                isLegal = false
            }
        })
        return isLegal
    }

    draw() {
        this.blocks.forEach(function (block) {
            block.draw()
        }, this);
    }

    loop() {
        // loop per frame: (1000ms/fps = 25ms)
        // 自然下落
        if (this.fallCount < (this.board.fps / this.fallSpeed)) {
            this.fallCount++
        } else {
            this.fallCount = 0
            this.fall()
        }

        this.draw();
    }
}