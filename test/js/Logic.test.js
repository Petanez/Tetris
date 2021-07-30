import Logic from "../../src/js/Logic/Logic.js"
import config from "../../src/config/prod.js"

describe("Initialization tests", () => {
  var board
  it ("Should create a board of correct width and height", () => {
    board = Logic.createBoard()
    expect(board.length && board[0].length)
      .toEqual(config.board.height && config.board.width)
  })

  it ("Should create a piece ", () => {

  })
})