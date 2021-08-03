import config from "../../config/prod.js"

export default function(document) {
  return (function() {
    "use strict"

    const c = document?.querySelector("#myCanvas")
    const squareSize = config.square.size
    const borderLineWidth = config.border.width
    const gridHeight = squareSize * config.board.height
    const gridWidth = squareSize * config.board.width

    const ctx = c.getContext("2d")
    c.height = gridHeight
    c.width = gridWidth
          
    const scoreElement = document.getElementById("score")
    const finalScoreElement = document.getElementById("finalScore")
    const levelElement = document.getElementById("lvl")
    const gameOverElement = document.getElementById("gOvr")
    const gamePausedElement = document.getElementById("gamePaused")

    
    let borderColor = config.border.color
    // let squareBorderColor = config.square.secondaryColor
    let squareBorderColor = config.square.secondaryColor
    // let squareBorderColor = config.square.primaryColor
    let squareColor1 = config.square.primaryColor
    let squareColor2 = config.square.secondaryColor

    let isPolarized
    // polarizeHandler(document.body, [], [], [])

    
    function polarizeHandler(element, board, piece) {
      console.log("handling polarization")
      const pageContainer = document.querySelector(".page-container")
      pageContainer.classList.toggle("right-aligned-background")
      if (element.classList.contains("polarized")) {
        borderColor = config.border.color
        squareBorderColor = config.square.primaryColor
        squareColor1 = config.square.primaryColor
        squareColor2 = config.square.secondaryColor
        isPolarized = false
      } else {
        borderColor = config.square.secondaryColor
        squareBorderColor = config.square.secondaryColor
        squareColor1 = config.square.secondaryColor
        squareColor2 = config.square.primaryColor
        isPolarized = true
      }
      element.classList.toggle("polarized")
      if (board == null) return drawEverything([], [])
      drawEverything(board, piece)
    }

    function displayPieceStack(stack) {
      const pieceStackEl = document.querySelector(".state-info__piece-stack")
      pieceStackEl.style.opacity = "1"
      while (pieceStackEl.firstChild) pieceStackEl.firstChild.remove()
      for (let i = 0; i < stack.length; i++) {
        let pieceEl = pieceStackEl.appendChild(document.createElement("div"))
        pieceEl.classList = `${stack[i].constructor.name} piece-stack__piece`
        for (let square of stack[i].PIECE) {
          let sq = document.createElement("div")
          let width = 20 - (i * 2)       
          sq.className = "piece-stack__square"
          sq.style.cssText = `left: ${(square.x - 4)*width}%; top: ${square.y * width}%; width: ${width}%; height: ${width}%; opacity: ${100 - 20 * i}%;`   
          pieceEl.appendChild(sq)
        }
      }
    }

    function clearBoard() {
      ctx.clearRect(0 + borderLineWidth, 0 + borderLineWidth, c.width - borderLineWidth * 2, c.height - borderLineWidth * 2)
    }
    
    function drawBorders() {
      return
      // To line up drawed borders with actual ones
      let borderLineAdjustment = 1
      ctx.beginPath()
      ctx.lineWidth = borderLineWidth
      ctx.strokeStyle = borderColor
      let clr = "rgb(100, 100, 100)"
      // if (!isPolarized) clr = "rgba(255, 255, 255, .5)"
      // else clr = "rgba(0, 0, 0, 1)"
      ctx.strokeStyle = clr

      // ctx.strokeStyle = "transparent"
      ctx.moveTo(borderLineAdjustment, 0)
      ctx.lineTo(borderLineAdjustment, c.height - borderLineAdjustment)
      ctx.stroke()
      // ctx.strokeStyle = borderColor
      ctx.lineTo(c.width - borderLineAdjustment, c.height - borderLineAdjustment)
      ctx.lineTo(c.width - borderLineAdjustment, 0)
      ctx.stroke()
    }
    
    function drawSquare(x, y) {
      let sLineWidth = .2
      // let sLineWidth = 1
      ctx.beginPath()
      ctx.lineWidth = sLineWidth
      ctx.strokeStyle = squareColor2
      // ctx.strokeStyle = squareBorderColor
      //  Linear gradience
      // let sq = ctx.createLinearGradient(borderLineWidth + squareSize * x, borderLineWidth + squareSize * y, squareSize * x + squareSize, squareSize * y + squareSize)
      // sq.addColorStop(.1, squareColor1)
      // sq.addColorStop(1, squareColor2)
      
      // MAIN
      // let opacity = `${(y / config.board.height)}`
      // let sq = ctx.createLinearGradient(
      //   borderLineWidth + (squareSize * x) - squareSize / 3, 
      //   (squareSize * y), 
      //   borderLineWidth + (squareSize * x) - squareSize / 4, 
      //   (squareSize * y) + squareSize * 2)
      // sq.addColorStop(.3, squareColor1)
      // sq.addColorStop(.7, squareColor2)
      // ctx.fillStyle = sq
      // ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`

      /////////////////////////////// STYLE 1 ////////////////////////
      let opacity = `${(y / config.board.height)}`
      let rgbVal
      let modifiedVal
      if (isPolarized) {
        // rgbVal = 255 - (opacity * 255)
        rgbVal = 255 - (opacity * 255) + y * 3
        modifiedVal = y > 0 ? rgbVal - y * 5: rgbVal
      } else {
        // rgbVal = opacity * 255
        rgbVal = (opacity * 255)
        modifiedVal = y > 0 ? rgbVal - y * 5 : rgbVal
      }

      let sq = ctx.createLinearGradient(borderLineWidth + squareSize * x, borderLineWidth + squareSize * y, squareSize * x + squareSize, squareSize * y + squareSize)
        
      let color1 = `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`;
      let color2 = `rgb(${modifiedVal}, ${modifiedVal}, ${modifiedVal})`;

      let min = .3, max = .8;
      let colorStop = opacity < min ? min : opacity > max ? max : opacity 
      sq.addColorStop(.2, color1)
      sq.addColorStop(colorStop, color2)

      // sq.addColorStop(.1, squareColor2)
      // sq.addColorStop(colorStop, `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`)

      // sq.addColorStop(.1, `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`)
      // sq.addColorStop(opacity, squareColor2)
      ctx.fillStyle = sq
      
      /////////////////////////////// STYLE 2 ////////////////////////
      // let opacity = `${(y / config.board.height) - (x / config.board.width)}`
      // let rgbVal
      // if (isPolarized)
      //  rgbVal = opacity * 255
      // else
      //  rgbVal = 255 - (opacity * 255)

      // let sq = ctx.createLinearGradient(
      //   borderLineWidth + squareSize * x, 
      //   borderLineWidth + squareSize * y, 
      //   squareSize * x + squareSize, 
      //   squareSize * y + squareSize)
      // sq.addColorStop(.1, `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`)
      // sq.addColorStop(.5, squareColor1)
      // ctx.fillStyle = sq

      /////////////////////////////// STYLE 3 ////////////////////////
      // let opacity = `${(y / config.board.height) - (x / config.board.width)}`
      // let rgbVal
      // if (isPolarized)
      //  rgbVal = opacity * 255
      // else
      //  rgbVal = 255 - (opacity * 255)

      // let sq = ctx.createLinearGradient(
      //   borderLineWidth + squareSize * x, 
      //   borderLineWidth + squareSize * y, 
      //   squareSize * x + squareSize, 
      //   squareSize * y + squareSize)
      // sq.addColorStop(.1, `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`)
      // sq.addColorStop(1, squareColor1)
      // ctx.fillStyle = sq

      // ctx.fillStyle = `rgb(${rgbVal}, ${rgbVal}, ${rgbVal})`
      ctx.fillRect(squareSize * x, squareSize * y, squareSize, squareSize)
      
      //  draw square lines
      ctx.strokeStyle = squareBorderColor
      ctx.strokeRect(sLineWidth + (squareSize * x), sLineWidth + (squareSize * y), squareSize - (sLineWidth * 2), squareSize - (sLineWidth * 2))
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

    function pause() {
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")
      
      gamePausedElement.innerText = "PAUSED"
      stackFirstPiece.style.animation = "none"
    }
    
    function unPause() {
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")

      gamePausedElement.innerText = ""
      stackFirstPiece.style.animation = "var(--animation-first-piece)"
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
      drawBorders,
      drawBoard,
      drawEverything,
      displayGameOver,
      displayFinalScore,
      updateScore,
      pause,
      unPause,
      displayLevelText,
      polarizeHandler,
      displayPieceStack
    }
  })()
}

