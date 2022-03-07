export class Block {
  constructor(p, vector, height, width, res, color, img) {
    // constructor
    this.p = p
    this.vector = vector
    this.height = height
    this.width = width
    this.res = res
    this.color = color
    console.log(`Setting color to ${this.color}`)
    this.img = img
  }

  // Draw it
  draw() {
    this.p.image(
      this.img,
      this.vector.x * this.res + this.res * 2,
      this.vector.y * this.res + +(this.res * 2),
      this.width * this.res,
      this.height * this.res
    )
  }
}
