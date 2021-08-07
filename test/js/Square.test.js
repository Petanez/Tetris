import { expect } from "@jest/globals"
import Square from "../../src/js/Logic/Square.js"

describe("Square test", () => {
  let square
  it ("Should instantiate square", () => {
    square = new Square(0, 0, false)
    expect(square.x).toBe(0)
    expect(square.y).toBe(0)
    expect(square.isOccupied).toBe(false)
  })

  it ("Should set x and y", () => {
    square.x = 1
    square.y = 2
    expect(square.x).toEqual(1)
    expect(square.y).toEqual(2)
  })

  it ("Should get and set isOccupied", () => {
    expect(square.isOccupied).toEqual(false)
    square.isOccupied = true
    expect(square.isOccupied).toEqual(true)
  })

})