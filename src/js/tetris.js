import Logic from "./Logic"
import Graphics from "./Graphics"
import { keyPressHandler } from "./handlers"
console.log(Graphics)

var Tetris = (function() {
  let isPaused = false
  let downIsPressed = false
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
    let level = 1
    gameOver = false
    isPaused = false
    let currentLevel = level
    let secondaryIntervalTimer = 700
    Graphics.resetUi(scoreElement, level)
    Logic.createBoard()

    secondaryInterval = setInterval(function () {
      if (!isPaused) {
        Logic.inspectRowConditions()
        Logic.incrementLevelAfter10Clears()
        if (currentLevel != level) {
          currentLevel = level
          mainInterval = Logic.moveToNextLevel(mainInterval, level)
        }
        Logic.runLevel()
      }
      downIsPressed = false
    }, secondaryIntervalTimer)
  }

  const normButton = document.getElementById("normButton")
  normButton.onclick = function () {
    // if (gameOverTextFinished) {
    //   if (levelOpacityInterval != null) 
    //     clearInterval(levelOpacityInterval) 
    //   if (gameOverInterval != null) 
    //     clearInterval(gameOverInterval)
    //   }
      Graphics.clearBoard()
      playGame()
  }


  const stateInfo = document.querySelector(".state-info")
  const canvas = document.querySelector("#myCanvas")
  window.onload = () => {
    Graphics.drawBorders()
    stateInfo.style.height = canvas.clientHeight
    document.addEventListener("keydown", e => keyPressHandler(e, isPaused))
  }

  window.onresize = () => {
    console.log("resizing stateInfo")
    stateInfo.style.height = canvas.clientHeight
  }
})()

export default Tetris