class TetrisTBlock extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'yellow'
    }

    get patterns() {
        return [[
            [0, 1, 0],
            [1, 1, 1],
        ], [
            [1, 0],
            [1, 1],
            [1, 0],
        ], [
            [1, 1, 1],
            [0, 1, 0],
        ], [
            [0, 1],
            [1, 1],
            [0, 1],
        ],]
    }
}