"use strict"
import Square from "./Square.js"
import * as Pieces from "./Pieces.js"
import config from "../../config/prod.js"

export default (function() {
  const newPiece = () => {
    return randomPiece()
  }

  const newTestPiece = () => {
    return new Pieces.iPiece()
  }
  
  const lockPiece = (board, p) => {
    p.every(val => {
      return board[val.y][val.x].isOccupied = true
    })
  }

  function PieceStack() {
    let stack = Array.from({ length: 5 }, (_) => {
      return newPiece()
    })

    this.getStack = function() {
      return stack
    }

    this.getPiece = function() {
      stack.push(newPiece())
      return stack.shift()
    }
  }
  
  function randomPiece() {
    const nPieces = 7
    const randomNum = Math.floor(Math.random() * nPieces)
    return (
        randomNum === 0 ? new Pieces.lPiece() 
      : randomNum === 1 ? new Pieces.oPiece() 
      : randomNum === 2 ? new Pieces.tPiece() 
      : randomNum === 3 ? new Pieces.lPieceIsomer() 
      : randomNum === 4 ? new Pieces.sPiece() 
      : randomNum === 5 ? new Pieces.sPieceIsomer() 
      : new Pieces.iPiece()
    )
  }
  
  function tryLowerPiece(board, p) {
    // return -1 if piece gets locked
    if (p.every(square => square.y < board.length - 1)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y++
    } else {
      lockPiece(board, p)
      return -1
    }
    // if the new x, y has an occupied square return to previous x, y
    if (p.some(square => board[square.y][square.x].isOccupied)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y--
      lockPiece(board, p)
      return -1
    }
    return p
  }
  
  function movePiece(board, p, direction = "down") {
    if (!p.length) return
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
    let newCoordinates
    try {
      newCoordinates = rotate(p)
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
    } catch {
      console.log("can't rotate piece")
    }
    return p
  }
  
  function rotate(p) {
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
    return newCoordinates.some(
         square => square.x < 0 
      || square.y < board[0].y
      || square.x > board[0].length - 1 
      || square.y > board.length - 1 
      || board[square.y][square.x].isOccupied
    )
  }
  
  function checkFullRows(board) {
    let rowsToReplace = [];
    for (let y = board.length - 1; y >= 0; y--) {
      let isFullRow = true
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x].isOccupied) 
          isFullRow = false
      }
      if (isFullRow) {
        rowsToReplace.push(y)
      }
    }
    if (rowsToReplace.length)
      replaceRows(board, rowsToReplace)      
    let scoreMultiplier = rowsToReplace.length
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
    let i = rows.length - 1
    while (i >= 0) {
      board.splice(rows[i], 1)
      addFullRow(board)
      i--
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
  
  function moveToLevel(level) {
    console.log(`Moving to level ${level}`)
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
    lockPiece,
    randomPiece,
    isOPiece,
    spaceIsOccupied,
    checkFullRows,
    incrementLevelAfter10Clears,
    moveToLevel,
    tryLowerPiece,
    movePiece,
    rotatePiece,
    addScore,
    PieceStack
  }
})()