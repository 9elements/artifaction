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
    "rgba(189, 255, 154, 255)",
    "rgba(170, 217, 222, 255)",
    "rgba(189, 255, 154, 255)",
    "rgba(170, 217, 222, 255)",
    "rgba(170, 217, 222, 255)",
    "rgba(0, 0, 0, 255)"
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
    let res_t = 100 / this.dim
    gr.noStroke()
    bg.noStroke()

    for (var i = 0; i < this.dim; i += seg) {
      for (var j = 0; j < this.dim; j += seg) {
        if (this.p.noise(i + this.seed, j + this.seed) < noiseTreshold) {
          gr.fill('rgb(255,255,255)')
          gr.rect(i * res_t, j * res_t, res_t * seg, res_t * seg)
        }
      }
    }


      
    let defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    let mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask'); 
    mask.setAttribute('id','MaskID'+this.blockID);
    
    let temp = gr.elt.svg.querySelectorAll('g');
    mask.appendChild(temp[0]);
    defs.appendChild(mask);
    this.img.elt.insertBefore(defs, this.img.elt.firstChild);
  
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
    let bg = this.p.createGraphics(100, 100, 'svg')
    bg.noStroke()
    bg.fill(this.colorCodeStrings[this.colorCode])
    bg.rect(0, 0, 100, 100)
    
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

    if (colorCode != null && Math.random() < backgroundTreshold) {
      this.colorCode = colorCode
      this.setBackground()
    }

    if (noiseTreshold) {
      this.drawMask(noiseTreshold)
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