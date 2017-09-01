class TetrisReverseLBlock extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'blue'
    }

    get patterns() {
        return [[
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ], [
            [1, 1],
            [1, 0],
            [1, 0],
        ], [
            [1, 1, 1],
            [0, 0, 1],
        ], [
            [0, 1],
            [0, 1],
            [1, 1],
        ],]
    }
}