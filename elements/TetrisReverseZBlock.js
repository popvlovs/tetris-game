class TetrisReverseZBlock extends TetrisBlock {
    constructor(board) {
        super(board)
        
        this.dx = 516
        this.dy = 347
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

    rotate() {
        this.angle = (this.angle + 90) % 180
    }
}