import Logic from "./Logic.js"
import config from "../../config/prod.js"
import MobileControls from "../MobileControls/MobileControls.js"
import GraphicsModule from "../Graphics/Graphics.js"
import Highscores from "../Highscores/Highscore.js"

const Graphics = GraphicsModule(document)

function Tetris(document) {
  "use strict"
  return (() => {
    let board
    let piece
    let score
    let level
    let fps
    let trackRowCount
    let isPaused
    let gameOver
    let currentLevel
    var timeOutID
    let pieceStack
    let firstStart = true
    Graphics.resetUi(0)

    const highscoreWrapper = document.querySelector(".highscore-wrapper")
    const highscoreEl = document.querySelector(".highscore-wrapper")
    let IHighscore = Highscores()    
    let highscores = IHighscore.getHighscores()
    IHighscore.renderScores(highscoreEl, highscores)

    function initGame() {
      console.log("initializing")
      if (timeOutID != null) {
        window.clearTimeout(timeOutID)
        timeOutID = null
      }

      if (firstStart) {
        document.querySelector(".scoreboard").style.transform = "translateY(0)";
        firstStart = false
      }

      pieceStack = new Logic.PieceStack()
      board = Logic.createBoard()
      piece = pieceStack.getPiece().PIECE
      score = config.startingScore
      level = config.startingLevel
      fps = Logic.calculateFps(level)
      trackRowCount = 0
      isPaused = false
      gameOver = false  
      currentLevel = level
      if ([...highscoreWrapper.classList].includes("game-over"))
        highscoreWrapper.classList.remove("game-over")
      Graphics.displayPieceStack(pieceStack.getStack())
      Graphics.resetUi(level)
      Graphics.drawEverything(board, piece)
    }
    
    function tick(direction) {
      if (!isPaused && !gameOver) {
        frame(direction);
        ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, level));
        if (currentLevel != level) {
          currentLevel = level
          fps = Logic.moveToNextLevel(level)
          Graphics.displayLevelText(level)
        }
        timeOutID = schedule()
      } else {
        window.clearTimeout(timeOutID)
        timeOutID = null
      }
    }

    async function frame(direction) {
      piece = Logic.movePiece(board, piece, direction)
      if (piece == -1) {
        piece = pieceStack.getPiece().PIECE
        Graphics.displayPieceStack(pieceStack.getStack())
      }
      let scoreMultiplier = Logic.checkFullRowsAndEndCondition(board)
      if (scoreMultiplier === -1) {
        console.log("Game over")
        gameOver = true
        highscoreWrapper.classList.add("game-over")
        Graphics.displayGameOver()
        Graphics.displayFinalScore(score)
        Graphics.removePieceStack()
        playButton.innerText = "Play"
        highscores = await IHighscore.checkForHighscore(highscoreEl, highscores, score)
        return
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
      if (isPaused) { 
        timeOutID = schedule()
        Graphics.unPause()
      }
      else { 
        window.clearTimeout(timeOutID)
        Graphics.pause()
        timeOutID = null
      }
      return isPaused = !isPaused
    }

    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    document.addEventListener("keydown", e => {
      if (gameOver || firstStart) return
      if (arrowKeys.includes(e.code)) {
        if (isPaused) return
        const direction = e.code.slice(5).toLowerCase()
        frame(direction)
        return
      }
      if (e.code == config.keys.pause) {
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

    const pauseButton = document.querySelector("#pauseButton")
    pauseButton.onclick = togglePause

    const themeSwitchBtn = document.querySelector("#themeSwitch")
    themeSwitchBtn.onclick = () => Graphics.polarizeHandler(document.body, board, piece, pieceStack?.getStack())

    MobileControls(document, frame)
    
    const tetrisContainer = document.querySelector(".tetris-container")
    const canvas = document.querySelector("#myCanvas")
    window.onload = () => {
      tetrisContainer.style.width = `${canvas.clientWidth + 6}px`
    }
  
    window.onresize = () => {
      tetrisContainer.style.width = `${canvas.clientWidth + 6}px`
    }
  })()
}

export default Tetris