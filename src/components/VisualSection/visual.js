/* eslint-disable */

const canvasSize = 380
const dimensions = 8
var BlocksNFTLeft
var BlocksNFTRight
var BlocksNFTMerge

/*
 * CleanUp
 *
 * Cleans up old container, otherwise Canvas get n+1 on each save
 */
function CleanUp(containername) {
  /* Clean up before we go go */
  let oldDiv = document.getElementById(containername)
  if (oldDiv) {
    oldDiv.remove()
  }
}

/*
 * SetUp
 *
 * The canvas we used to kill in CleanUp needs to get added to the DOM
 *
 */
function SetUp(wrappername, containername) {
  const newDiv = document.createElement("div")
  newDiv.setAttribute("id", containername)
  document.getElementById(wrappername)?.appendChild(newDiv)
}

/*
 * Sketch
 *
 * core functionality
 */
// function Sketch() {
let configurationStruct = {
  grid: Array.from(Array(8), () => new Array(8)),
  overlayGrid: Array.from(Array(8), () => new Array(8)),
  colorScheme: -1,
  overlayColorScheme: -1,
}

async function generateBlocksRight() {
  // Init
  CleanUp("sketchcontainer_right")
  SetUp("sketchwrapper_right", "sketchcontainer_right")

  let sketch = function (p) {
    let resolution = canvasSize / dimensions
    BlocksNFTRight = new Blocks(p, dimensions, resolution)

    p.setup = function () {
      p.createCanvas(
        canvasSize + resolution * 4,
        canvasSize + resolution * 4,
        p.SVG
      )

      BlocksNFTRight.Genesis()
      p.noLoop()
    }

    p.draw = function () {
      // Do nothing.
    }

    p.preload = function () {
      BlocksNFTRight.Init()
    }
  }
  new p5(sketch, "sketchcontainer_right")
}

async function mergeBlocks() {
  if (BlocksNFTLeft && BlocksNFTRight) {
    // Init
    CleanUp("sketchcontainer_merge")
    SetUp("sketchwrapper_merge", "sketchcontainer_merge")

    let configurationLeft = BlocksNFTLeft.GetConfiguration()
    console.log({ configurationLeft })
    let configurationRight = BlocksNFTRight.GetConfiguration()
    console.log({ configurationRight })

    configurationLeft.overlayGrid = configurationRight.grid
    configurationLeft.overlayColorScheme = configurationRight.colorScheme

    let sketch = function (p) {
      let resolution = canvasSize / dimensions
      BlocksNFTMerge = new Blocks(p, dimensions, resolution)

      p.setup = function () {
        p.createCanvas(
          canvasSize + resolution * 4,
          canvasSize + resolution * 4,
          p.SVG
        )

        BlocksNFTMerge.LoadFromConfiguration(configurationLeft)
      }

      p.draw = function () {
        // Do nothing.
      }

      p.preload = function () {
        BlocksNFTMerge.Init()
      }
    }
    new p5(sketch, "sketchcontainer_merge")
  }
}

//   return (
//     <Container maxWidth="lg">
//       <Grid container spacing={1}>
//         <Grid item xs={4}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={generateBlocksLeft}
//           >
//             Generate Left Blocks
//           </Button>
//         </Grid>
//         <Grid item xs={4}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={generateBlocksRight}
//           >
//             Generate Right Blocks
//           </Button>
//         </Grid>
//         <Grid item xs={4}>
//           <Button variant="contained" color="primary" onClick={mergeBlocks}>
//             Merge dis!
//           </Button>
//         </Grid>
//         <Grid item xs={6} style={{ height: 600 }}>
//           <div id="sketchwrapper_left"></div>
//         </Grid>
//         <Grid item xs={6} style={{ height: 600 }}>
//           <div id="sketchwrapper_right"></div>
//         </Grid>
//         <Grid item xs={12}>
//           <div id="sketchwrapper_merge"></div>
//         </Grid>
//       </Grid>
//     </Container>
//   )
// }

// export default Sketch

generateBlocksRight()