import Logic from "./Logic"
import Graphics from "../Graphics/Graphics"
import config from "../../../config/prod"

function Tetris(document) {
  return (() => {
    let board
    let piece
    let score
    let level
    let fps = Logic.calculateFps(level)
    let trackRowCount
    let isPaused
    let gameOver
    let currentLevel = level
    Graphics.resetUi(level)
    var timeOutID

    function initGame() {
      console.log("initializing")
      if (timeOutID != null) {
        window.clearTimeout(timeOutID)
        timeOutID = null
      }
      board = Logic.createBoard()
      piece = Logic.newPiece()
      score = config.startingScore
      level = config.startingLevel
      fps = Logic.calculateFps(level)
      trackRowCount = 0
      isPaused = false
      gameOver = false  
      currentLevel = level
      Graphics.resetUi()
      Graphics.drawEverything(board, piece)
    }
    
    function tick(direction) {
      if (!isPaused && !gameOver) {
        frame(direction);
        ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, level));
        if (currentLevel != level) {
          currentLevel = level
          fps = Logic.moveToNextLevel(level)
        }
        timeOutID = schedule()
      } else {
        window.clearTimeout(timeOutID)
        timeOutID = null
      }
    }

    function frame(direction) {
      piece = Logic.movePiece(board, piece, direction)
      let scoreMultiplier = Logic.checkFullRowsAndEndCondition(board)
      if (scoreMultiplier === -1) {
        console.log("Game over")
        Graphics.displayGameOver()
        Graphics.displayFinalScore(score)
        playButton.innerText = "Play"
        return gameOver = true
      }
      trackRowCount += scoreMultiplier
      score = Logic.addScore(scoreMultiplier, level, score);
      Graphics.drawEverything(board, piece)
      Graphics.updateScore(score);
    }
    
    function schedule() {
      return window.setTimeout(tick, fps)
    }

    function playGame() {
      console.log("Game started")
      return timeOutID = schedule()
    }

    function togglePause() {
      return isPaused = !isPaused
    }

    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    document.addEventListener("keydown", e => {
      if (gameOver) return
      if (arrowKeys.includes(e.code)) {
        if (isPaused) return
        const direction = e.code.slice(5).toLowerCase()
        frame(direction)
        return
      }
      if (e.code == config.keys.pause) {
        if (isPaused) { 
          timeOutID = schedule()
          Graphics.unPause()
        }
        else { 
          window.clearTimeout(timeOutID)
          Graphics.pause()
          timeOutID = null
        }
        togglePause()
        return
      }
    })

    const playButton = document.getElementById("playButton")
    playButton.onclick = () => {
      initGame()
      playGame()
      playButton.innerText = "Restart"
    } 

    const themeSwitchBtn = document.querySelector("#themeSwitch")
    themeSwitchBtn.onclick = () => Graphics.polarizeHandler(document.body, board, piece)

    const stateInfo = document.querySelector(".state-info")
    const canvas = document.querySelector("#myCanvas")
    window.onload = () => {
      Graphics.drawBorders()
      stateInfo.style.height = canvas.clientHeight
    }
    
    window.onresize = () => {
      stateInfo.style.height = canvas.clientHeight
      stateInfo.style.width = canvas.clientWidth
      console.log(canvas.clientWidth)
    }
  })()
}

export default Tetris