export class Block {
  constructor(p, vector, height, width, res, color, img, raster) {
    // constructor
    this.p = p
    this.vector = vector
    this.height = height
    this.width = width
    this.res = res
    this.color = color
    this.img = img
    this.raster = raster
    this.blockID = 0
    this.dim = 8

    this.backgroundTreshold = 0.6
    this.lx = this.vector.x * res;  
    this.ly = this.vector.y * res;
    this.lw = this.width * res;
    this.lh = this.height * res;

    this.blockID = 0

    this.seed = Math.random()

    this.colorCode = 0
  }

  colorCodeStrings = [
    "rgba(1, 1, 1, 255)",
    "rgba(71, 26, 255, 255)",
    "rgba(105, 0, 190, 255)",
    "rgba(81, 102, 124, 255)",
    "rgba(5, 85, 123, 255)",
    "rgba(252, 111, 175, 255)",
    "rgba(42, 23, 62, 255)",
    "rgba(5, 164, 170, 255)",
    "rgba(221, 186, 189, 255)",
    "rgba(175, 206, 195, 255)",
    "rgba(176, 192, 204, 255)",
    "rgba(202, 186, 159, 255)",
    "rgba(194, 183, 185, 255)",
    "rgba(168, 155, 207, 255)",
    "rgba(217, 219, 149, 255)",
    "rgba(236, 182, 140, 255)"
  ];

  SetBlockId(blockID) {
    this.blockID = blockID
  }

  SetBackgroundColor(colorCode) {
    this.colorCode = colorCode
  }

  // Draw Mask
  drawMask(noiseTreshold) {
    let gr = this.p.createGraphics(320, 320, 'svg')
    let bg = this.p.createGraphics(320, 320, 'svg')

    var seg = (this.dim / this.width) * this.raster

    let offset = 1;
    let res_t = 113.4 / this.dim
    gr.noStroke()
    bg.noStroke()

    for (var i = 0; i < this.dim; i += seg) {
      for (var j = 0; j < this.dim; j += seg) {
        if (this.p.noise(i + this.seed, j + this.seed) < noiseTreshold) {
          gr.fill('rgb(255,255,255)')
          gr.rect(i * res_t, j * res_t, res_t * seg, res_t * seg)
        }

        if (this.p.noise(i + offset * 50, j + offset * 50) < this.backgroundTreshold) {
          bg.fill('rgb(255,255,255)')
          bg.rect(i * res_t, j * res_t, res_t * seg, res_t * seg)
        }
      }
    }

    let temp2 = bg.elt.svg.querySelectorAll('g');


      
    let defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    let mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask'); 
    mask.setAttribute('id','MaskID'+this.blockID);
    
    let temp = gr.elt.svg.querySelectorAll('g');
    mask.appendChild(temp[0]);
    defs.appendChild(mask);
    this.img.elt.insertBefore(defs, this.img.elt.firstChild);
    this.img.elt.insertBefore(temp2[0], this.img.elt.firstChild);
  
    let nodes_g = this.img.elt.querySelectorAll('svg > g');
    let nodes_p = this.img.elt.querySelectorAll('svg > path');


    for(let n = 0; n < nodes_g.length; n++) {
      nodes_g[n].setAttribute('mask','url(#MaskID' + this.blockID + ')');
    }
    for(let n = 0; n < nodes_p.length; n++) {
      nodes_p[n].setAttribute('mask','url(#MaskID' + this.blockID + ')');
    }
  }

  setBackground() {
    let bg = this.p.createGraphics(320, 320, 'svg')
    bg.fill(this.colorCodeStrings[this.colorCode])
    bg.rect(0, 0, 320, 320)
    
    this.p.image(
      bg,
      this.vector.x * this.res + this.res * 2,
      this.vector.y * this.res + this.res * 2,
      this.width * this.res,
      this.height * this.res
    )
  }

  // Draw it
  draw(noiseTreshold, backgroundTreshold, colorCode) {

    this.backgroundTreshold = backgroundTreshold

    // Remove prior applied mask again.
    let temp = this.img.elt.querySelectorAll('svg > g')

    if (temp.length == 0) {
      temp = this.img.elt.querySelectorAll('svg > path')
    }

    for (let n = 0; n < temp.length; n++) {
      temp[n].removeAttribute('mask')
    }

    if (noiseTreshold) {
      this.drawMask(noiseTreshold)
    } else {
      this.colorCode = colorCode
      this.setBackground()
    }

    this.p.image(
      this.img,
      this.vector.x * this.res + this.res * 2,
      this.vector.y * this.res + this.res * 2,
      this.width * this.res,
      this.height * this.res
    )
  }
}