export default (function() {
  const c = document.getElementById("myCanvas")
  const ctx = c.getContext("2d")
  const blockSize = 35
  const borderLineWidth = 10
  const gridHeight = blockSize * 24
  const gridWidth = blockSize * 10
  c.height = gridHeight + borderLineWidth * 2
  c.width = gridWidth + borderLineWidth * 2
  
  const scoreElement = document.getElementById("score")
  const scoreBoardElement = document.getElementById("scoreboard")
  const levelElement = document.getElementById("lvl")
  const finalScoreElement = document.getElementById("finalScore")
  const gameOverElement = document.getElementById("gOvr")
  const gamePausedElement = document.getElementById("gamePaused")
  
  let borderColor = "white"
  let squareBorderColor = "white"
  let squareColor1 = "white"
  let squareColor2 = "black"
  
  function polarizeHandler(element, board, piece) {
    if (element.classList.contains("polarized")) {
      borderColor = "white"
      squareBorderColor = "white"
      squareColor1 = "white"
      squareColor2 = "black"
    } else {
      borderColor = "black"
      squareBorderColor = "black"
      squareColor1 = "black"
      squareColor2 = "white"
    }
    element.classList.toggle("polarized")
    if (board == null) return drawEverything([], [])
    drawEverything(board, piece)
  }

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
    let sLineWidth = .4
    // let sLineWidth = 1
    ctx.beginPath()
    ctx.lineWidth = sLineWidth
    ctx.strokeStyle = squareBorderColor
    ctx.strokeStyle = squareColor2
    //  Linear gradience
    // let sq = ctx.createLinearGradient(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize * x + blockSize, blockSize * y + blockSize)
    let sq = ctx.createLinearGradient(blockSize + borderLineWidth + blockSize * x, blockSize * y, borderLineWidth + blockSize * x, blockSize * y + blockSize)
    // sq.addColorStop(0.4, squareColor1)
    sq.addColorStop(0.5, squareColor1)
    sq.addColorStop(1, squareColor2)
    ctx.fillStyle = sq
    ctx.fillRect(borderLineWidth + blockSize * x, borderLineWidth + blockSize * y, blockSize, blockSize)
    //  draw square lines
    ctx.strokeRect(borderLineWidth + sLineWidth + (blockSize * x), borderLineWidth + sLineWidth + (blockSize * y), blockSize - (sLineWidth * 2), blockSize - (sLineWidth * 2))
  }
  
  function drawPiece(p) {
    for (let i = p.length - 1; i >= 0; i--) {
      if (p[i].isOccupied) 
        drawSquare(p[i].x, p[i].y)
    }
  }
  
  function drawBoard(board) {
    drawBorders()
    for (let y = board.length - 1; y > 0; y--) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x].isOccupied) 
          drawSquare(x, y)
      }
    }
  }
  
  function drawEverything(board, piece) {
    ctx.clearRect(0, 0, c.width, c.height)
    drawBoard(board)
    drawPiece(piece)
  }
  
  function displayGameOver() {
    gameOverElement.style.opacity = 1
  }

  
  
  function displayLevelText(level) {
    const container = document.querySelector(".state-info__level")
    while (container.firstChild) 
      container.firstChild.remove()
    let lvlEl = document.createElement("h1")
    lvlEl.innerText = `Level ${level}`
    lvlEl.id = "lvl"
    container.appendChild(lvlEl)
  }
  
  function displayFinalScore(score) {
    finalScoreElement.innerText = "Your score: \n" + score
  }

  function updateScore(score) {
    scoreElement.innerText = score
  }

  function pause() {
    gamePausedElement.innerText = "PAUSED"
  }
  
  function unPause() {
    gamePausedElement.innerText = ""
  }
  
  function resetUi() {
    displayLevelText(1)
    playButton.innerText = "Play"
    scoreElement.innerText = 0
    gameOverElement.setAttribute("style", "opacity: 0%")
    gamePausedElement.innerText = ""
    finalScoreElement.innerText = ""
    levelElement.setAttribute("style", "letter-spacing: 0px background: none opacity: 100")
  }

  return {
    resetUi,
    clearBoard,
    drawBorders,
    drawBoard,
    drawEverything,
    displayGameOver,
    displayFinalScore,
    updateScore,
    pause,
    unPause,
    displayLevelText,
    polarizeHandler
  }
})()
