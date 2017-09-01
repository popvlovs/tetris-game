class TetrisLBlock extends TetrisBlock {
    constructor(board) {
        super(board)
        this.dx = 735
        this.dy = 346
    }
    
    get horizontalCells() {
        return 3
    }

    get verticalCells() {
        return 2
    }

    get rotateCenter() {
        return {
            x: this.x + 0.5 * this.width,
            y: this.y + 0.75 * this.height,
        }
    }
}