export default class Square {
  constructor(x, y, isOccupied = false) {
    this.x = x
    this.y = y
    this.isOccupied = isOccupied
  }

  isOccupied

  set isOccupied(value) {
    this.isOccupied = value
  }

  get isOccupied() {
    return this.isOccupied
  }
}