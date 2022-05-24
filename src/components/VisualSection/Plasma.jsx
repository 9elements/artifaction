export class Plasma {
    constructor(p, vector, height, width, res, color, img, raster) {
        // constructor
        this.p = p
        this.vector = vector
        this.height = height
        this.width = width
        this.res = res
        this.color = color
        this.img = img
        this.raster = raster
        this.blockID = 0
        this.dim = 8
    
        this.backgroundTreshold = 0.6
        this.lx = this.vector.x * res;  
        this.ly = this.vector.y * res;
        this.lw = this.width * res;
        this.lh = this.height * res;
    
        this.blockID = 0
    
        this.seed = Math.random()
    
        this.colorCode = 0
    }

    draw() {
        this.p.image(
            this.img,
            this.vector.x * this.res,
            this.vector.y * this.res,
            this.width * this.res,
            this.height * this.res
          )
    }

}