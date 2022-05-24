/* eslint-disable */
import styles from "./styles.module.css"

import { Blocks } from "./Blocks"
import { useEffect } from "react"
import { jsPDF } from "jspdf"
import "svg2pdf.js"

const canvasSize = 400
const dimensions = 8

var BlocksNFT

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
  document.getElementById(wrappername).appendChild(newDiv)
}

/*
 * Sketch
 *
 * core functionality
 */
function Sketch() {
  async function generateBlocks() {
    // Init
    CleanUp("sketchcontainer")
    SetUp("sketchwrapper", "sketchcontainer")

    let sketch = function (p) {
      let resolution = canvasSize / dimensions
      BlocksNFT = new Blocks(p, dimensions, resolution)

      p.setup = function () {
        p.createCanvas(
          canvasSize + resolution * 4,
          canvasSize + resolution * 4,
          p.SVG
        )
        BlocksNFT.Genesis()
        p.noLoop()
      }

      p.draw = function () {
        // Do nothing.
      }

      p.preload = function () {
        BlocksNFT.Init()
      }
    }
    new p5(sketch, "sketchcontainer")
  }

  const pdfSize = 200 // in mm

  function generatePDF() {
    const doc = new jsPDF({
      compress: false,
      unit: "mm",
      format: [pdfSize, pdfSize],
    })

    const artwork = document.querySelector("#sketchcontainer   svg")

    doc
      .svg(artwork, {
        x: 0,
        y: 0,
        width: pdfSize,
        height: pdfSize,
      })
      .then(() => {
        console.log("SVG rendered")
        doc.save(`artifaction-artwork-${Date.now()}.pdf`)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    generateBlocks()
  }, [])

  return (
    <section className={"container section"}>
      <div className={styles.artwork}>
        <div id="sketchwrapper"></div>
      </div>
      <div className={styles.buttons}>
        <button className="button" onClick={generateBlocks}>
          Generate
        </button>
        <button className="button">Connect Metamask</button>
        <button className="button" onClick={generateBlocks}>
          How to mine
        </button>
        <button className="button" onClick={generatePDF}>
          PDF
        </button>
      </div>
    </section>
  )
}

export default Sketch
