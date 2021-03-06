import Square from "./Square"
import { lPiece, lPieceIsomer, sPiece, sPieceIsomer, iPiece, tPiece, oPiece } from "./Pieces"
import Graphics from "../Graphics/Graphics"
import config from "../../../config/prod"

export default (function() {
  const newPiece = () => {
    return randomPiece()
  }

  const newTestPiece = () => {
    return new iPiece().PIECE
  }
  
  const lockPiece = (board, p) => {
    p.every(function (val) {
      return board[val.y][val.x].isOccupied = true
    })
  }
  
  function randomPiece() {
    const nPieces = 7
    const randomNum = Math.floor(Math.random() * nPieces)
    return (
        randomNum === 0 ? new lPiece() : randomNum === 1 ? new oPiece() : randomNum === 2 ? new tPiece() :
        randomNum === 3 ? new lPieceIsomer() : randomNum === 4 ? new sPiece() : randomNum === 5 ? new sPieceIsomer() : new iPiece()
      ).PIECE
  }
  
  function tryLowerPiece(board, p) {
    if (p.every(square => square.y < board.length - 1)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y++
    } else {
      lockPiece(board, p)
      return newPiece()
    }
    // if the new x, y has an occupied square return to previous x, y
    if (p.some(square => board[square.y][square.x].isOccupied)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y--
      lockPiece(board, p)
      return newPiece()
    }
    return p
  }
  
  function movePiece(board, p, direction = "down") {
    if (direction === "left") {
      // check for boards min width
      if (p.every(square => square.x > 0))
        for (let i = 0; i < p.length; i++) 
          p[i].x--
      if (p.some(square => board[square.y][square.x].isOccupied)) {
        console.log("cant move there")
        for (let i = 0; i < p.length; i++) 
          p[i].x++
      }
    }
    if (direction === "right") {
      // check for boards max width
      if (p.every(square => square.x < board[0].length - 1)) {
        for (let i = 0; i < p.length; i++) 
          p[i].x++
      }
      if (p.some(square => board[square.y][square.x].isOccupied)) {
        console.log("cant move there")
        for (let i = 0; i < p.length; i++) 
          p[i].x--
      }
    }
    if (direction == "up") {
      p = rotatePiece(board, p)
    }

    if (direction === "down") {
      p = tryLowerPiece(board, p)
    }
  
    return p
  }

  function isOPiece(p) {
    const oPiece = (
         p[0].x == p[2].x 
      && p[1].x == p[3].x
      && p[0].y == p[1].y
    )
    return oPiece
  }
  
  // function returns newCoordinates if none of the new coordinates are out of bounds or in a occupied square
  function rotatePiece(board, p) {
    if (isOPiece(p)) return p
    const newCoordinates = calculateRotation(p)
    if (spaceIsOccupied(board, newCoordinates)) {
      console.log("can't rotate piece")
      return p
    } else {
      for (let i = 0; i < newCoordinates.length; i++) {
        if (i === 1) continue
        p[i].x = newCoordinates[i].x
        p[i].y = newCoordinates[i].y
      }
    }
    return p
  }
  
  function calculateRotation(p) {
    const anchor = {
      x: p[1].x,
      y: p[1].y,
    }
    let newCoordinates = [{ x: 0, y: 0 }, { x: anchor.x, y: anchor.y }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    for (let i = 0; i < p.length; i++) {
      if (i === 1) continue
      let xDiff = p[i].x - anchor.x
      let yDiff = p[i].y - anchor.y
      let xIsNegative = Math.sign(xDiff) === -1
      let yIsNegative = Math.sign(yDiff) === -1
      if (xDiff === 0) {
        newCoordinates[i].x = yIsNegative ? anchor.x + Math.abs(yDiff) : anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y
      } else if (yDiff === 0) {
        newCoordinates[i].x = anchor.x
        newCoordinates[i].y = xIsNegative ? anchor.y - Math.abs(xDiff) : anchor.y + Math.abs(xDiff)
      } else if (xIsNegative && yIsNegative) {
        newCoordinates[i].x = anchor.x + Math.abs(yDiff)
        newCoordinates[i].y = anchor.y - Math.abs(xDiff)
      } else if (!xIsNegative && !yIsNegative) {
        newCoordinates[i].x = anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y + Math.abs(xDiff)
      } else if (xIsNegative && !yIsNegative) {
        newCoordinates[i].x = anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y - Math.abs(xDiff)
      } else if (!xIsNegative && yIsNegative) {
        newCoordinates[i].x = anchor.x + Math.abs(yDiff)
        newCoordinates[i].y = anchor.y + Math.abs(xDiff)
      }
    }
    return newCoordinates
  }
  
  function spaceIsOccupied(board, newCoordinates) {
    return newCoordinates.some(square => square.x < 0 || square.x > board[0].length - 1 || square.y > board.length - 1 || board[square.y][square.x].isOccupied)
  }
  
  function checkFullRowsAndEndCondition(board) {
    let rowsToReplace = [];
    for (let y = board.length - 1; y >= 0; y--) {
      let isFullRow = true
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x].isOccupied) 
          isFullRow = false
        if (y === 0 && board[y][x].isOccupied) 
          return -1 // Return -1 to indicate game over
      }
      if (isFullRow) {
        rowsToReplace.push(y)
      }
    }
    let scoreMultiplier = rowsToReplace.length
    replaceRows(board, rowsToReplace)      
    return scoreMultiplier
  }
  
  function addFullRow(board) {
    const row = Array.from({ length: 10 }, (_, i) => new Square(i, 0))
    return board.unshift(row)
  }
  
  function addScore(multiplier, level, score) {
    return score += multiplier === 1 ? 40 * level
      : multiplier === 2 ? 100 * level
      : multiplier === 3 ? 300 * level 
      : multiplier === 4 ? 1200 * level
      : 0
  }
  
  function incrementLevelAfter10Clears(trackRowCount, level) {
    if (trackRowCount >= 10) {
      trackRowCount = trackRowCount - 10
      level++
    }
    return { trackRowCount, level }
  }
  
  function replaceRows(board, rows) {
    if (rows.length) {
      let i = rows.length - 1
      while (i >= 0) {
        board.splice(rows[i], 1)
        addFullRow(board)
        i--
      }
    }
  }
  
  function createBoard() {
    return Array.from({ length: config.board.height }, (v, _) => {
      return v = Array.from({ length: config.board.width }, (_, x) => {
        return new Square(x, 0)
      })
    })
  }

  function createTestBoard() {
    return Array.from({ length: config.board.height }, (v, _) => {
      if (_ < 20) {
        return v = Array.from({ length: config.board.width }, (_, x) => {
          return new Square(x, 0)
        })
      } else {
        return v = Array.from({ length: config.board.width }, (_, x) => {
          if (x < 9) {
            return new Square(x, 0, true)
          } else {
            return new Square(x, 0)
          }
        })
      }
    })
  }
  
  function moveToNextLevel(level) {
    console.log(`Moving to level ${level}`)
    Graphics.displayLevelText(level)
    return calculateFps(level)
  }
  
  function calculateFps(level) {
    return (1500 / (1.8 * level))
  }


  
  return {
    calculateFps,
    createBoard,
    createTestBoard,
    newPiece,
    newTestPiece,
    checkFullRowsAndEndCondition,
    incrementLevelAfter10Clears,
    moveToNextLevel,
    movePiece,
    rotatePiece,
    addScore
  }

  // return Tetris
})()