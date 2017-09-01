class TetrisReverseZBlock extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'purple'
    }

    get patterns() {
        return [[
            [0, 1, 1],
            [1, 1, 0],
        ], [
            [1, 0],
            [1, 1],
            [0, 1],
        ],]
    }
}