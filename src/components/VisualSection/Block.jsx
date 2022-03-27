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
  }

  SetBlockId(blockID) {
    this.blockID = blockID
  }

  // Draw Mask
  drawMask(noiseTreshold) {
    let gr = this.p.createGraphics(320, 320, 'svg')
    let bg = this.p.createGraphics(320, 320, 'svg')

    var seg = (this.dim/this.width) * this.raster

    let offset = 1;
    let res_t = 113.4 / this.dim
    gr.noStroke()
    bg.noStroke()

    for (var i = 0; i < this.dim; i += seg) {
      for (var j = 0; j < this.dim; j += seg) {
        if (this.p.noise(i + offset, j + offset) , noiseTreshold) {
          gr.fill('rgb(255,255,255)')
          gr.rect(i * res_t, j * res_t, res_t * seg, res_t * seg)
        }

        if (this.p.noise(i + offset * 50, j + offset * 50) < 0.6) {
          bg.fill('rgb(255,255,255)')
          bg.rect(i * res_t, j * res_t, res_t * seg, res_t * seg)
        }
      }
    }

    let temp2 = bg.elt.svg.querySelectorAll('g');


      
    let defs = this.p.document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    let mask = this.p.document.createElementNS("http://www.w3.org/2000/svg", 'mask'); 
    mask.setAttribute('id','MaskID'+this.blockid);
    
    let temp = gr.elt.svg.querySelectorAll('g');
    mask.appendChild(temp[0]);
    defs.appendChild(mask);
    this.img.elt.insertBefore(defs, this.img.elt.firstChild);
    this.img.elt.insertBefore(temp2[0], this.img.elt.firstChild);
  
    let nodes_g = this.img.elt.querySelectorAll('svg > g');
    let nodes_p = this.img.elt.querySelectorAll('svg > path');


    for(let n = 0; n < nodes_g.length; n++) {
      nodes_g[n].setAttribute('mask','url(#MaskID' + this.blockid + ')');
    }
    for(let n = 0; n < nodes_p.length; n++) {
      nodes_p[n].setAttribute('mask','url(#MaskID' + this.blockid + ')');
    }
  }

  // Draw it
  draw(noiseTreshold) {

    // Remove prior applied mask again.
    let temp = this.img.elt.querySelectorAll('svg > g')

    if (temp.length == 0) {
      temp = this.img.elt.querySelectorAll('svg > path')
    }

    for (let n = 0; n < temp.length; n++) {
      temp[n].removeAttribute('mask')
    }

    //this.drawMask(noiseTreshold)

    this.p.image(
      this.img,
      this.vector.x * this.res + this.res * 2,
      this.vector.y * this.res + +(this.res * 2),
      this.width * this.res,
      this.height * this.res
    )
  }
}
