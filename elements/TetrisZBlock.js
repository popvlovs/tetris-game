class TetrisZBlock extends TetrisBlock {
    constructor(board) {
        super(board)
        
        this.dx = 807
        this.dy = 90
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

    rotate() {
        this.angle = (this.angle + 90) % 180
    }
}