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
    this.artifacts_min = 3
    this.artifacts_dimensions = [
      [4, 4],
      [3, 3],
      [2, 2]
    ]
    this.artifacts = [1, 1, 3]

    // Probabilities of 4x4, 3x3, 2x2
    this.probabilities = [90, 90, 100]

    // Some empty arrays
    this.colors = []
    this.baseImage = 0
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
    this.blocks = [[], [], []]

    this.colorScheme = 0
    this.overlayColorScheme = 0

  }

  // Some Helper Functions
  getRandomInt(max) {
    max = Math.floor(max)
    return Math.floor(Math.random() * (max + 1))
  }

  // Load Color List
  loadBackgroundForegroundSimplePairs() {
    this.colors.push([this.p.color(170, 217, 222, 255), this.p.color(189, 255, 154, 255), this.p.color(0, 0, 0, 255, 255), this.p.color(255, 255, 255, 255)])
    this.colors.push([this.p.color(255, 86, 255, 255), this.p.color(170, 217, 222, 255), this.p.color(189, 255, 154, 255), this.p.color(0, 0, 0, 255)])
    this.colors.push([this.p.color(103, 2, 255, 255), this.p.color(189, 255, 154, 255), this.p.color(170, 217, 222, 255), this.p.color(255, 184, 0, 255)])
    this.colors.push([this.p.color(189, 255, 154, 255), this.p.color(170, 217, 222, 255), this.p.color(0, 0, 0, 255), this.p.color(255, 86, 255, 255)])
    this.colors.push([this.p.color(0, 0, 0, 255), this.p.color(170, 217, 222, 255), this.p.color(255, 86, 255, 255), this.p.color(0, 0, 0, 255)])
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
          "fill:" + this.colors[this.colorScheme][2]
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
          "fill:" + this.colors[this.colorScheme][2]
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
          "fill:" + this.colors[this.colorScheme][3]
        )
        this.path[i].attribute("z", "2")
        this.path[i].attribute("version", "")
        this.path[i].attribute("xmlns", "")
        this.path[i].attribute("xmlns:xlink", "")
        this.path[i].attribute("xml:space", "")
      }
    }
  }

  Init() {
    // Load SVGs and Colors
    this.loadBackgroundForegroundSimplePairs()
    this.loadSVGs()
  }

  setSVGId(id) {
    for (let j = 0; j < this.backgroundImages.length; j++) {
      this.backgroundImages[j].elt.setAttribute("id", id)
    }
    for (let j = 0; j < this.images.length; j++) {
      this.images[j].elt.setAttribute("id", id)
    }
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
    this.setSVGId("Layer1")
    var r = this.getRandomInt(this.colors.length - 1)
    this.colorScheme = r

    // set Background and Foreground Color
    this.p.background(this.colors[this.colorScheme][0])
    let OverlayBackgroundColor = this.colors[this.colorScheme][1]
    let foregroundColor = this.colors[this.colorScheme][2]
    
    // Generate a background image [TODO: This is fixed for now]
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
                                foregroundColor,
                                this.backgroundImages[this.getRandomInt(this.backgroundImages.length - 1)],
                                1)

    this.background.draw(0.55)

    // Stage 2
    this.setSVGId("Layer2")

    // Big Artifacts
    for (let i = 0; i < this.artifacts.length; i++) {
      for (let j = 0; j < this.artifacts[i]; j++) {

        var vector = this.generatePosition(
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
              OverlayBackgroundColor,
              this.images[r],
              1
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
        this.blocks[1][i].draw(0.6, 1, r)
    }

    // Stage 3
    this.setSVGId("Layer2")

    for (let i = 0; i < (this.dimensions * this.dimensions); i++) {
      vector = this.generatePosition(
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
            OverlayBackgroundColor,
            this.images[randomImage],
            1)
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
        this.blocks[0][i].draw(1, 0.75, this.colorScheme)
      }
    }

    // Stage 4
    for (let i = 0; i < Math.max(2, this.getRandomInt(5)); i++) {
      var item = new Glitch(this.p, this.resolution, this.colorScheme)
      item.draw(Math.max(80, this.getRandomInt(280)), Math.max(80, this.getRandomInt(280)), 300, 12)
    }
    
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
      foregroundColor,
      this.grainImages,
      1)

    this.grain.draw()

    this.colorize()
  }

}
