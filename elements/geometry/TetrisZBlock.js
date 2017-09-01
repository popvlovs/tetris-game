class TetrisZBlock extends TetrisGeometry {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'orange'
    }

    get patterns() {
        return [[
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0],
        ], [
            [0, 0, 0, 0],
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 0, 1, 0],
        ],]
    }
}