// import { p, board } from "./Logic"

const c = document.getElementById("myCanvas")
const ctx = c.getContext("2d")
const blockSize = 35
const borderLineWidth = 10
const gridHeight = blockSize * 24
const gridWidth = blockSize * 10
c.height = gridHeight + borderLineWidth * 2
c.width = gridWidth + borderLineWidth * 2

const scoreBoardElement = document.getElementById("scoreboard")
const levelElement = document.getElementById("lvl")
const finalScoreElement = document.getElementById("finalScore")
const gameOverElement = document.getElementById("gOvr")
const gamePausedElement = document.getElementById("gamePaused")

let isPolarized = document.body.classList.contains("polarized")
let borderColor = "black"
let squareBorderColor = "black"
let squareColor1 = "white"
let squareColor2 = "black"

function clearBoard() {
  ctx.clearRect(0 + borderLineWidth, 0 + borderLineWidth, c.width - borderLineWidth * 2, c.height - borderLineWidth * 2)
}

function drawBorders() {
  let borderLineAdjustment = 5
  ctx.beginPath()
  ctx.lineWidth = borderLineWidth
  ctx.strokeStyle = borderColor
  ctx.moveTo(borderLineAdjustment, 0)
  ctx.lineTo(borderLineAdjustment, c.height - borderLineAdjustment)
  ctx.lineTo(c.width - borderLineAdjustment, c.height - borderLineAdjustment)
  ctx.lineTo(c.width - borderLineAdjustment, 0)
  ctx.stroke()
}

function drawSquare(x, y) {
  let sLineWidth = .5
  ctx.beginPath()
  ctx.lineWidth = sLineWidth
  ctx.strokeStyle = squareBorderColor
  //  draw square lines
  //  Linear gradience
  let sq = ctx.createLinearGradient(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize * x + blockSize, blockSize * y + blockSize)
  sq.addColorStop(0.4, squareColor2)
  // sq.addColorStop(1, "#E7DDDB")
  sq.addColorStop(1, squareColor1)
  ctx.fillStyle = sq
  ctx.fillRect(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize, blockSize)
  ctx.strokeRect(borderLineWidth + sLineWidth + blockSize * x, borderLineWidth + sLineWidth + blockSize * y, blockSize - sLineWidth * 2, blockSize - sLineWidth * 2)
  ctx.stroke()
}

function drawPiece(p) {
  for (let i = 0; i < p.length; i++) {
    if (p[i].isOccupied) 
      drawSquare(p[i].x, p[i].y)
  }
}

function drawBoard(board) {
  drawBorders()
  // console.log(`board length
  //   ${board.length}`)
  for (let y = board.length - 1; y > 0; y--) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].isOccupied) 
        drawSquare(x, y)
    }
  }
}

// function drawEverything() {
  
function drawEverything(board, p) {
  ctx.clearRect(0, 0, c.width, c.height)
  drawBoard(board)
  drawPiece(p)
}

let gameOverInterval
let gameOverTextFinished = true
// gameOverTextFinished is to prevent premature restarting of the game
function drawGameOver() {
  console.log("inside display game over")
  gameOverTextFinished = false
  let opacity = 0
  let txtShadow = 0
  let intervalTime = 5
  gameOverInterval = setInterval(function () {
    gameOverElement.setAttribute("style", `opacity: ${opacity}%; text-shadow: 0px 0px ${txtShadow}px black`)
    opacity++
    txtShadow += 0.2
    if (opacity >= 100) {
      window.clearInterval(gameOverInterval)
      gameOverTextFinished = true
      normButton.innerHTML = "START GAME"
      return
    }
  }, intervalTime)
  return
}

function resetLevelText(level) {
  const container = document.querySelector(".state-info__level")
  while (container.firstChild) 
    container.firstChild.remove()
  let lvlEl = document.createElement("h1")
  lvlEl.innerText = `Level ${level}`
  lvlEl.id = "lvl"
  container.appendChild(lvlEl)
}

function displayFinalScore() {
  finalScoreElement.innerHTML = "Your score: " + score
}

function resetUi(scoreElement, level) {
  resetLevelText(level)
  normButton.innerText = "RESTART"
  scoreElement.innerText = 0
  gameOverElement.setAttribute("style", "opacity: 0%")
  gamePausedElement.innerText = ""
  finalScoreElement.innerText = ""
  levelElement.setAttribute("style", "letter-spacing: 0px background: none opacity: 100")
}

export default {
  resetUi,
  resetLevelText,
  clearBoard,
  drawBorders,
  drawEverything
}