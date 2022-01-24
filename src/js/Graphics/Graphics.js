"use strict"
import config from "../../config/prod.js"

export default function(document) {
  const root = document.documentElement
  root.style.setProperty("--thickness-canvas-border", config.board.borderWidth + "px")
  root.style.setProperty("--time-first-piece-animation", config.pieceStack.firstPiece.animationTime + "ms")

  const rowRemovalAnimationTime = 700;
  const c = document?.querySelector("#myCanvas")
  const squareSize = config.square.size
  const gridHeight = squareSize * config.board.height
  const gridWidth = squareSize * config.board.width
  const primaryColor = config.square.primaryColor
  const secondaryColor = config.square.secondaryColor
  const boardWidth = config.board.width
  const boardHeight = config.board.height


  const ctx = c.getContext("2d")
  c.height = gridHeight
  c.width = gridWidth
        
  const scoreElement = document.getElementById("score")
  const finalScoreElement = document.getElementById("finalScore")
  const levelElement = document.getElementById("lvl")
  const gameOverElement = document.getElementById("gOvr")
  const gamePausedElement = document.getElementById("gamePaused")
  const pieceStackEl = document.querySelector(".state-info__piece-stack")
  
  let squareBorderColor = config.square.primaryColor
  let isPolarized = JSON.parse(localStorage.getItem(config.polarized.storageKey)) || false
  if (isPolarized) document.body.classList.add("polarized")
  
  
  function polarizeHandler(element, board, piece) {
    console.log("handling polarization")
    if (element.classList.contains("polarized")) {
      squareBorderColor = config.square.secondaryColor
      isPolarized = false
      JSON.stringify(localStorage.setItem(config.polarized.storageKey, JSON.stringify(false)))
    } else {
      squareBorderColor = config.square.primaryColor
      isPolarized = true
      JSON.stringify(localStorage.setItem(config.polarized.storageKey, JSON.stringify(true)))
    }
    element.classList.toggle("polarized")
    if (board == null) 
      return drawEverything([], [])
    drawEverything(board, piece)
  }

  function displayPieceStack(stack) {
    pieceStackEl.style.opacity = "1"
    removePieceStack()
    for (let i = 0; i < stack.length; i++) {
      let pieceEl = pieceStackEl.appendChild(document.createElement("div"))
      pieceEl.classList = `${stack[i].constructor.name} piece-stack__piece`
      for (let square of stack[i].PIECE) {
        let sq = document.createElement("div")
        let width = 20 - (i * 4)       
        sq.className = "piece-stack__square"
        sq.style.cssText = `left: ${(square.x - 4)*width - i * 20}%; top: ${square.y * width + (i * 10)}%; width: ${width}%; height: ${width}%; filter: blur(.${i}1em);`   
        sq.style.opacity = i > 0 ? `.${40 - 7 * i}` : '.80';
        pieceEl.appendChild(sq)
      }
    }
  }

  function animateFirstPiece() {
    let firstPiece = document?.querySelector(".piece-stack__piece:first-of-type")
    if (firstPiece) {
      let effectPiece = firstPiece.cloneNode(true)
      effectPiece.className = "piece-stack__effect-piece"
      const tetrisContainer = document.querySelector(".tetris-container")
      tetrisContainer.appendChild(effectPiece)
      setTimeout(() => {
        effectPiece.remove()
      }, config.pieceStack.firstPiece.animationTime)
    }
  }

  function removePieceStack() {
    while (pieceStackEl.firstChild) 
      pieceStackEl.firstChild.remove()
  }

  function clearBoard() {
    ctx.clearRect(0, 0, c.width, c.height)
  }

  function rowRemovalAnimations(rowsToRemove) {
    console.log("drawing removal animations")
    for (let i = 0; i < rowsToRemove.length; i++) {
      let stateInfo = document.querySelector(".state-info")
      let pieceHeight = stateInfo.clientHeight / boardHeight
      let width = stateInfo.clientWidth
      let rowEl = document.createElement("div")
      // rowEl.style.cssText = `opacity: 0; position: absolute; z-index: -1000; top: ${pieceHeight * rowsToRemove[i]}; width: ${width}; height: ${pieceHeight}; background: ${isPolarized ? primaryColor : secondaryColor}; 
      // animation: piece-removal-animation ${rowRemovalAnimationTime}ms  ease-in forwards;`

      // rowEl.style.cssText = `opacity: 0; position: absolute; z-index: -1000; top: ${pieceHeight * rowsToRemove[i]}; width: ${width}; height: ${pieceHeight}; background: ${isPolarized ? primaryColor : secondaryColor}; 
      // animation: piece-removal-animation ease-in forwards;`
      console.log(rowsToRemove[i])
      let multiplier = 5
      let rgb = isPolarized ? (255 - (rowsToRemove[i] * multiplier)) : rowsToRemove[i] * multiplier
      // let rgb = (rowsToRemove[i] * 5)
      rowEl.style.cssText = `opacity: 0; position: absolute; z-index: -1000; top: ${pieceHeight * rowsToRemove[i]}; width: ${width}; height: ${pieceHeight}; background: rgb(${rgb}, ${rgb}, ${rgb});
      animation: piece-removal-animation ease-in-out forwards;`
      rowEl.style.animationDuration = `${rowRemovalAnimationTime}ms`
      rowEl.style.border = `1px solid black`
      // rowEl.style.animationDelay = '1000ms'

      stateInfo.appendChild(rowEl)
      setTimeout(() => {
        rowEl.remove()
      }, rowRemovalAnimationTime)
    }
  }
  
  function drawSquare(x, y, dropPiece = false, blankSquare = false) {
    let drawOpacity = dropPiece ? .1 : 1;
    ctx.beginPath()
    let opacity = `${((y / 2) / config.board.height)}`
    // let opacity = `${((y / 4) / config.board.height)}`
    // let opacity = 0
    let rgbVal
    let modifiedVal
    if (isPolarized) {
      rgbVal = 255 - (opacity * 255)
      modifiedVal = rgbVal
    } else {
      rgbVal = (opacity * 250)
      modifiedVal = rgbVal
    }

    // Ugly
    if (!dropPiece) {
      let min = .3, max = 1;
      let sq = ctx.createLinearGradient(squareSize * x, squareSize * y, squareSize * x + squareSize, squareSize * y + squareSize)
      let color1 = `rgba(${rgbVal}, ${rgbVal}, ${rgbVal}, ${drawOpacity})`;
      let color2 = `rgba(${modifiedVal}, ${modifiedVal}, ${modifiedVal}, ${drawOpacity})`;
      sq.addColorStop(min, color1)
      sq.addColorStop(max, color2)
      ctx.fillStyle = color1
      // ctx.fillStyle = "black"
    } else if(!blankSquare) {
      // Duplicate , fix at some point you piece of poop
      const lightColor = "rgb(45, 45, 45)"
      const darkColor = "rgb(210,210,210)"
      // const colorUsed = isPolarized ? darkColor : lightColor 
      const colorUsed = isPolarized ? lightColor : darkColor 
    
      ctx.fillStyle = colorUsed
    }
    if (!blankSquare)
      ctx.fillRect(squareSize * x, squareSize * y, squareSize, squareSize)
    // Ugly
        
    //  draw square lines
    if (!dropPiece) {
      let sLineWidth = .1
      ctx.lineWidth = sLineWidth
      let rgb = isPolarized ? (0 + y*8) : (255 - y * 8)
      // let rgb = 0 + y * 8
      ctx.strokeStyle = `rgba(${rgb},${rgb},${rgb},${y*(y/config.board.height)})`
      ctx.strokeRect(sLineWidth + (squareSize * x), sLineWidth + (squareSize * y), squareSize - (sLineWidth * 2), squareSize - (sLineWidth * 2))
    }
    // if (blankSquare)
  }
  
  function drawPiece(p, minDiff) {
    // draw "drop" piece
    for (let i = p.length - 1; i >= 0; i--) {
      drawSquare(p[i].x, p[i].y + minDiff - 1, true)
    }
    // draw piece
    for (let i = p.length - 1; i >= 0; i--) {
      if (p[i].isOccupied){
        drawSquare(p[i].x, p[i].y)
      } 
    }
  }

  function drawBoard(board) {
    if (board != null)
      for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
          if (board[y][x].isOccupied) 
            drawSquare(x, y)
          else 
            drawSquare(x, y, false, true)
        }
      }
  }
  
  function drawEverything(board, piece) {
    ctx.clearRect(0, 0, c.width, c.height)
    drawBoard(board)

    // Ugly
    let highestYs = board.reduce((yIndexes, r, rI) => {
      for (let c = 1; c <= r.length; c++) {
        if (board[rI][c - 1].isOccupied && yIndexes[c] > rI)
          yIndexes[c] = rI
      }
      return yIndexes
    }, Array.from({ length: 11 }, () => 24))
    highestYs.shift()
    let dropPieceDrawHeight = piece.reduce((a, c) => {
      if (!a[c.x])
        a[c.x] = c.y
      else if (a[c.x] < c.y)
        a[c.x] = c.y
      return a
    }, {})
    let minDiff = Object.keys(dropPieceDrawHeight)
      .reduce((a, c) => {
        let diff = highestYs[c] - dropPieceDrawHeight[c]
        if (diff < a)
          a = diff
        return a
      }, 24)
    // Ugly

    drawPiece(piece, minDiff)
  }
  
  function displayGameOver() {
    gameOverElement.style.opacity = 1
    const game = document.querySelector(".game-over-text__game")
    const over = document.querySelector(".game-over-text__over")
    // game.style.transform = "translateX(0)"
    // over.style.transform = "translateX(0)"
  }

  function displayLevelText(level) {
    const container = document.querySelector(".state-info__level")
    container.style.display = "block"
    while (container.firstChild) 
      container.firstChild.remove()
    let lvlEl = document.createElement("h1")
    lvlEl.innerText = level === 0 ? "" : `Level ${level}`
    lvlEl.id = "lvl"
    container.appendChild(lvlEl)
  }
  
  function displayFinalScore(score) {
    finalScoreElement.innerText = "Your score: \n" + score
  }

  function updateScore(score) {
    scoreElement.innerText = score
  }

  function togglePause(isPaused) {
    console.log("toggling pause")
    if (isPaused) {
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")
      gamePausedElement.innerText = ""
      stackFirstPiece.style.animation = "var(--animation-first-piece)"
    } else {
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")
      gamePausedElement.innerText = "PAUSED"
      stackFirstPiece.style.animation = "none"
    }
  }
  
  function resetUi(level) {
    displayLevelText(level)
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
    drawBoard,
    drawEverything,
    displayGameOver,
    displayFinalScore,
    updateScore,
    togglePause,
    displayLevelText,
    polarizeHandler,
    displayPieceStack,
    removePieceStack,
    animateFirstPiece,
    rowRemovalAnimations
  }
}

