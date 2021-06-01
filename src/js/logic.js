import Square from "./Square"
import { lPiece, lPieceIsomer, sPiece, sPieceIsomer, iPiece, tPiece, oPiece } from "./Pieces"
import Graphics from "./Graphics"
// import { keyPressHandler } from "./handlers"

const { drawEverything } = Graphics

const randomPiece = () => {
  const randomNum = Math.floor(Math.random() * 7)
  return (
      randomNum === 0 ? new lPiece() : randomNum === 1 ? new oPiece() : randomNum === 2 ? new tPiece() :
      randomNum === 3 ? new lPieceIsomer() : randomNum === 4 ? new sPiece() : randomNum === 5 ? new sPieceIsomer() : new iPiece()
    ).PIECE
}

let board = createBoard()
let p = randomPiece()
let rowsToReplace = []
let trackRowCount = 0

const newPiece = () => {
  return randomPiece()
}

const lockPiece = () => {
  p.every(function (val) {
    return board[val.y][val.x].isOccupied = true
  })
}

function lowerPieceIfNotBlocked() {
  if (p.every(square => square.y < board.length - 1)) {
    for (let i = 0; i < p.length; i++) 
      p[i].y++
  } else {
    lockPiece()
    p = newPiece()
    return
  }
  // if the new x, y has an occupied square return to previous x, y
  if (p.some(square => board[square.y][square.x].isOccupied)) {
    for (let i = 0; i < p.length; i++) 
      p[i].y--
    lockPiece()
    p = newPiece()
  }
}

function movePiece(direction) {
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
  if (direction === "down") 
    lowerPieceIfNotBlocked()

}

// function returns newCoordinates if none of the new coordinates are out of bounds or in a occupied square
function rotatePiece() {
  console.log("Rotating")
  if (p.constructor.name === "oPiece") return
  const newCoordinates = calculateRotation(p)
  if (spaceIsOccupied(newCoordinates)) {
    console.log("can't rotate piece")
    return
  } else {
    for (let i = 0; i < newCoordinates.length; i++) {
      if (i === 1) continue
      p[i].x = newCoordinates[i].x
      p[i].y = newCoordinates[i].y
    }
  }
}

function calculateRotation() {
  const anchor = {
    x: p[1].x,
    y: p[1].y,
  }
  let newCoordinates = [{ x: 0, y: 0 }, { x: anchor.x, y: anchor.y }, { x: 0, y: 0 }, { x: 0, y: 0 }]
  for (let i = 0; i < p.PIECE.length; i++) {
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

function spaceIsOccupied(newCoordinates) {
  return newCoordinates.some(square => square.x < 0 || square.x > board[0].length - 1 || square.y > board.length - 1 || board[square.y][square.x].isOccupied)
}

function inspectRowConditions() {
  checkFullRowsAndEndCondition()
  replaceRowsAndAddToScore()
}

function checkFullRowsAndEndCondition() {
  for (let y = board.length - 1; y >= 0; y--) {
    let isFullRow = true
    for (let x = 0; x < board[y].length; x++) {
      if (!board[y][x].isOccupied) 
        isFullRow = false
      if (y === 0 && board[y][x].isOccupied) 
        gameOverConditionReached()
    }
    if (isFullRow) 
      rowsToReplace.push(y)
  }
}

function addFullRow() {
  const row = Array.from({ length: 10 }, (_, i) => new Square(i, 0))
  return board.unshift(row)
}

function addScore(r) {
  return score += r.length === 1 ? 40 * level :
    r.length === 2 ? 100 * level :
      r.length === 3 ? 300 * level : 1200 * level
}

function incrementLevelAfter10Clears() {
  if (trackRowCount >= 10) {
    trackRowCount = trackRowCount - 10
    level++
    console.log("Level is " + level + "\ntrackRowCount is: " + trackRowCount)
  }
}

function replaceRowsAndAddToScore() {
  // when trackRowCount >= 10, reset & increment level
  // if rows to remove is not empty, execute
  if (rowsToReplace.length > 0) {
    console.log(`Removing ${rows.length} row${rows.length > 1 ? "s" : ""}`)
    addScore(rows)
    scoreElement.innerHTML = score
    let i = rows.length
    while (i >= 0) {
      board.splice(rows[i], 1)
      addFullRow()
      i--
    }
    trackRowCount += rows.length
  }
  return rowsToReplace = []
}

function createBoard() {
  return Array.from({ length: 24 }, (v, _) => {
    return v = Array.from({ length: 10 }, (_, x) => {
      return new Square(x, 0)
    })
  })
}

// function restartGame() {
//   resetUi()
//   // scoreBoardElement.setAttribute("style", "opacity:1")
//   isPaused = false
//   gameOver = false
//   trackRowCount = 0
//   playGame()
// }

function runLevel() {
  drawEverything(board, p)
  lowerPieceIfNotBlocked()
}

function moveToNextLevel(interval, level) {
  console.log(`Moving to level ${level}`)
  clearInterval(interval)
  let fps = calculateFps(level)
  resetLevelText(level)
  return setInterval(runLevel, fps)
}

function gameOverConditionReached() {
  console.log("Game over")
  drawGameOver()
  displayFinalScore()
  clearInterval(mainInterval)
  clearInterval(secondaryInterval)
  if (gameOverInterval != null && gameOverTextFinished) {
    console.log("gameover interval not null, gameover text not finished")
    clearInterval(gameOverInterval)
  }
}

function calculateFps(level) {
  return (1500 / (1.8 * level))
}

export default {
  calculateFps,
  createBoard,
  newPiece,
  checkFullRowsAndEndCondition,
  replaceRowsAndAddToScore,
  incrementLevelAfter10Clears,
  moveToNextLevel,
  movePiece,
  runLevel,
  rotatePiece,
  inspectRowConditions,
  p,
  board
}