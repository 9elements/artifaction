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
    this.grid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    this.overlayGrid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    
    this.images = []
    this.pipes = []
    this.quarters = []
    this.stripes = []
    this.waves = []
    this.flash = []

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
    for (let j = 0; j < 5; j++) {
      var z = j + 1
      let str = "images/images/{0}.svg".format(z)
      let SVGFile = this.p.loadSVG(str)
      this.images.push(SVGFile)
    }

    // Wires
    this.images.push(this.p.loadSVG("images/images/wire1.svg"))
    this.images.push(this.p.loadSVG("images/images/wire2.svg"))

    this.images.push(this.p.loadSVG("images/images/m-cat-01-12.svg"));
    this.images.push(this.p.loadSVG("images/images/m-cat-02-12.svg"));
    this.images.push(this.p.loadSVG("images/images/m-cat-02-19.svg"));
    this.images.push(this.p.loadSVG("images/images/m-cat-02-90.svg"));
    this.images.push(this.p.loadSVG("images/images/m-cat-02-97.svg"));
    this.images.push(this.p.loadSVG("images/images/m-cat-03-46.svg"));

    this.pipes.push(this.p.loadSVG("images/pipes/pipe1.svg"))
    this.pipes.push(this.p.loadSVG("images/pipes/pipe2.svg"))
    this.pipes.push(this.p.loadSVG("images/pipes/pipe3.svg"))
    this.pipes.push(this.p.loadSVG("images/pipes/pipe4.svg"))

    this.quarters.push(this.p.loadSVG("images/quarters/quarter1.svg"))
    this.quarters.push(this.p.loadSVG("images/quarters/quarter2.svg"))
    this.quarters.push(this.p.loadSVG("images/quarters/quarter3.svg"))
    this.quarters.push(this.p.loadSVG("images/quarters/quarter4.svg"))

    this.stripes.push(this.p.loadSVG("images/stripes/stripe1.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe2.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe3.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe4.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe5.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe6.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe7.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe8.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe9.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe10.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe11.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe12.svg"))
    this.stripes.push(this.p.loadSVG("images/stripes/stripe13.svg"))

    this.waves.push(this.p.loadSVG("images/waves/wave1.svg"))
    this.waves.push(this.p.loadSVG("images/waves/wave2.svg"))
    this.waves.push(this.p.loadSVG("images/waves/wave3.svg"))
    this.waves.push(this.p.loadSVG("images/waves/wave4.svg"))

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

  findBigArtifacts(externalGrid, internalGrid, secondLayer, drawArray) {
    var color = this.colorScheme

    for (let i = 0; i < externalGrid.length; i++) {
      var lastNumber
      var dimension = 1
      for (let j = 0; j < externalGrid[i].length; j++) {
        if (!lastNumber) {
          // No Check here
          lastNumber = externalGrid[i][j]
          continue
        }

        if (internalGrid[i][j - 1] !== -1) {
          lastNumber = externalGrid[i][j]
          continue
        }

        if (lastNumber === externalGrid[i][j]) {
          dimension++
        }

        if (
          lastNumber !== externalGrid[i][j] &&
          dimension > 1 &&
          i + dimension <= this.dimensions
        ) {
          // We might found an artifact
          let y = j - dimension

          if (dimension > 4) {
            dimension = 4
          }

          if (
            this.checkForValidArtifact(
              externalGrid,
              i,
              y,
              dimension,
              lastNumber
            )
          ) {
            if (secondLayer) {
              if (this.collisionCheck(this.grid, i, y, dimension, dimension)) {
                dimension = 1
                lastNumber = externalGrid[i][j]
                continue
              }
            }

            // Generate Vector
            let v = this.p.createVector(i, y)
            this.fillgrid(v, dimension, dimension, lastNumber, internalGrid)

            let category = lastNumber >> 6
            let imageNumber = lastNumber & 0x3f

            drawArray.push(
              new Block(
                this.p,
                v,
                dimension,
                dimension,
                this.resolution,
                this.colors[color][1],
                this.images[category][imageNumber]
              )
            )
          }
          dimension = 1
        }

        lastNumber = externalGrid[i][j]
      }
      if (dimension > 1 && i + dimension <= this.dimensions) {
        // We might found an artifact
        let y = this.dimensions - dimension

        if (
          this.checkForValidArtifact(externalGrid, i, y, dimension, lastNumber)
        ) {
          // Generate Vector
          let v = this.p.createVector(i, y)
          this.fillgrid(v, dimension, dimension, lastNumber, internalGrid)

          let category = lastNumber >> 6
          let imageNumber = lastNumber & 0x3f

          drawArray.push(
            new Block(
              this.p,
              v,
              dimension,
              dimension,
              this.resolution,
              this.colors[color][1],
              this.images[category][imageNumber]
            )
          )
        }
      }
    }
  }

  renderSmallArtifacts(externalGrid, internalGrid, secondLayer, drawArray) {
    var color = this.colorScheme

    var dimension = 1

    //Now we need to choose some numbers upfront which we do _not_ render
    if (!secondLayer) {
      for (let i = 0; i < internalGrid.length; i++) {
        for (let j = 0; j < internalGrid[i].length; j++) {
          if (
            !this.collisionCheck(this.grid, i, j, dimension, dimension) &&
            !this.collisionCheck(this.overlayGrid, i, j, dimension, dimension)
          ) {
            // If grid is not rendered yet
            internalGrid[i][j] = externalGrid[i][j]

            // Skip every 5th tile
            let counter = i * internalGrid.length + j + (i % 2)
            if (counter % 5 == 0) {
              this.overlayNumbers.push([i, j])
              continue
            }
            // Generate Vector
            let v = this.p.createVector(i, j)

            let category = externalGrid[i][j] >> 6
            let imageNumber = externalGrid[i][j] & 0x3f

            drawArray.push(
              new Block(
                this.p,
                v,
                dimension,
                dimension,
                this.resolution,
                this.colors[color][1],
                this.images[category][imageNumber]
              )
            )
          }
        }
      }
    } else {
      // Render only the tiles from list.
      for (let i = 0; i < this.overlayNumbers.length; i++) {
        var x = this.overlayNumbers[i][0]
        var y = this.overlayNumbers[i][1]
        if (internalGrid[x][y] == -1) {
          // If grid is not rendered yet
          internalGrid[x][y] = externalGrid[x][y]

          // Generate Vector
          let v = this.p.createVector(x, y)

          let category = externalGrid[x][y] >> 6
          let imageNumber = externalGrid[x][y] & 0x3f

          drawArray.push(
            new Block(
              this.p,
              v,
              dimension,
              dimension,
              this.resolution,
              this.colors[color][1],
              this.images[category][imageNumber]
            )
          )
        }
      }

      // Copy all remaining over.
      for (let i = 0; i < internalGrid.length; i++) {
        for (let j = 0; j < internalGrid[i].length; j++) {
          if (internalGrid[i][j] === -1) {
            internalGrid[i][j] = externalGrid[i][j]
          }
        }
      }
    }
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

  generatePosition(width, height) {
    var x,
      y,
      tries = 0

    x = this.getRandomInt(this.dimensions - width)
    y = this.getRandomInt(this.dimensions - height)

    while (this.collisionCheck(this.grid, x, y, width, height)) {
      x = this.getRandomInt(this.dimensions - width)
      y = this.getRandomInt(this.dimensions - height)
      tries++
      if (tries === 150) {
        return [false, null]
      }
    }

    // Create a Vector and fill the internal grid
    var v = this.p.createVector(x, y)
    this.fillgrid(v, width, height, 1, this.grid)

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
    console.log("Init done.")
  }

  setSVGId(id) {
    for (let j = 0; j < this.images.length; j++) {
      for (let i = 0; i < this.images[j].length; i++) {
        this.images[j][i].elt.setAttribute("id", id)
      }
    }
  }

  Genesis() {
    // The Genesis code is structured into three parts. First part
    // is to generate the bigger background layer. Second part layers
    // 1x1 tiles on top - but only partially. Third layer puts alpha
    // path on top to make it look more fluent.
    this.setSVGId("Layer1")
    var r = this.getRandomInt(this.colors.length - 1)
    this.colorScheme = r

    // set Background and Foreground Color
    this.p.background(this.colors[this.colorScheme][0])
    let foregroundColor = this.colors[this.colorScheme][1]

    console.log(this.stripes)
    // Generate a background image [TODO: This is fixed for now]
    var vector = this.generatePosition(
      this.dimensions,
      this.dimensions
    )
    this.blocks.push(
      new Block(
        this.p,
        vector[1],
        this.dimensions,
        this.dimensions,
        this.resolution,
        foregroundColor,
        this.stripes[8],
        1
      )
    )

    // var artifacts = this.calculateArtifacts()

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
      console.log("Draw Block %d", i)
      this.blocks[i].draw()
    }

    this.colorize(foregroundColor)
    console.log(this)
  }

  LoadFromConfiguration(configuration) {
    console.log(configuration)
    // Do some prep to load from a config
    // Set up grid properly
    var externalConfiguration = configuration
    this.colorScheme = externalConfiguration.colorScheme
    if (this.colorScheme === externalConfiguration.overlayColorScheme) {
      this.overlayColorScheme = this.colorScheme + 1
    } else {
      this.overlayColorScheme = externalConfiguration.overlayColorScheme
    }
    this.blocks = []
    this.overlayBlocks = []
    this.grid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))
    this.overlayGrid = Array(this.dimensions)
      .fill()
      .map(() => Array(this.dimensions).fill(-1))

    // Set Background first
    this.p.background(this.colors[this.colorScheme][0])

    // Draw the big artifacts first
    this.setSVGId("Layer1")
    this.findBigArtifacts(
      externalConfiguration.grid,
      this.grid,
      false,
      this.blocks
    )
    this.drawBlocks(this.blocks)

    if (externalConfiguration.overlayGrid[0][0] !== -1) {
      // Print Overlay
      this.setSVGId("Layer2")
      this.findBigArtifacts(
        externalConfiguration.overlayGrid,
        this.overlayGrid,
        true,
        this.overlayBlocks
      )
      this.drawBlocks(this.overlayBlocks)
    }

    this.blocks = []
    this.overlayBlocks = []

    this.setSVGId("Layer1")
    this.renderSmallArtifacts(
      externalConfiguration.grid,
      this.grid,
      false,
      this.blocks
    )
    this.drawBlocks(this.blocks)

    this.setSVGId("Layer2")
    this.renderSmallArtifacts(
      externalConfiguration.overlayGrid,
      this.overlayGrid,
      true,
      this.overlayBlocks
    )
    this.drawBlocks(this.overlayBlocks)

    this.colorize()
  }

  GetConfiguration() {
    return {
      grid: this.grid,
      overlayGrid: this.overlayGrid,
      colorScheme: this.colorScheme,
      overlayColorScheme: this.overlayColorScheme,
    }
  }

  lifeSign() {
    console.log("Showing a sign of life")
  }
}
