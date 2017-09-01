class TetrisZBlock extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'orange'
    }

    get patterns() {
        return [[
            [1, 1, 0],
            [0, 1, 1],
        ], [
            [0, 1],
            [1, 1],
            [1, 0],
        ],]
    }
}