class TetrisTBlock extends TetrisBlock {
    constructor(board) {
        super(board)
        
        this.dx = 370
        this.dy = 157
        this.angle = 90
    }

    get verticalCells() {
        return 3
    }

    get horizontalCells() {
        return 2
    }

    get rotateCenter() {
        return {
            x: this.x + 0.75 * this.width,
            y: this.y + 0.5 * this.height,
        }
    }
}