class TetrisReverseLBlock extends TetrisBlock {
    constructor(board) {
        super(board)
       
        this.dx = 224
        this.dy = 346
    }

    get verticalCells() {
        return 2
    }

    get horizontalCells() {
        return 3
    }

    get rotateCenter() {
        return {
            x: this.x + 0.5 * this.width,
            y: this.y + 0.75 * this.height,
        }
    }
}