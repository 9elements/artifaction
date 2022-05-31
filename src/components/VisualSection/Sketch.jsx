/* eslint-disable */
import styles from "./styles.module.css"

import { Blocks } from "./Blocks"
import React, { useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import "svg2pdf.js"
import { ethers } from "ethers"
import Artifaction from "./../../artifacts/contracts/Artifaction.sol/Artifaction.json"

const canvasSize = 400
const dimensions = 8

var BlocksNFT
const tokenAddress = "0x93DF566a8b5D78E605061E3ed14bFd717452E148"


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

  const connectHandler = async () => {
    if (window.ethereum) {
      if (window.ethereum.networkVersion !== 80001) { // Polygon Testnet
        try {
          await switchNetwork();
        } catch(err) {
          console.error(err)
        }
      }
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountChange(res[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Install MetaMask");
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(chainId) }]
      });
    } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Testnet',
              chainId: web3.utils.toHex(80001),
              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              rpcUrls: ['https://rpc-mumbai.matic.today/']
            }
          ]
        });
      }
    }
  }

  const accountChange = async (newAccount) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const awardItem = async() => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await connectHandler()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(tokenAddress, Artifaction.abi, signer)
        
        const transaction = await contract.mintArt("")
        await transaction.wait()
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    generateBlocks()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountChange);
    }
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
        <button className="button" onClick={connectHandler}>Connect Metamask</button>
        <button className="button" onClick={awardItem}>
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
