class TetrisLongBar extends TetrisBlock {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'lightblue'
    }

    get patterns() {
        return [[
            [1, 1, 1, 1],
        ], [
            [1],
            [1],
            [1],
            [1],
        ]]
    }
}