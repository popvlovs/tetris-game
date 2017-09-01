class TetrisLongBar extends TetrisBlock {
    constructor(board) {
        super(board)
        this.dx = 4
        this.dy = 200
    }

    get verticalCells() {
        return 4
    }

    get horizontalCells() {
        return 1
    }

    get rotateCenter() {
        return {
            x: this.x + 0.5 * this.width,
            y: this.y + 3/8 * this.height,
        }
    }

    rotate() {
        this.angle = (this.angle + 90) % 180
    }
}