/* eslint-disable */
import styles from "./styles.module.css"

import { Blocks } from "./Blocks"
import { useEffect, useRef, useState } from "react"

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

  function prepareArtwork() {
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

    // Nested SVGs do not work outside the browser, so we need to convert them into <g>s and update some stuff

    // Replace inline styles with svg attributes
    svg.querySelectorAll("[style*='fill:']").forEach((element) => {
      element.setAttribute("fill", element.style.fill)
      element
        .querySelectorAll("path:not([style*='fill:']):not([fill])")
        .forEach((path) => {
          path.setAttribute("fill", element.style.fill)
        })
    })

    svg.querySelectorAll("svg").forEach((element) => {
      element.removeAttribute("xmlns")
      element.removeAttribute("xmlns:xlink")

      const attrs = element
        .getAttributeNames()
        .map((attr) => `${attr}="${element.getAttribute(attr)}"`)
        .join(" ")

      const width = +element.getAttribute("width")
      const height = +element.getAttribute("height")
      const x = +element.getAttribute("x")
      const y = +element.getAttribute("y")

      // prettier-ignore
      element.outerHTML = `
        <g transform="translate(${x}, ${y}) scale(${width === 800 ? 0.605 : width / 100}, ${height === 800 ? 0.605 : height / 100})" ${attrs}>
          ${element.innerHTML}
        </g>
      `
    })

    setArtworkCode(svg.outerHTML)

    // var svgData = document.querySelector("#sketchwrapper svg").outerHTML
    // var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    // var svgUrl = URL.createObjectURL(svgBlob)
    // var downloadLink = document.createElement("a")
    // downloadLink.href = svgUrl
    // downloadLink.download = `artifaction-artwork-${Date.now()}`
    // downloadLink.setAttribute("aria-hidden", "true")
    // document.body.appendChild(downloadLink)
    // downloadLink.click()
    // document.body.removeChild(downloadLink)
  }

  const [artworkCode, setArtworkCode] = useState("")

  const orderDialog = useRef(null)
  // const orderForm = useRef(null)

  const openOrderDialog = () => {
    const dialog = orderDialog.current

    if (typeof HTMLDialogElement !== "function") {
      import("dialog-polyfill").then(({ default: dialogPolyfill }) => {
        dialogPolyfill.registerDialog(dialog)
      })
    }

    dialog.showModal()
    prepareArtwork()
  }

  useEffect(() => {
    generateBlocks()
  }, [])

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   let form = orderForm.current
  //   let formData = new FormData(form)

  //   fetch("/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body: new URLSearchParams(formData).toString(),
  //   })
  //     .then(() => (window.location.href = "/order-success"))
  //     .catch((error) => alert(error))
  // }

  const onCancel = () => {
    orderDialog.current.close()
  }

  return (
    <section className={"container section"}>
      <div className={styles.artwork}>
        <div id="sketchwrapper"></div>
      </div>
      <div className={styles.buttons}>
        <button className="button" onClick={generateBlocks}>
          Generate
        </button>
        {/* <button className="button">Connect Metamask</button> */}
        {/* <button className="button" onClick={generateBlocks}>
          How to mine
        </button> */}
        <button className="button" onClick={openOrderDialog}>
          Order as print
        </button>

        <dialog ref={orderDialog} className={styles.dialog}>
          <div className={styles.dialogContent}>
            <form method="dialog">
              <button value="cancel" aria-label="Close">
                x
              </button>
            </form>

            <div>
              <div
                style={{ width: "8rem", height: "8rem" }}
                dangerouslySetInnerHTML={{ __html: artworkCode }}
              />
              <h2>ORDER AS PRINT</h2>
              <div className="prose">
                <p>
                  Hey, here's your chance to bring your digital artrwork right
                  to your home and hang it on your analog wall. Once you've
                  minted your NFT and paid the gas fees, all you have to do is:
                </p>
              </div>
              <form
                name="order"
                method="POST"
                action="/order-success"
                data-netlify="true"
                netlify-honeypot="normal-field"
                // onSubmit={handleSubmit}
                // ref={orderForm}
              >
                <label hidden>
                  U a Human? don't fill out this field:
                  <input name="normal-field" />
                </label>

                <fieldset>
                  <legend>Select your print size</legend>
                  <div className="input-row">
                    <div className="input-row">
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="radio"
                          id="size-30x30"
                          value="30x30"
                          name="size"
                          required
                        />
                        <label htmlFor="size-30x30">30 x 30 cm</label>
                      </div>
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="radio"
                          id="size-70x70"
                          value="70x70"
                          name="size"
                          required
                        />
                        <label htmlFor="size-70x70">70 x 70 cm</label>
                      </div>
                    </div>
                    <div className="prose">
                      <p>
                        Glicée print on decor smooth art paper 210 gm2. The
                        colors may vary slightly.
                      </p>
                    </div>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Enter your shipping address</legend>
                  <div className="input-row">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      aria-label="First Name"
                      placeholder="First Name"
                      required
                    />
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      aria-label="Last Name"
                      placeholder="Last Name"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      id="address"
                      aria-label="Street and house number"
                      placeholder="Street and house number"
                      required
                    />
                    <div className="input-row fixed">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        aria-label="Postal Code"
                        placeholder="Postal Code"
                        required
                      />
                      <input
                        type="text"
                        name="city"
                        id="city"
                        aria-label="City"
                        placeholder="City"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      aria-label="Company (optional)"
                      placeholder="Company (optional)"
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      aria-label="Email"
                      placeholder="Email"
                      required
                    />
                  </div>
                </fieldset>
                <input
                  type="hidden"
                  readOnly
                  name="artwork"
                  value={artworkCode}
                />

                <div className={styles.dialogButtons}>
                  <button
                    type="submit"
                    className="button"
                    style={{
                      "--color": "var(--color-pink)",
                    }}
                  >
                    Submit order
                  </button>
                  <button type="reset" onClick={onCancel} className="button">
                    Cancel order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </section>
  )
}

export default Sketch
