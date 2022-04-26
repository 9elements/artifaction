import { Block } from "./Block"

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
      [2, 2],
      [2, 2],
      [2, 2],
      [2, 2]
    ]

    // Probabilities of 4x4, 3x3, 2x2
    this.probabilities = [90, 90, 100, 100, 100, 100]

    // Some empty arrays
    this.colors = []
    this.baseImage = 0
    this.grid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    this.overlayGrid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    
    this.images = []
    this.backgroundImages = []

    this.background = null;
    this.blocks = []
    this.overlayBlocks = []
    this.overlayNumbers = []

    // Set up grid properly
    for (var i = 0; i < this.dimensions; i++) {
      this.grid[i] = new Array(this.dimensions)
      for (var j = 0; j < this.dimensions; j++) {
        this.grid[i][j] = -1
      }
    }

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
    this.colors.push([this.p.color(1, 1, 1), this.p.color(255, 255, 255)])
    this.colors.push([this.p.color(71, 26, 255), this.p.color(0, 255, 206)])
    this.colors.push([this.p.color(105, 0, 190), this.p.color(255, 142, 60)])
    this.colors.push([this.p.color(81, 102, 124), this.p.color(81, 255, 62)])
    this.colors.push([this.p.color(5, 85, 123), this.p.color(232, 26, 217)])
    this.colors.push([this.p.color(252, 111, 175), this.p.color(70, 70, 70)])
    this.colors.push([this.p.color(42, 23, 62), this.p.color(252, 16, 39)])
    this.colors.push([this.p.color(5, 164, 170), this.p.color(239, 244, 56)])

    this.colors.push([this.p.color(221, 186, 189), this.p.color(86, 100, 173)])
    this.colors.push([this.p.color(175, 206, 195), this.p.color(211, 103, 106)])
    this.colors.push([this.p.color(176, 192, 204), this.p.color(49, 103, 124)])
    this.colors.push([this.p.color(202, 186, 159), this.p.color(127, 102, 57)])
    this.colors.push([this.p.color(194, 183, 185), this.p.color(96, 89, 85)])
    this.colors.push([this.p.color(168, 155, 207), this.p.color(192, 208, 214)])
    this.colors.push([this.p.color(217, 219, 149), this.p.color(185, 128, 156)])
    this.colors.push([this.p.color(236, 182, 140), this.p.color(120, 120, 120)])
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

  }

  // Artifacts Helper Functions
  calculateArtifacts() {
    var artifacts_num = 0
    // [4x4, 3x3, 2x2]
    var artifacts = [0, 0, 0, 0, 0, 0]

    for (let i = 0; i < artifacts.length; i++) {
      let dice = this.getRandomInt(100)
      if (dice <= this.probabilities[i]) {
        artifacts[i]++
        artifacts_num++
      }
    }

    return artifacts
  }

  drawBlocks(drawArray) {
    for (var i = 0; i < drawArray.length; i++) {
      drawArray[i].draw()
    }
  }

  checkForValidArtifact(externalGrid, x, y, dimension, image) {
    console.log("Checking for valid: ", x, y)
    for (let i = x; i < x + dimension; i++) {
      var edgeDetectionRight = i == x + dimension - 1 ? true : false
      var edgeDetectionLeft = i == x ? true : false
      for (let j = y; j < y + dimension; j++) {
        if (externalGrid[i][j] !== image) {
          return false
        }
        if (edgeDetectionRight) {
          if (i + 1 < externalGrid.length) {
            if (externalGrid[i + 1][j] !== image) {
              console.log("EdgeDetection Right: false")
              edgeDetectionRight = false
            }
          } else {
            edgeDetectionRight = false
            console.log("EdgeDetection Right: false")
          }
        }
        if (edgeDetectionLeft) {
          if (i - 1 > 0) {
            if (externalGrid[i - 1][j] !== image) {
              console.log("EdgeDetection Left: false")
              edgeDetectionLeft = false
            }
          } else {
            edgeDetectionLeft = false
            console.log("EdgeDetection Left: false")
          }
        }
      }
    }
    return !edgeDetectionRight && !edgeDetectionLeft
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
          "fill:" + this.colors[this.colorScheme][1]
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
          "fill:" + this.colors[this.overlayColorScheme][1]
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
    // 1x1 tiles on top - but only partially.
    //
    // Stage 3:
    // Bigger artifacts - Partially not rendered. Stage 3 could be swapped with Stage 2
    //
    // Stage 4:
    // Alpha channels on top

    // Stage 1
    this.setSVGId("Layer1")
    var r = this.getRandomInt(this.colors.length - 1)
    this.colorScheme = r

    // set Background and Foreground Color
    this.p.background(this.colors[this.colorScheme][0])
    let foregroundColor = this.colors[this.colorScheme][1]
    console.log(this.images)
    
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
                                this.backgroundImages[0],
                                1)

    this.background.draw(0.6)

    // Stage 2
    this.setSVGId("Layer2")
    while (r == this.colorScheme) {
      r = this.getRandomInt(this.colors.length - 1)
      this.overlayColorScheme = r
    }

    for (let i = 0; i < (this.dimensions * this.dimensions); i++) {
      vector = this.generatePosition(
        this.overlayGrid,
        1,
        1
      )
      let randomImage = this.p.min(this.getRandomInt(this.images.length), this.images.length - 1)
      if (vector[0]) {
        this.blocks.push(
          new Block(
            this.p,
            vector[1],
            1,
            1,
            this.resolution,
            foregroundColor,
            this.images[randomImage],
            1)
        )
      }
    }
    
    // Stage 3
    this.setSVGId("Layer3")

    // // Big Artifacts
    // for (let i = 0; i < artifacts.length; i++) {
    //   for (let j = 0; j < artifacts[i]; j++) {

    //     var vector = this.generatePosition(
    //       this.artifacts_dimensions[i][0],
    //       this.artifacts_dimensions[i][1]
    //     )
    //     if (vector[0]) {
    //       let r = this.getRandomInt(this.images.length - 1)
    //       this.blocks.push(
    //         new Block(
    //           this.p,
    //           vector[1],
    //           this.artifacts_dimensions[i][0],
    //           this.artifacts_dimensions[i][1],
    //           this.resolution,
    //           foregroundColor,
    //           this.images[category][r],
    //           1
    //         )
    //       )
    //     }
    //   }
    // }

    //draw
    for (let i = 0; i < this.blocks.length; i++) {
      if (Math.random() < 0.6) {
        this.blocks[i].draw(0, 0, this.overlayColorScheme)
      }
    }

    this.colorize()
    console.log(this)
  }

}
