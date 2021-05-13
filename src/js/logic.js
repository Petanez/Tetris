const newPiece = () => {
  return piece = isEz ? new oPiece() : randomPiece()
}

const lockPiece = (p) => {
  p.every(function (val) {
    return board[val.y][val.x].isOccupied = true
  })
}

const randomPiece = () => {
  const randomNum = Math.floor(Math.random() * 7)
  return randomNum === 0 ? new lPiece() : randomNum === 1 ? new oPiece() : randomNum === 2 ? new tPiece() :
    randomNum === 3 ? new lPieceIsomer() : randomNum === 4 ? new sPiece() : randomNum === 5 ? new sPieceIsomer() : new iPiece()
}

function lowerPieceIfNotBlocked(p) {
  if (p.every(square => square.y < board.length - 1)) {
    for (let i = 0; i < p.length; i++) 
      p[i].y++
  } else {
    lockPiece(p)
    newPiece()
    return
  }
  // if the new x, y has an occupied square return to previous x, y
  if (p.some(square => board[square.y][square.x].isOccupied)) {
    for (let i = 0; i < p.length; i++) 
      p[i].y--
    lockPiece(p)
    newPiece()
  }
}

function movePiece(direction, p) {
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
    lowerPieceIfNotBlocked(piece.PIECE)

}

// function returns newCoordinates if none of the new coordinates are out of bounds or in a occupied square
function rotatePiece(p) {
  if (p.constructor.name === "oPiece") return
  const newCoordinates = calculateRotation(p)
  if (spaceIsOccupied(newCoordinates)) {
    console.log("can't rotate piece")
    return
  } else {
    for (let i = 0; i < newCoordinates.length; i++) {
      if (i === 1) continue
      p.PIECE[i].x = newCoordinates[i].x
      p.PIECE[i].y = newCoordinates[i].y
    }
  }
}

function calculateRotation(p) {
  const anchor = {
    x: p.PIECE[1].x,
    y: p.PIECE[1].y,
  }
  let newCoordinates = [{ x: 0, y: 0 }, { x: anchor.x, y: anchor.y }, { x: 0, y: 0 }, { x: 0, y: 0 }]
  for (let i = 0; i < p.PIECE.length; i++) {
    if (i === 1) continue
    let xDiff = p.PIECE[i].x - anchor.x
    let yDiff = p.PIECE[i].y - anchor.y
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

function checkFullRowsAndEndCondition() {
  for (let y = board.length - 1; y >= 0; y--) {
    let isFullRow = true
    for (let x = 0; x < board[y].length; x++) {
      if (!board[y][x].isOccupied) 
        isFullRow = false
      if (y === 0 && board[y][x].isOccupied) 
        return gameOver = true
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

// when trackRowCount >= 10, reset & increment level
let rowsToReplace = []
let trackRowCount = 0
function replaceRowsAndAddToScore(rows) {
  // if rows to remove is not empty, execute
  if (rows.length > 0) {
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
  return rows = []
}

function createBoard() {
  board = Array.from({ length: 24 }, (v, _) => {
    return v = Array.from({ length: 10 }, (_, x) => {
      return new Square(x, 0)
    })
  })
}

function restartGame() {
  normButton.innerText = "RESTART"
  scoreElement.innerText = 0
  gameOverElement.setAttribute("style", "opacity: 0%")
  gamePausedElement.innerText = ""
  finalScoreElement.innerText = ""
  levelElement.setAttribute("style", "letter-spacing: 0px background: none opacity: 100")
  // scoreBoardElement.setAttribute("style", "opacity:1")
  isPaused = false
  gameOver = false
  trackRowCount = 0
  isEz ? isEz = false : isEz
  playGame()
}

function runLevel() {
  if (!downIsPressed && !isPaused) {
    drawEverything()
    lowerPieceIfNotBlocked(piece.PIECE)
  }
}

function moveToNextLevel() {
  console.log(`Moving to level ${level}`)
  clearInterval(mainInterval)
  fps = calculateFps()
  drawLevelText()
  mainInterval = setInterval(runLevel, fps)
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

function calculateFps() {
  return (1500 / (1.8 * level))
}
