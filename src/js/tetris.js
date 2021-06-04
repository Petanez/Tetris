import Logic from "./Logic"
import Graphics from "./Graphics"
import config from "../config/dev"

function Tetris() {
  return (() => {
    let board
    let piece
    let score = 0
    let level = 1
    let fps = Logic.calculateFps(level)
    let trackRowCount = 0
    let isPaused = false
    let gameOver = false  
    let currentLevel = level
    Graphics.resetUi(level)
    let timeOut

    function initGame() {
      clearTimeout(timeOut)
      timeOut = null
      board = Logic.createBoard()
      piece = Logic.newPiece()
      score = 0
      level = 1
      fps = Logic.calculateFps(level)
      trackRowCount = 0
      isPaused = false
      gameOver = false  
      currentLevel = level
      Graphics.resetUi(level)
      timeOut
    }
    
    function playGame() {
      console.log("Game started")
      // if (config.dev) {
      //   board = Logic.createTestBoard()
      //   piece = Logic.newTestPiece()
      // } else {
      //   board = Logic.createBoard()
      //   piece = Logic.newPiece()
      // } 
      // let score = 0
      // let level = 1
      // let fps = Logic.calculateFps(level)
      // let trackRowCount = 0
      // let isPaused = false
      // let gameOver = false  
      // let currentLevel = level
      // Graphics.resetUi(level)
      // let timeOut


      function tick() {
        if (!isPaused && !gameOver) {
          timeOut = schedule()
        } else {
          clearTimeout(timeOut)
        }
      }
      
      function schedule() {
        timeOut = setTimeout(() => {
          let scoreMultiplier = Logic.checkFullRowsAndEndCondition(board)
          score = Logic.addScore(scoreMultiplier, level, score);
          Graphics.updateScore(score);
          ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, level));
          if (currentLevel != level) {
            currentLevel = level
            mainInterval = Logic.moveToNextLevel(level)
          }
          piece = Logic.runLevel(board, piece)
          tick()
        }, 500)
      }


      const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
      document.addEventListener("keydown", e => {
        if (arrowKeys.includes(e.code)) {
          const direction = e.code.slice(5).toLowerCase()
          piece = Logic.movePiece(board, piece, direction)
          Graphics.drawEverything(board, piece)
        }
        if (e.code == "KeyP") isPaused = !isPaused
        // if (e.code == "KeyO") 
      })

      function togglePause() {
        isPaused = !isPaused
      }

      schedule()
      return
    }
    const stateInfo = document.querySelector(".state-info")
    const canvas = document.querySelector("#myCanvas")
    window.onload = () => {
      Graphics.drawBorders()
      stateInfo.style.height = canvas.clientHeight
    }

    return {
      playGame,
      initGame
    }
  })()
}

export default Tetris