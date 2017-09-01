class TetrisSquare extends TetrisGeometry {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'red'
    }

    get patterns() {
        return [[
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],]
    }
}