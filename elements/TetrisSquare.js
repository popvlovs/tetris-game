class TetrisSquare extends TetrisBlock {
    constructor(board) {
        super(board)
        
        this.dx = 75
        this.dy = 6
    }

    get verticalCells() {
        return 2
    }

    get horizontalCells() {
        return 2
    }

    rotate() {
        this.angle = this.angle
    }
}