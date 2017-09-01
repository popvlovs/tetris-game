class TetrisLongBar extends TetrisGeometry {
    constructor(board) {
        super(board)
    }

    get color() {
        return 'lightblue'
    }

    get patterns() {
        return [[
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ], [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ]]
    }
}