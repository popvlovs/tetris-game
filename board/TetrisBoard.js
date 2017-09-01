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

        this.prepare()
        this.startLoop()
    }

    static init(onload) {
        return new this(onload)
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

            if (element.draw) {
                element.draw()
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