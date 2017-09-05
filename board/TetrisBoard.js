class TetrisBoard {
    constructor(onload, fps) {
        this.imgFiles = []
        this.imgs = {}
        this.onload = onload
        this.fps = fps | 100
        this.elements = []

        // 每个方块的尺寸（像素）
        this.cellSize = 35
        // 方块区域每一列方块数（高度）
        this.rowCells = 20
        // 方块区域每一行方块数（宽度）
        this.colCells = 10

        this.score = 0
        this.frozenBlocks = []

        this.prepare()
        this.startLoop()
    }

    static run() {
         return new this(this.afterLoaded, 100)
    }

    static afterLoaded() {
        // 设置方块区域
        const blockArea = this.blockArea = new TetrisBlockArea(this)
        this.addElement(blockArea)

        // 设置得分/操作/信息区域
        const infoArea = this.infoArea = new TetrisInfoPanel(this)
        this.addElement(infoArea)

        // 设置主区域
        this.canvas.width = this.width = blockArea.boundingRect.right - blockArea.boundingRect.left + infoArea.width
        this.canvas.height = this.height = blockArea.boundingRect.bottom - blockArea.boundingRect.top

        // 开始
        this.generateNewBlock()
    }

    addScore(score) {
        this.score += score
        //this.infoArea.addScore()
    }

    addElement(element) {
        element.board = this
        this.elements.push(element)
    }

    removeElement(element) {
        let idx = this.elements.indexOf(element)
        this.elements.splice(idx, 1)
    }

    generateNewBlock() {
        let block = TetrisBlock.newRandomBlock(this)
        // 检查游戏结束：如果在初始化阶段即发生碰撞，则视为游戏结束
        let state = block.checkPos()
        if (state.Collide) {
            block.destroy()
            this.gameover()
            return
        }
        this.blockArea.addElement(block)
    }

    startLoop() {
        let $this = this
        setInterval(function () { $this.loop() }, 1000.0 / this.fps)
    }

    prepare() {
        let canvas = this.canvas = document.querySelector("#myCanvas")
        let context = this.context = canvas.getContext("2d")
        // 加载图片资源
        let $this = this
        this.imgFiles.push('blocks.png')
        this.readFiles(() => {
            if ($this.onload) {
                $this.onload.apply($this)
            }
        })
    }

    readFiles(callback) {
        let $this = this;
        let readerCount = 0;

        this.imgFiles.forEach(function (file) {
            let filename = file.split('.')[0];
            if (filename in $this.imgs) {
                return
            }
            readerCount++;
            file = './imgs/' + file
            let img = new Image()
            img.src = file
            img.onload = () => {
                readerCount--
                $this.imgs[filename] = img
                if (readerCount == 0) {
                    callback.apply($this);
                }
            }
        }, this);
    }

    gameover() {
        alert('Game over!')
    }

    loop() {
        const context = this.context
        // 重绘界面：先清除再绘制
        context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // 绘制大背景
        //context.fillStyle = "rgba(255,255,255,0.2)";
        //context.fillRect(0, 0, this.width, this.height)
        // context.lineWidth = 2;
        // context.strokeStyle = "white";
        // context.strokeRect(0, 0, this.width, this.height)

        // 绘制所有子元素
        this.elements.forEach(element => {
            if (element.loop) {
                element.loop()
            }
        }, this);

        
    }
}