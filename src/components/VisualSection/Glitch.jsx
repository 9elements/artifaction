export class Glitch {
    constructor(p, res, color) {
        this.p = p
        this.res = res
        this.color = color
        this.width = 400
        this.height = 400
        this.inverted = false

        this.colorCodeStrings = [    
            this.p.color(0, 255, 163, 150),
            this.p.color(56, 244, 109, 150),
            this.p.color(199, 11, 150, 180),
            this.p.color(170, 217, 222, 150),
            this.p.color(251, 113, 113, 255),
        ];
    
        this.colorCodeInvertedStrings = [
        this.p.color(103, 2, 255, 150),
        this.p.color(56, 244, 109, 150),
        this.p.color(56, 244, 109, 255),
        this.p.color(66, 0, 101, 150),
        this.p.color(4, 142, 142, 150),
        ];
    }

    draw(x, y, width, height) {
        if (Math.random() < 0.25) {
            this.inverted = true
        }

        this.p.noStroke()
        if (this.inverted) {
            this.p.fill(this.colorCodeInvertedStrings[this.color])
        } else {
            this.p.fill(this.colorCodeStrings[this.color])
        }

        if (Math.random() < 0.1) {
            this.p.rect(x + this.getRandomInt(x / 2),
            y + this.getRandomInt(y / 2),
            height + this.getRandomInt(height), 
            width + this.getRandomInt(width / 2))        
        } else {
            this.p.rect(x + this.getRandomInt(x),
            y + this.getRandomInt(y / 2),
            width + this.getRandomInt(width / 2),
            height + this.getRandomInt(height))
        }
    }

    getRandomInt(max) {
        return Math.ceil(Math.random() * max) * (Math.round(Math.random()) ? 1 : -1)
      }
}