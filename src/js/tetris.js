let level
let board
let piece
let isPaused = false
let downIsPressed = false
let isEz = false
let gameOver = false
let score = 0
const scoreElement = document.getElementById("score")
scoreElement.innerHTML = score

let mainInterval
let secondaryInterval
function playGame() {
  if (mainInterval != null) { clearInterval(mainInterval) }
  if (secondaryInterval != null) { clearInterval(secondaryInterval) }
  score = 0
  level = 1
  let currentLevel = level
  let fps = calculateFps()
  let secondaryIntervalTimer = 100
  drawLevelText()
  createBoard()
  newPiece()
  //  use secondary interval to detect full rows and change main interval if level changes
  secondaryInterval = setInterval(function () {
    if (!isPaused) {
      checkFullRowsAndEndCondition()
      rowsToReplace = replaceRowsAndAddToScore(rowsToReplace)
      incrementLevelAfter10Clears()
      if (currentLevel != level) {
        moveToNextLevel()
        currentLevel = level
      }
    }
    if (gameOver) 
      gameOverConditionReached()
    downIsPressed = false
  }, secondaryIntervalTimer)

  // Main interval to lower pieces
  mainInterval = setInterval(runLevel, fps)
}

window.onload = () => drawBorders()