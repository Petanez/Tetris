import Logic from "./Logic"
import Graphics from "./Graphics"
import config from "../config/dev"

function Tetris(document) {
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
    let timeOutID

    function initGame() {
      console.log("initializing")
      if (timeOutID != null) {
        console.log("Timeout is not null ")
        window.clearTimeout(timeOutID)
        timeOutID = null
      } 
      if (config.dev) {
        board = Logic.createTestBoard()
        piece = Logic.newTestPiece()
      } else {
        board = Logic.createBoard()
        piece = Logic.newPiece()
      } 
      score = 0
      level = 1
      fps = Logic.calculateFps(level)
      trackRowCount = 0
      isPaused = false
      gameOver = false  
      currentLevel = level
      Graphics.resetUi(level)
    }
    
    function tick(direction) {
      // window.clearTimeout(timeOutID)
      if (!isPaused && !gameOver) {
        frame(direction);
        ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, level));
        if (currentLevel != level) {
          currentLevel = level
          fps = Logic.moveToNextLevel(level)
        }
        schedule()
      }
    }

    function frame(direction) {
      piece = Logic.runLevel(board, piece, direction)
      let scoreMultiplier = Logic.checkFullRowsAndEndCondition(board)
      trackRowCount += scoreMultiplier
      score = Logic.addScore(scoreMultiplier, level, score);
      Graphics.updateScore(score);
    }
    
    function schedule() {
      timeOutID = setTimeout(tick, fps)
    }

    function playGame() {
      console.log("Game started")
      schedule()
      return
    }

    function togglePause() {
      isPaused = !isPaused
    }

    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    document.addEventListener("keydown", e => {
      if (arrowKeys.includes(e.code)) {
        const direction = e.code.slice(5).toLowerCase()
        if (direction === "down") {
          frame(direction)
          return
        }
        // piece = Logic.movePiece(board, piece, direction)
        frame(direction)
        Graphics.drawEverything(board, piece)
        return
      }
      if (e.code == "KeyP") {
        if (isPaused) { schedule(); Graphics.unPause(); }
        else { window.clearTimeout(timeOutID); Graphics.pause(); }
        togglePause()
        return
      }
      // if (e.code == "KeyO") 
    })

    const stateInfo = document.querySelector(".state-info")
    const canvas = document.querySelector("#myCanvas")

    const normButton = document.getElementById("normButton")
    normButton.onclick = () => {
      initGame()
      playGame()
    } 

    const themeSwitchBtn = document.querySelector("#themeSwitch")
    themeSwitchBtn.onclick = () => Graphics.polarizeHandler(document.body, board, piece)

    window.onload = () => {
      Graphics.drawBorders()
      stateInfo.style.height = canvas.clientHeight
    }
    
    window.onresize = () => {
      stateInfo.style.height = canvas.clientHeight
    }
  })()
}

export default Tetris