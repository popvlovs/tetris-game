class TetrisInfoPanel {
    constructor(board) {
        this.board = board
        this.prepare()
    }

    prepare() {
        if (this.board.blockArea) {
            this.x = this.board.blockArea.boundingRect.right
        } else {
            this.x = 0
        }
        this.y = 0
        this.width = 500
        this.height = this.board.canvas.height
    }

    draw() {
        const context = this.board.context
        context.font = "30px Verdana";
        // 创建渐变
        let gradient = context.createLinearGradient(0, 0, 100, 100);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        context.fillStyle = gradient;
        context.fillText(`分数：${this.board.score}`, this.x+50, this.y+50);
    }

    loop() {
        this.draw()
    }
}