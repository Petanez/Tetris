"use strict"
import Logic from "./Logic.js"
import GraphicsModule from "../Graphics/Graphics.js"
import config from "../../config/prod.js"
import MobileControls from "../MobileControls/MobileControls.js"
import Highscores from "../Highscores/Highscore.js"

export default function Tetris(document, ai) {
  const Graphics = GraphicsModule(document)
  Graphics.resetUi(0)

  // Mobile controls
  MobileControls(document, frame)

  // Highscores
  const highscoreWrapper = document.querySelector(".highscore-wrapper")
  Highscores.renderScores(highscoreWrapper)

  let firstStart = true
  let debug = false
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

  function initGame() {
    console.log("initializing")
    if (timeOutID != null) {
      window.clearTimeout(timeOutID)
      timeOutID = null
    }

    if (firstStart) {
      document.querySelector(".scoreboard").style.opacity = "1";
      firstStart = false
    }

    pieceStack = new Logic.PieceStack()
    board = debug ? Logic.createTestBoard(10) : Logic.createBoard()
    piece = debug ? Logic.newTestPiece().PIECE : pieceStack.getPiece().PIECE
    score = config.initial.score
    level = config.initial.level
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
      window.requestAnimationFrame(() => frame(direction, false))
      timeOutID = schedule()
    } else {
      window.clearTimeout(timeOutID)
      timeOutID = null
    }
  }

  function frame(direction, dropPiece = false) {
    if (dropPiece) {
      while (piece.length) {
        piece = Logic.movePiece(board, piece, direction)
      }
    }
    else
      piece = Logic.movePiece(board, piece, direction)
    if (!piece.length) {
      piece = pieceStack.getPiece().PIECE
      Graphics.animateFirstPiece()
      Graphics.displayPieceStack(pieceStack.getStack())
      if (Logic.spaceIsOccupied(board, piece)) 
        handleGameOver()
    }
    let rowsToReplace = Logic.checkFullRows(board)
    if (rowsToReplace.length)
      Graphics.rowRemovalAnimations(rowsToReplace)
    let scoreMultiplier = rowsToReplace.length
    trackRowCount += scoreMultiplier
    score = Logic.addScore(scoreMultiplier, level, score);
    Graphics.updateScore(score);
    Graphics.drawEverything(board, piece);

    ({ trackRowCount, level } = Logic.incrementLevelAfter10Clears(trackRowCount, level));
    if (currentLevel != level) {
      currentLevel = level
      fps = Logic.moveToLevel(level)
      Graphics.displayLevelText(level)
    }
  }
  
  function schedule() {
    return window.setTimeout(tick, fps)
  }

  let target;
  function aiTick() {
    console.log("in timeout")
    if (piece && !target) {
      target = Logic.getTarget(board, piece)

    }
    if (!isPaused) aiSchedule()
  }

  function aiSchedule() {
    return window.setTimeout(aiTick, 400)
  }

  function playGame(ai) {
    console.log("Game started")
    if (ai) {
      aiSchedule();
    }
    return timeOutID = schedule()
  }
  
  async function handleGameOver(error = "") {
    console.log("Game over")
    gameOver = true
    Graphics.displayGameOver()
    Graphics.displayFinalScore(score)
    Graphics.removePieceStack()
    playButton.innerText = "Play"
    highscoreWrapper.classList.add("game-over")
    await Highscores.checkForHighscore(highscoreWrapper, score, error)
      .catch((e) => {
        console.log(e)
        handleGameOver(e)
      })
  }

  function togglePause() {
    if (isPaused) { 
      timeOutID = schedule()
    } else { 
      window.clearTimeout(timeOutID)
      timeOutID = null
    }
    Graphics.togglePause(isPaused)
    return isPaused = !isPaused
  }

  const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
  document.addEventListener("keydown", e => {
    if (gameOver || firstStart) return
    if (e.code == "Space" && !isPaused) {
      window.requestAnimationFrame(() => frame("down", true))
      return
    }
    if (arrowKeys.includes(e.code)) {
      if (isPaused) return
      const direction = e.code.slice(5).toLowerCase()
      window.requestAnimationFrame(() => frame(direction, false))
      return
    }
    if (e.code == config.keys.pause) {
      togglePause()
      return
    }
  })

  const playButton = document.getElementById("playButton")
  playButton.onclick = () => {
    playButton.blur();
    initGame()
    playGame(ai)
    playButton.innerText = "Restart"
  } 

  const pauseButton = document.querySelector("#pauseButton")
  pauseButton.onclick = () => {
    if (gameOver || firstStart) return
    togglePause()
  }

  const themeSwitchBtn = document.querySelector("#themeSwitch")
  themeSwitchBtn.onclick = () => Graphics.polarizeHandler(document.body, board, piece, pieceStack?.getStack())

  const tetrisContainer = document.querySelector(".tetris-container")
  const canvas = document.querySelector("#myCanvas")
  window.onload = () => {
    tetrisContainer.style.width = `${canvas.clientWidth + config.board.borderWidth * 2}px`
  }
  window.onresize = () => {
    tetrisContainer.style.width = `${canvas.clientWidth + config.board.borderWidth * 2}px`
  }
}