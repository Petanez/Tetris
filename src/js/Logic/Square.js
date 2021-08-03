export default class Square {
  "use strict"
  constructor(x, y, isOccupied = false) {
    this.x = x
    this.y = y
    this.isOccupied = isOccupied
  }

  isOccupied

  set isOccupied(value) {
    this.isOccupied = value
  }
  // perkele

  get isOccupied() {
    return this.isOccupied
  }
}