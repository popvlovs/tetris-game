class TetrisGeometry {
    constructor(board) {
        this.blocks = []
        this.events = []

        // 每秒钟下落的次数，不会超过fps数
        this.fallSpeed = 5
        this.fallCount = 0

        this.board = board

        const cellsPerLine = this.board.colCells
        const blockArea = this.board.blockArea
        this.anchor = {
            x: blockArea.x + (Math.floor(cellsPerLine / 2) - 2) * this.board.cellSize,
            y: blockArea.y -this.board.cellSize,
        }
        this.x = 0
        this.y = 0

        this.init()
    }

    init() {
        this.usePattern(this.defaultPattern)

        this.moveLeftEvt = this.registerKeyboard('ArrowLeft|a', () => {
            this.attempt(this.moveLeft)
        })

        this.moveRightEvt = this.registerKeyboard('ArrowRight|d', () => {
            this.attempt(this.moveRight)
        })

        this.fallEvt = this.registerKeyboard('ArrowDown|s', () => {
            this.fall()
        })

        this.rotateEvt = this.registerKeyboard('Enter| ', () => {
            this.attempt(this.rotate)
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

    get pattern() {
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
                    block.x = this.anchor.x + col * block.width
                    block.y = this.anchor.y + row * block.height

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

    unregisterKeyboard(evt) {
        if (!evt) {
            return
        }
        window.removeEventListener(evt.key, evt.listener)
    }

    attempt(action, onFailed) {
        this.save()
        action.apply(this)
        let state = this.checkPos()
        if (!state.OK) {
            this.restore()
            if (onFailed) {
                onFailed.apply(this)
            }
        } else {
            this.updatePos()
        }
    }

    moveLeft() {
        // 全体向左一格
        this.blocks.forEach(block => {
            block.moveLeft()
        }, this);
        this.anchor.x -= this.moveStep
    }

    moveRight() {
        // 全体向右一格
        this.blocks.forEach(block => {
            block.moveRight()
        }, this);
        this.anchor.x += this.moveStep
    }

    moveUp() {
        // 全体向上一格
        this.blocks.forEach(block => {
            block.moveUp()
        }, this);
        this.anchor.y -= this.moveStep
    }

    moveDown() {
        // 全体向下一格
        this.blocks.forEach(block => {
            block.moveDown()
        }, this);
        this.anchor.y += this.moveStep
    }

    fall() {
        let $this = this
        this.attempt(this.moveDown, () => {
            // 将 blocks 变为不可动形态，并托管给 this.board
            this.blocks.forEach(block => {
                //block.color = 'blue'
                $this.board.blockArea.addElement(block)
            })
            // 销毁该形状：取消注册事件
            $this.destroy()
            // 生成新的形状
            $this.board.generateNewBlock()
        })
    }

    destroy() {
        // 清除引用
        this.board.blockArea.removeElement(this)
        this.unregisterKeyboard(this.moveLeftEvt)
        this.unregisterKeyboard(this.moveRightEvt)
        this.unregisterKeyboard(this.fallEvt)
        this.unregisterKeyboard(this.rotateEvt)
    }

    rotate() {
        this.usePattern(this.nextPattern)
    }

    checkPos() {
        let state = {}
        this.blocks.forEach(block => {
            let result = block.checkPos()
            // Check failed
            Object.assign(state, result)
        })
        if (Object.keys(state).length == 0) {
            state.OK = true
        }
        return state
    }

    save() {
        this.blocks.forEach(block => {
            block.save()
        })
        this._anchor = {
            x: this.anchor.x,
            y: this.anchor.y,
        }
        this._currentPattern = this.currentPattern
    }

    restore() {
        this.blocks.forEach(block => {
            block.restore()
        })
        this.anchor = {
            x: this._anchor.x,
            y: this._anchor.y,
        }
        this.currentPattern = this._currentPattern
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