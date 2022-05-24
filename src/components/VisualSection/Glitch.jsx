export class Glitch {
    constructor(p, configuration) {
        this.p = p
        this.configuration = configuration
        this.width = configuration.resolution * configuration.dimension
        this.height = configuration.resolution * configuration.dimension
        this.inverted = false
    }

    draw(x, y, width, height) {
        if (Math.random() < 0.25) {
            this.inverted = true
        }

        this.p.noStroke()
        if (this.inverted) {
            this.p.fill(this.configuration.color[this.configuration.colorScheme].glitchInvertedColor)
        } else {
            this.p.fill(this.configuration.color[this.configuration.colorScheme].glitchColor)
        }

        if (Math.random() < 0.2) {
            this.p.rect(x , y , height, width)
        } else if (Math.random() < 0.6) {
            this.p.rect(x, y, width, height)
        } else {
            this.setGradient(x, y, width, height, this.configuration.color[this.configuration.colorScheme].glitchRainbowColor)
        }
    }

    getRandomInt(max) {
        return Math.ceil(Math.random() * max) * (Math.round(Math.random()) ? 1 : -1)
      }

    setGradient(x, y, w, h, colorMap) {
        this.p.noFill();
        if (colorMap != undefined) {
            if (colorMap.length > 1) {
                let chunks = colorMap.length - 1
                let widthSteps = w / chunks
                for (let i = 0; i < chunks; i++) {
                    let newX = x + (i * widthSteps)
                    let c1 = this.configuration.color[this.configuration.colorScheme].glitchRainbowColor[i]
                    let c2 = this.configuration.color[this.configuration.colorScheme].glitchRainbowColor[i+1]
                    for (let j = newX; j <= newX + widthSteps; j++) {
                        let inter = this.p.map(j, newX, newX + widthSteps, 0, 1);
                        let c = this.p.lerpColor(c1, c2, inter);
                        this.p.stroke(c);
                        this.p.line(j, y, j, y + h);
                    }
                }
            }
        } else {
            let c1 = this.configuration.color[this.configuration.colorScheme].glitchColor
            let c2 = this.configuration.color[this.configuration.colorScheme].glitchInvertedColor
            // Left to right gradient
            for (let i = x; i <= x + w; i++) {
                let inter = this.p.map(i, x, x + w, 0, 1);
                let c = this.p.lerpColor(c1, c2, inter);
                this.p.stroke(c);
                this.p.line(i, y, i, y + h);
            }
        }
    }
}