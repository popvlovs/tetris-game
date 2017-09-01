class TetrisBoard {
    constructor(onload, fps) {
        this.imgFiles = []
        this.imgs = {}
        this.onload = onload
        this.fps = fps | 40
        this.elements = []
        this.cellSize = 25
        this.rowCells = 20
        this.colCells = 32

        this.frozenBlocks = []

        this.prepare()
        this.startLoop()
    }

    static init(onload) {
        return new this(onload)
    }

    checkRange(block) {
        if (block.x < 0) {
            return 'CrossLeft'
        }

        if (block.x + block.width > this.canvas.width) {
            return 'CrossRight'
        }

        if (block.y + block.height > this.canvas.height) {
            return 'CrossBottom'
        }

        return true
    }

    addElement(element) {
        element.board = this
        this.elements.push(element)
    }

    checkCollide(block) {
        for (let element of this.frozenBlocks) {
            let horizontalCollide = !(Math.max(block.x, element.x) > Math.min(block.x+block.width, element.x+element.width))
            let verticalCollide = !(Math.max(block.y, element.y) > Math.min(block.y+block.height, element.y+element.height))
            if (horizontalCollide || verticalCollide) {
                return true
            }
        }
        return false
    }

    generateNewBlock() {
        let block = TetrisBlock.newRandomBlock(this)
        this.elements.push(block)
    }

    startLoop() {
        let $this = this
        setInterval(function() {$this.loop()}, 1000.0/this.fps)
    }

    loop() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.elements.forEach(function(element) {
            if (element.loop) {
                element.loop()
            }
        }, this);
    }

    prepare() {
        // Set background
        let canvas = this.canvas = document.querySelector("#myCanvas")
        let context = this.context = canvas.getContext("2d")
        context.fillStyle = "#000"
        context.fillRect(0, 0, canvas.width, canvas.height)

        // Read image resources
        let $this = this
        this.imgFiles.push('blocks.png')
        this.readFiles(function() {
            if ($this.onload) {
                $this.onload.apply($this)
            }
        })
    }

    readFiles(callback) {
        let $this = this;
        let readerCount = 0;

        this.imgFiles.forEach(function(file) {
            let filename = file.split('.')[0];
            if (filename in $this.imgs) {
                return
            }

            readerCount++;
            file = './imgs/' + file
            let img = new Image()
            img.src = file
            img.onload = function() {
                readerCount--
                $this.imgs[filename] = img
                if (readerCount == 0) {
                    callback.apply($this);
                }
            }
        }, this);
    }
}