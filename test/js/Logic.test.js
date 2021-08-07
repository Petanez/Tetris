import Logic from "../../src/js/Logic/Logic.js"
import config from "../../src/config/prod.js"
import * as Pieces from "../../src/js/Logic/Pieces"

var board
var piece 
var pieceStack
describe("Initialization tests", () => {

  describe("Board tests", () => {
    it ("Should create a board of correct width and height", () => {
      board = Logic.createBoard()
      expect(board.length && board[0].length)
        .toEqual(config.board.height && config.board.width)
    })
  
    it ("Every square of board should be unoccupied", () => {
      expect(board.every(row => row.every(square => !square.isOccupied)))
        .toBe(true)
    })
  })

  describe("Piece tests", () => {
    it ("Should create a piece", () => {
      piece = Logic.newPiece()
      expect(piece.PIECE.length)
        .toEqual(4)
    })
  
    it ("Should create a random piece", () => {
      piece = Logic.randomPiece()
      expect(Pieces[piece.constructor.name])
        .not.toEqual(undefined)
    })
  
    it ("Sould create a piece stack", () => {
      pieceStack = new Logic.PieceStack()
      expect(typeof pieceStack.getStack)
        .toEqual("function")
    })
  
    it ("Should get a piece from the stack", () => {
      piece = pieceStack.getPiece()
      expect(piece.PIECE.length)
        .toEqual(4)
    })
  });
})

describe("Function tests", () => {
  beforeEach(() => {
    board = Logic.createBoard()
    piece = Logic.newPiece().PIECE
  })

  describe("Piece tests", () => {
    it ("Should detect oPiece", () => {
      const oPiece = (new Pieces.oPiece).PIECE
      expect(Logic.isOPiece(oPiece))
        .toEqual(true)
    })
  
    it ("Should lock the piece", () => {
      Logic.lockPiece(board, piece)
      expect(piece.every(sq => board[sq.y][sq.x].isOccupied))
        .toEqual(true)
    })    
  
    describe("Should move the piece correctly", () => {
      it ("Should lower the piece", () => {
        const previousState = JSON.parse(JSON.stringify(piece))
        const nextState = Logic.tryLowerPiece(board, piece)
        expect(nextState.every((sq, i) => sq.y === previousState[i].y + 1))
          .toEqual(true)
      })

      it ("Should lock piece if cannot lower (testing with iPiece)", () => {
        const testPiece = (new Pieces.iPiece).PIECE.map(sq => {
          sq.y += 20
          return sq
        })
        const piece = Logic.tryLowerPiece(board, testPiece)
        expect(piece)
          .toEqual(-1)
      })
  
      it ("Should move to the right", () => {
        const previousState = JSON.parse(JSON.stringify(piece))
        const nextState = Logic.movePiece(board, piece, "right")
        expect(nextState.every((sq, i) => sq.x === previousState[i].x + 1))
          .toEqual(true)
      })

      it ("Should return to previous position if cannot go right (testing with iPiece)", () => {
        const testPiece = (new Pieces.iPiece).PIECE.map(sq => {
          sq.x += 5
          return sq
        })
        const previousState = JSON.parse(JSON.stringify(testPiece))
        const nextState = Logic.movePiece(board, testPiece, "right")
        expect(nextState.every((sq, i) => sq.x === previousState[i].x))
          .toEqual(true)
      })
  
      it ("Should move to the left", () => {
        const previousState = JSON.parse(JSON.stringify(piece))
        const nextState = Logic.movePiece(board, piece, "left")
        expect(nextState.every((sq, i) => sq.x === previousState[i].x - 1))
          .toEqual(true)
      })

      it ("Should return to previous position if cannot go left (testing with iPiece)", () => {
        const testPiece = (new Pieces.iPiece).PIECE.map(sq => {
          sq.x -= 4
          return sq
        })
        const previousState = JSON.parse(JSON.stringify(testPiece))
        const nextState = Logic.movePiece(board, testPiece, "left")
        expect(nextState.every((sq, i) => sq.x === previousState[i].x))
          .toEqual(true)
      })
  
      it ("Should rotate (testing with t piece)", () => {
        // Wont allow rotation unless one row down, so create a piece with
        // incremented y values
        const testPiece = (new Pieces.tPiece).PIECE.map(sq => {
          sq.y++
          return sq
        })
        const previousState = JSON.parse(JSON.stringify(testPiece))
        const nextState = Logic.rotatePiece(board, testPiece)
        const expectedValues = [
          { x: 4, y: 0 },
          { x: 4, y: 1 },
          { x: 4, y: 2 },
          { x: 3, y: 1 }
        ]
        expect(nextState.every((sq, i) => {
          return sq.x === expectedValues[i].x
              && sq.y === expectedValues[i].y
        })).toEqual(true)
      })

      it ("Should fail to rotate if no space (testing with t piece)", () => {
        // Wont allow rotation unless one row down, so create a piece with
        // incremented y values
        const testPiece = (new Pieces.tPiece).PIECE.map(sq => {
          sq.y++
          return sq
        })
        const previousState = JSON.parse(JSON.stringify(testPiece))
        board[1][4].isOccupied = true
        const nextState = Logic.rotatePiece(board, testPiece)
        expect(nextState.every((sq, i) => {
          return sq.x === previousState[i].x
              && sq.y === previousState[i].y
        })).toEqual(true)
      })
    })
  });

  it ("Should detect and replace full rows with empty ones", () => {
    const fullRows = [1, 4, 7]
    fullRows.forEach(rowIndex => board[rowIndex].forEach(sq => {
      sq.isOccupied = true
    })) 
    let multiplier = Logic.checkFullRows(board)
    expect(multiplier)
      .toEqual(fullRows.length)

    expect(fullRows.every(rowIndex => {
      return board[rowIndex].every(sq => !sq.isOccupied)
    })).toEqual(true)
  })

  it ("Should add score based on level", () => {
    const testValues = [
      { multiplier: 1, level: 1, score: 0, expected: 40 },
      { multiplier: 2, level: 2, score: 100, expected: 300 },
      { multiplier: 3, level: 4, score: 200, expected: 1400 },
    ]
    testValues.forEach(val => {
      let score = Logic.addScore(val.multiplier, val.level, val.score) 
      expect(score)
        .toEqual(val.expected)
    })
  })

  it ("Should increment level after 10 clears and adjust trackRowCount", () => {
    let lvlStart = 1
    let trackRowCount = 11
    let level
    ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, lvlStart))
    expect(level).toEqual(2)
    expect(trackRowCount).toEqual(1)
  })

  it ("Should calculate correct fps when moving to next level", () => {
    // formula used inside the function (1500 / (1.8 * level))
    let levelToMoveTo = 2
    let fps = Logic.moveToLevel(levelToMoveTo)
    expect(fps).toEqual(1500 / (1.8 * levelToMoveTo))
  })
})