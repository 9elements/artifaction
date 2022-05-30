/* eslint-disable */
import styles from "./styles.module.css"

import { Blocks } from "./Blocks"
import { useEffect } from "react"

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

  function downloadArtwork() {
    const svg = document.querySelector("#sketchwrapper svg")

    const removeAttribute = (element, attribute) => {
      element.removeAttribute(attribute)
      const children = element.childNodes
      for (let i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          removeAttribute(children[i], attribute)
        }
      }
    }
    removeAttribute(svg, "xml:space")

    // generate alphanumeric id beginning with a letter

    svg.querySelectorAll("svg").forEach((element) => {
      const id = `_${Math.random().toString(36).substring(2, 8)}`
      element.removeAttribute("xmlns")
      element.removeAttribute("xmlns:xlink")

      // Nested SVGs do not work outside the browser, so we need to convert them into <symbol>s and use them with <use>
      // replace tagName with symbol
      // element.setAttribute("id", id)
      const attrs = element
        .getAttributeNames()
        .map((attr) => `${attr}="${element.getAttribute(attr)}"`)
        .join(" ")

      // element.outerHTML = `
      //     <symbol ${attrs.join(" ")}>
      //       ${element.innerHTML}
      //     </symbol>
      //     <use href="#${id}" xlink:href="#${id}"></use>
      // `
      // ${element.outerHTML}
      // <junge />
      element.outerHTML = `
          <g transform="translate(${element.getAttribute(
            "x"
          )}, ${element.getAttribute("y")}) scale(${
        +element.getAttribute("width") / 100
      }, ${+element.getAttribute("height") / 100})" ${attrs}>
            ${element.innerHTML}
          </g>
      `

      // element.parentNode.insertBefore(useElement, element.nextSibling)
    })

    var svgData = document.querySelector("#sketchwrapper svg").outerHTML
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    var svgUrl = URL.createObjectURL(svgBlob)
    var downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = `artifaction-artwork-${Date.now()}`
    downloadLink.setAttribute("aria-hidden", "true")
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
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
        <button className="button" onClick={downloadArtwork}>
          Download
        </button>
      </div>
    </section>
  )
}

export default Sketch
