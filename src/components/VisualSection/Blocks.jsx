import { Block } from "./Block"
import { Plasma } from "./Plasma"
import { Glitch } from "./Glitch"

// Format Function
String.prototype.format = function () {
  var args = arguments
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match
  })
}

export class Blocks {
  constructor(p, dimensions, resolution) {
    // Set p as p5js handle
    this.p = p
    this.dimensions = dimensions
    this.resolution = resolution

    this.artifacts_dimensions = [
      [4, 4],
      [3, 3],
      [2, 2]
    ]
    this.artifacts = [1, 1, 3]

    // Some empty arrays
    this.grid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    this.overlayGrid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    
    this.overOverlayGrid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))

    this.grainGrid = Array(this.dimensions)
    .fill()
    .map(() => Array(this.dimensions).fill(-1))

    this.images = []
    this.backgroundImages = []

    this.background = null;
    this.grain = null;
    this.blocks = [[], []]

  }

  // bg, secondbg, fg, highlight
  // Some Helper Functions
  getRandomInt(max) {
    max = Math.floor(max)
    return Math.floor(Math.random() * (max + 1))
  }

  // Load SVGs
  loadSVGs() {
    // Load first set up images
    for (let j = 0; j < 14; j++) {
      var z = j + 1
      let str = "images/images/{0}.svg".format(z)
      let SVGFile = this.p.loadSVG(str)
      this.images.push(SVGFile)
    }

    for (let j = 0; j < 5; j++) {
      var z = j + 1
      let str = "images/background/{0}.svg".format(z)
      let SVGFile = this.p.loadSVG(str)
      this.backgroundImages.push(SVGFile)
    }

    this.grainImages = this.p.loadSVG("images/plasma/grain.svg")

  }

  collisionCheck(grid, x, y, width, height) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (grid[i][j] !== -1) return true
      }
    }
    return false
  }

  fillgrid(v, width, height, imageNumber, grid) {
    for (var i = v.x; i < v.x + width; i++) {
      for (var j = v.y; j < v.y + height; j++) {
        grid[i][j] = imageNumber
      }
    }
  }

  generatePosition(grid, width, height) {
    var x,
      y,
      tries = 0

    x = this.getRandomInt(this.dimensions - width)
    y = this.getRandomInt(this.dimensions - height)

    while (this.collisionCheck(grid, x, y, width, height)) {
      x = this.getRandomInt(this.dimensions - width)
      y = this.getRandomInt(this.dimensions - height)
      tries++
      if (tries === 150) {
        return [false, null]
      }
    }

    // Create a Vector and fill the internal grid
    var v = this.p.createVector(x, y)
    this.fillgrid(v, width, height, 1, grid)

    return [true, v]
  }

  colorize() {
    // Give it some color
    this.path = this.p.querySVG("svg")

    for (let i = 0; i < this.path.length; i++) {
      if (this.path[i].elt.id == "Layer1") {
        this.path[i].attribute(
          "style",
          "fill:" + this.configuration.color[this.configuration.colorScheme].foregroundColor
        )
        this.path[i].attribute("z", "1")
        this.path[i].attribute("version", "")
        this.path[i].attribute("xmlns", "")
        this.path[i].attribute("xmlns:xlink", "")
        this.path[i].attribute("xml:space", "")
      }
      if (this.path[i].elt.id == "Layer2") {
        this.path[i].attribute(
          "style",
          "fill:" + this.configuration.color[this.configuration.colorScheme].foregroundColor
        )
        this.path[i].attribute("z", "2")
        this.path[i].attribute("version", "")
        this.path[i].attribute("xmlns", "")
        this.path[i].attribute("xmlns:xlink", "")
        this.path[i].attribute("xml:space", "")
      }
      if (this.path[i].elt.id == "Layer3") {
        this.path[i].attribute(
          "style",
          "fill:" + this.configuration.color[this.configuration.colorScheme].highlightColor
        )
        this.path[i].attribute("z", "2")
        this.path[i].attribute("version", "")
        this.path[i].attribute("xmlns", "")
        this.path[i].attribute("xmlns:xlink", "")
        this.path[i].attribute("xml:space", "")
      }
    }
  }

  loadConfiguration() {
    this.configuration = {
      dimensions: this.dimensions,
      resolution: this.resolution,
      colorScheme: 0,
      color : [{
        backgroundColor: this.p.color(170, 217, 222, 255),
        foregroundColor : this.p.color(0, 0, 0, 255),
        secondBackgroundColor : this.p.color(189, 255, 154, 255),
        highlightColor: this.p.color(255, 255, 255, 255),
        shadeColor: this.p.color(0, 0, 0, 255),
        glitchColor: this.p.color(0, 255, 163, 150),
        glitchInvertedColor: this.p.color(103, 2, 255, 150),
      }, {
        backgroundColor : this.p.color(255, 86, 255, 255),
        foregroundColor : this.p.color(189, 255, 154, 255),
        secondBackgroundColor : this.p.color(170, 217, 222, 255),
        highlightColor: this.p.color(255, 255, 255, 255),
        shadeColor: this.p.color(255, 86, 255, 255),
        glitchColor: this.p.color(56, 244, 109, 150),
        glitchInvertedColor: this.p.color(56, 244, 109, 150),
      }, {
        backgroundColor : this.p.color(103, 2, 255, 255),
        foregroundColor : this.p.color(170, 217, 222, 255),
        secondBackgroundColor : this.p.color(189, 255, 154, 255),
        highlightColor: this.p.color(255, 184, 0, 255),
        shadeColor: this.p.color(103, 2, 255, 255),
        glitchColor: this.p.color(199, 11, 150, 180),
        glitchInvertedColor: this.p.color(56, 244, 109, 255),
      }, {
        backgroundColor : this.p.color(189, 255, 154, 255),
        foregroundColor : this.p.color(0, 0, 0, 255),
        secondBackgroundColor : this.p.color(170, 217, 222, 255),
        highlightColor: this.p.color(255, 86, 255, 255),
        shadeColor: this.p.color(255, 86, 255, 255),
        glitchColor: this.p.color(170, 217, 222, 150),
        glitchInvertedColor: this.p.color(66, 0, 101, 150),
      }, {
        backgroundColor : this.p.color(0, 0, 0, 255),
        foregroundColor : this.p.color(255, 86, 255, 255),
        secondBackgroundColor : this.p.color(170, 217, 222, 255),
        highlightColor: this.p.color(0, 0, 0, 255),
        shadeColor: this.p.color(255, 86, 255, 255),
        glitchColor: this.p.color(251, 113, 113, 255),
        glitchInvertedColor: this.p.color(4, 142, 142, 150),
      }, {
        backgroundColor : this.p.color(0, 0, 0, 255),
        foregroundColor : this.p.color(255, 255, 255, 255),
        secondBackgroundColor : this.p.color(0, 0, 0, 0),
        highlightColor: this.p.color(0, 0, 0, 255),
        shadeColor: this.p.color(0, 0, 0, 255),
        glitchColor: this.p.color(251, 113, 113, 255),
        glitchInvertedColor: this.p.color(4, 142, 142, 150),
        glitchRainbowColor: [
          this.p.color(255, 0, 0, 255),
          this.p.color(255, 255, 0, 255),
          this.p.color(0, 0, 255, 255),
          this.p.color(238, 130, 238, 255),
        ],
      }],
    }
  }

  Init() {
    // Load SVGs and Colors
    this.loadSVGs()
    this.loadConfiguration()
  }

  setSVGId(id) {
    for (let j = 0; j < this.backgroundImages.length; j++) {
      this.backgroundImages[j].elt.setAttribute("id", id)
    }
    for (let j = 0; j < this.images.length; j++) {
      this.images[j].elt.setAttribute("id", id)
    }
  }

  Phase1() {
    this.setSVGId("Layer1")
    
    // Generate a background image
    var vector = this.generatePosition(
      this.grid,
      this.dimensions,
      this.dimensions
    )
    this.background = new Block(this.p,
                                vector[1],
                                this.dimensions,
                                this.dimensions,
                                this.resolution,
                                this.configuration.color[this.configuration.colorScheme].foregroundColor,
                                this.backgroundImages[this.getRandomInt(this.backgroundImages.length - 1)],
                                1)

    this.background.draw(0.55)
  }

  Phase2() {
    // Stage 2
    this.setSVGId("Layer2")

    // Big Artifacts
    for (let i = 0; i < this.artifacts.length; i++) {
      for (let j = 0; j < this.artifacts[i]; j++) {

        let vector = this.generatePosition(
          this.overOverlayGrid,
          this.artifacts_dimensions[i][0],
          this.artifacts_dimensions[i][1]
        )

        if (vector[0]) {
          let r = this.getRandomInt(this.images.length - 1)
          this.blocks[1].push(
            new Block(
              this.p,
              vector[1],
              this.artifacts_dimensions[i][0],
              this.artifacts_dimensions[i][1],
              this.resolution,
              this.configuration.color[this.configuration.colorScheme].secondBackgroundColor,
              this.images[r],
              1,
              this.configuration.color[this.configuration.colorScheme].shadeColor
            )
          )
        }
      }
    }

    //draw
    for (let i = 0; i < this.blocks[1].length; i++) {
      if (Math.random() < 0.01) {
          this.setSVGId("Layer3")
        } else {
          this.setSVGId("Layer2")
        }
        this.blocks[1][i].SetBlockId(i+1)
        this.blocks[1][i].draw(0.6, 1, this.configuration.colorScheme)
    }
  }

  Phase3() {
    // Stage 3
    this.setSVGId("Layer2")

    for (let i = 0; i < (this.dimensions * this.dimensions); i++) {
      let vector = this.generatePosition(
        this.overlayGrid,
        1,
        1
      )

      let randomImage = this.p.min(this.getRandomInt(this.images.length), this.images.length - 1)
      if (vector[0]) {
        this.blocks[0].push(
          new Block(
            this.p,
            vector[1],
            1,
            1,
            this.resolution,
            this.configuration.color[this.configuration.colorScheme].secondBackgroundColor,
            this.images[randomImage],
            1,
            this.configuration.color[this.configuration.colorScheme].shadeColor)
        )
      }
    }

    //draw
    for (let i = 0; i < this.blocks[0].length; i++) {
      if (Math.random() < 0.50) {
        if (Math.random() < 0.1) {
          this.setSVGId("Layer3")
        } else {
          this.setSVGId("Layer2")
        }

        this.blocks[0][i].SetBlockId(this.blocks[1].length + i)
        this.blocks[0][i].draw(1, 0.75, this.configuration.colorScheme)

        if (Math.random() < 0.50) {
          this.blocks[0][i].shade()
        }
      }
    }
  }

  Phase4() {
    // Stage 4
    for (let i = 0; i < Math.max(2, this.getRandomInt(4)); i++) {
      var item = new Glitch(this.p, this.configuration)
      item.draw(this.getRandomInt(250) + 50, this.getRandomInt(250) + 100, Math.max(200, this.getRandomInt(300)), Math.max(8, this.getRandomInt(12)))
    }
  }

  Phase5() {
    // Stage 5
    var vector = this.generatePosition(
      this.grainGrid,
      this.dimensions,
      this.dimensions
    )
    this.grain = new Plasma(this.p,
      vector[1],
      this.dimensions,
      this.dimensions,
      this.resolution * 2,
      this.configuration.color[this.configuration.colorScheme].foregroundColor,
      this.grainImages,
      1)

    this.grain.draw()
  }

  Genesis() {
    // The Genesis code is structured into multiple parts.
    // Stage 1:
    // Generate the bigger background layer.
    // 
    // Stage 2:
    // Bigger artifacts - Partially not rendered.
    //
    // Stage 2.5:
    // Plasma
    //
    // Stage 3:
    // Lines
    // 
    // Stage 4:
    // 1x1 tiles on top - but only partially.
    //
    // Stage 5:
    // Alpha channels on top

    // Stage 1
    var r = this.getRandomInt(this.configuration.color.length - 1)
    this.configuration.colorScheme = r

    // set Background and Foreground Color
    this.p.background(this.configuration.color[this.configuration.colorScheme].backgroundColor)

    this.Phase1()
    this.Phase2()
    this.Phase3()
    this.Phase4()
    this.Phase5()

    this.colorize()
  }

}
