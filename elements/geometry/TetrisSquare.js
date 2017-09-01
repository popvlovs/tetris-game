class TetrisSquare extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'red'
    }

    get patterns() {
        return [[
            [1, 1],
            [1, 1],
        ],]
    }
}