/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config/prod.js":
/*!****************************!*\
  !*** ./src/config/prod.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  startingScore: 0,
  startingLevel: 1,
  border: {
    width: 2,
    color: "white"
  },
  square: {
    size: 35,
    primaryColor: "white",
    secondaryColor: "black"
  },
  board: {
    height: 24,
    width: 10
  },
  keys: {
    pause: "KeyP"
  },
  errorMsgs: {
    highscoreNotFound: "Highscore not found"
  }
});

/***/ }),

/***/ "./src/js/Graphics/Graphics.js":
/*!*************************************!*\
  !*** ./src/js/Graphics/Graphics.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(document) {
  return (function() {
    "use strict"

    const c = document?.querySelector("#myCanvas")
    const squareSize = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.size
    const borderLineWidth = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.border.width
    const gridHeight = squareSize * _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height
    const gridWidth = squareSize * _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.width

    const ctx = c.getContext("2d")
    c.height = gridHeight
    c.width = gridWidth
          
    const scoreElement = document.getElementById("score")
    const finalScoreElement = document.getElementById("finalScore")
    const levelElement = document.getElementById("lvl")
    const gameOverElement = document.getElementById("gOvr")
    const gamePausedElement = document.getElementById("gamePaused")

    
    let borderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.border.color
    // let squareBorderColor = config.square.secondaryColor
    let squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
    // let squareBorderColor = config.square.primaryColor
    let squareColor1 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
    let squareColor2 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor

    let isPolarized
    // polarizeHandler(document.body, [], [], [])

    
    function polarizeHandler(element, board, piece) {
      console.log("handling polarization")
      const pageContainer = document.querySelector(".page-container")
      pageContainer.classList.toggle("right-aligned-background")
      if (element.classList.contains("polarized")) {
        borderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.border.color
        squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
        squareColor1 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
        squareColor2 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
        isPolarized = false
      } else {
        borderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
        squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
        squareColor1 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
        squareColor2 = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
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
      let opacity = `${(y / _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height)}`
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



/***/ }),

/***/ "./src/js/Highscores/Highscore.js":
/*!****************************************!*\
  !*** ./src/js/Highscores/Highscore.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _key_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./key.js */ "./src/js/Highscores/key.js");
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");



class HighscoreNotFoundError extends Error {}

function getHighscores(dbUrl) {
  let highscores
  if (dbUrl) {
    // Get highscores from a db
  } else {
    try {
      highscores = getHighscoresFromLocalStorage()
    } catch (e) {
      console.log(e)
      highscores = Array.from({ length: 10 }, () => {
        return {
          name: "",
          score: 0
        }
      })
    } 
  }
  return highscores
}

function getHighscoresFromLocalStorage() {
  let highscores
  let key 
  for (let i = 0; key = window.localStorage.key(i); i++) {
    if (key == _key_js__WEBPACK_IMPORTED_MODULE_0__.default)
      highscores = JSON.parse(window.localStorage.getItem(key))
  }
  if (!highscores) throw new HighscoreNotFoundError(_config_prod_js__WEBPACK_IMPORTED_MODULE_1__.default.errorMsgs.highscoreNotFound)
  else return highscores
}

function renderScores(element, scores) {
  while (element.firstChild) element.firstChild.remove()
  let highscoresEl = document.createElement("div")
  highscoresEl.className = "highscores"
  for (let highscore of scores) {
    highscoresEl.appendChild(createScoreElement(highscore.name, highscore.score))
  }
  element.appendChild(highscoresEl)
}

function createScoreElement(name, score) {
  let el = document.createElement("div")
  el.className = "highscores__score"
  
  let nameEl = document.createElement("span")
  nameEl.innerText = name

  let scoreEl = document.createElement("span")
  scoreEl.innerText = score || ""

  el.appendChild(nameEl)
  el.appendChild(scoreEl)
  return el
}

function updateStorage(key, scores) {
  window.localStorage.setItem(key, JSON.stringify(scores))
}

function updateScore(element, highscores, highscore, i) {
  let newHead = highscores.slice(0, i)
  let newTail = [
    {
      name: highscore.name,
      score: highscore.score
    }, 
    ...highscores.slice(i, -1)
  ]
  const newScores = [...newHead, ...newTail]
  console.log(newScores)
  renderScores(element, newScores)
  updateStorage(_key_js__WEBPACK_IMPORTED_MODULE_0__.default, newScores)
  return newScores
}

async function checkForHighscore(element, highscores, score) {
  console.log(highscores)
  let i = highscores.findIndex(highscore => highscore.score < score)
  if (i != -1) {
    console.log("New highscore")
    const playerName = await renderForm()
    const highscore = { 
      name: playerName,
      score
    }
    return updateScore(element, highscores, highscore, i)
  } 
  return highscores
}

function createInput(attributes = []) {
  const input = document.createElement("input"); //input element, text
  for (let att of attributes) 
    input.setAttribute(att.name, att.value)
  return input
}

async function renderForm() {
  return new Promise((res, rej) => {
    const nameForm = document.createElement("form")

    const input = createInput([
      { name: "type", value: "text"},
      { name: "name", value: "name"},
      { name: "maxLength", value: "5"},
      { name: "placeholder", value: "Enter name (max 5 letter A-B)"}
    ])
    nameForm.appendChild(input)
    nameForm.id = "highscoreForm"
    nameForm.className = "js-name-form" 
    
    const submit = document.createElement("input")
    submit.setAttribute("type", "submit")
    submit.setAttribute("value", "Submit")
    nameForm.appendChild(submit)
    
    const pageWrapper = document.querySelector(".page-container")
    pageWrapper.appendChild(nameForm)
    
    nameForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let name = e.target.name.value 
      console.log("name in function: " + name)
      if (!isValidInput(name)) {
        e.target.remove()
        renderForm()
      }
      e.target.remove()
      res(name)
    })
  })
}

function isValidInput(str) {
  const regEx = /^[a-zA-z]+$/gi
  if (str.length > 5) return false
  if (!(regEx.test(str))) return false
  return true
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return (function() {   
    return {
      updateScore,
      checkForHighscore,
      getHighscores,
      renderScores
    }
  })()
}

/***/ }),

/***/ "./src/js/Highscores/key.js":
/*!**********************************!*\
  !*** ./src/js/Highscores/key.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("tetris.highscores");

/***/ }),

/***/ "./src/js/Logic/Logic.js":
/*!*******************************!*\
  !*** ./src/js/Logic/Logic.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Square_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Square.js */ "./src/js/Logic/Square.js");
/* harmony import */ var _Pieces_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pieces.js */ "./src/js/Logic/Pieces.js");
/* harmony import */ var _Graphics_Graphics_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Graphics/Graphics.js */ "./src/js/Graphics/Graphics.js");
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function() {
  "use strict"
  const newPiece = () => {
    return randomPiece()
  }

  const newTestPiece = () => {
    return new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.iPiece().PIECE
  }
  
  const lockPiece = (board, p) => {
    p.every(function (val) {
      return board[val.y][val.x].isOccupied = true
    })
  }

  function PieceStack() {
    let stack = Array.from({ length: 5 }, (_) => {
      return newPiece()
    })

    this.getStack = function() {
      return stack
    }

    this.getPiece = function() {
      let firstPiece = document.querySelector(".piece-stack__piece:first-of-type")
      if (firstPiece) {
        let effectPiece = firstPiece.cloneNode(true)
        effectPiece.className = "piece-stack__effect-piece"
        const tetrisContainer = document.querySelector(".tetris-container")
        tetrisContainer.appendChild(effectPiece)
        setTimeout(() => {
          effectPiece.remove()
        }, 140)
      }
      stack.push(newPiece())
      return stack.shift()
    }
  }
  
  function randomPiece() {
    const nPieces = 7
    const randomNum = Math.floor(Math.random() * nPieces)
    return (
        randomNum === 0 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.lPiece() : randomNum === 1 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.oPiece() : randomNum === 2 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.tPiece() :
        randomNum === 3 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.lPieceIsomer() : randomNum === 4 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.sPiece() : randomNum === 5 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.sPieceIsomer() : new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.iPiece()
      )
  }
  
  function tryLowerPiece(board, p) {
    if (p.every(square => square.y < board.length - 1)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y++
    } else {
      lockPiece(board, p)
      return -1
      // return newPiece().PIECE
    }
    // if the new x, y has an occupied square return to previous x, y
    if (p.some(square => board[square.y][square.x].isOccupied)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y--
      lockPiece(board, p)
      return -1
      // return newPiece().PIECE
    }
    return p
  }
  
  function movePiece(board, p, direction = "down") {
    if (!p.length) return
    if (direction === "left") {
      // check for boards min width
      if (p.every(square => square.x > 0))
        for (let i = 0; i < p.length; i++) 
          p[i].x--
      if (p.some(square => board[square.y][square.x].isOccupied)) {
        console.log("cant move there")
        for (let i = 0; i < p.length; i++) 
          p[i].x++
      }
    }
    if (direction === "right") {
      // check for boards max width
      if (p.every(square => square.x < board[0].length - 1)) {
        for (let i = 0; i < p.length; i++) 
          p[i].x++
      }
      if (p.some(square => board[square.y][square.x].isOccupied)) {
        console.log("cant move there")
        for (let i = 0; i < p.length; i++) 
          p[i].x--
      }
    }
    if (direction == "up") {
      p = rotatePiece(board, p)
    }

    if (direction === "down") {
      p = tryLowerPiece(board, p)
    }
  
    return p
  }

  function isOPiece(p) {
    const oPiece = (
         p[0].x == p[2].x 
      && p[1].x == p[3].x
      && p[0].y == p[1].y
    )
    return oPiece
  }
  
  // function returns newCoordinates if none of the new coordinates are out of bounds or in a occupied square
  function rotatePiece(board, p) {
    if (isOPiece(p)) return p
    let newCoordinates
    try {
      newCoordinates = calculateRotation(p)
      if (spaceIsOccupied(board, newCoordinates)) {
        console.log("can't rotate piece")
        return p
      } else {
        for (let i = 0; i < newCoordinates.length; i++) {
          if (i === 1) continue
          p[i].x = newCoordinates[i].x
          p[i].y = newCoordinates[i].y
        }
      }
    } catch {
      console.log("can't rotate piece")
    }
    return p
  }
  
  function calculateRotation(p) {
    const anchor = {
      x: p[1].x,
      y: p[1].y,
    }
    let newCoordinates = [{ x: 0, y: 0 }, { x: anchor.x, y: anchor.y }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    for (let i = 0; i < p.length; i++) {
      if (i === 1) continue
      let xDiff = p[i].x - anchor.x
      let yDiff = p[i].y - anchor.y
      let xIsNegative = Math.sign(xDiff) === -1
      let yIsNegative = Math.sign(yDiff) === -1
      if (xDiff === 0) {
        newCoordinates[i].x = yIsNegative ? anchor.x + Math.abs(yDiff) : anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y
      } else if (yDiff === 0) {
        newCoordinates[i].x = anchor.x
        newCoordinates[i].y = xIsNegative ? anchor.y - Math.abs(xDiff) : anchor.y + Math.abs(xDiff)
      } else if (xIsNegative && yIsNegative) {
        newCoordinates[i].x = anchor.x + Math.abs(yDiff)
        newCoordinates[i].y = anchor.y - Math.abs(xDiff)
      } else if (!xIsNegative && !yIsNegative) {
        newCoordinates[i].x = anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y + Math.abs(xDiff)
      } else if (xIsNegative && !yIsNegative) {
        newCoordinates[i].x = anchor.x - Math.abs(yDiff)
        newCoordinates[i].y = anchor.y - Math.abs(xDiff)
      } else if (!xIsNegative && yIsNegative) {
        newCoordinates[i].x = anchor.x + Math.abs(yDiff)
        newCoordinates[i].y = anchor.y + Math.abs(xDiff)
      }
    }
    return newCoordinates
  }
  
  function spaceIsOccupied(board, newCoordinates) {
    return newCoordinates.some(
         square => square.x < 0 
      || square.y < board[0].y
      || square.x > board[0].length - 1 
      || square.y > board.length - 1 
      || board[square.y][square.x].isOccupied
    )
  }
  
  function checkFullRowsAndEndCondition(board) {
    let rowsToReplace = [];
    for (let y = board.length - 1; y >= 0; y--) {
      let isFullRow = true
      for (let x = 0; x < board[y].length; x++) {
        if (!board[y][x].isOccupied) 
          isFullRow = false
        if (y === 0 && board[y][x].isOccupied) 
          return -1 // Return -1 to indicate game over
      }
      if (isFullRow) {
        rowsToReplace.push(y)
      }
    }
    replaceRows(board, rowsToReplace)      
    let scoreMultiplier = rowsToReplace.length
    return scoreMultiplier
  }
  
  function addFullRow(board) {
    const row = Array.from({ length: 10 }, (_, i) => new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(i, 0))
    return board.unshift(row)
  }
  
  function addScore(multiplier, level, score) {
    return score += multiplier === 1 ? 40 * level
      : multiplier === 2 ? 100 * level
      : multiplier === 3 ? 300 * level 
      : multiplier === 4 ? 1200 * level
      : 0
  }
  
  function incrementLevelAfter10Clears(trackRowCount, level) {
    if (trackRowCount >= 10) {
      trackRowCount = trackRowCount - 10
      level++
    }
    return { trackRowCount, level }
  }
  
  function replaceRows(board, rows) {
    if (rows.length) {
      let i = rows.length - 1
      while (i >= 0) {
        board.splice(rows[i], 1)
        addFullRow(board)
        i--
      }
    }
  }
  
  function createBoard() {
    return Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_3__.default.board.height }, (v, _) => {
      return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_3__.default.board.width }, (_, x) => {
        return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
      })
    })
  }

  function createTestBoard() {
    return Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_3__.default.board.height }, (v, _) => {
      if (_ < 20) {
        return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_3__.default.board.width }, (_, x) => {
          return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
        })
      } else {
        return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_3__.default.board.width }, (_, x) => {
          if (x < 9) {
            return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0, true)
          } else {
            return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
          }
        })
      }
    })
  }
  
  function moveToNextLevel(level) {
    console.log(`Moving to level ${level}`)
    return calculateFps(level)
  }
  
  function calculateFps(level) {
    return (1500 / (1.8 * level))
  }


  
  return {
    calculateFps,
    createBoard,
    createTestBoard,
    newPiece,
    newTestPiece,
    checkFullRowsAndEndCondition,
    incrementLevelAfter10Clears,
    moveToNextLevel,
    movePiece,
    rotatePiece,
    addScore,
    PieceStack
  }

  // return Tetris
})());

/***/ }),

/***/ "./src/js/Logic/Pieces.js":
/*!********************************!*\
  !*** ./src/js/Logic/Pieces.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lPiece": () => (/* binding */ lPiece),
/* harmony export */   "lPieceIsomer": () => (/* binding */ lPieceIsomer),
/* harmony export */   "sPiece": () => (/* binding */ sPiece),
/* harmony export */   "sPieceIsomer": () => (/* binding */ sPieceIsomer),
/* harmony export */   "iPiece": () => (/* binding */ iPiece),
/* harmony export */   "tPiece": () => (/* binding */ tPiece),
/* harmony export */   "oPiece": () => (/* binding */ oPiece)
/* harmony export */ });
/* harmony import */ var _Square_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Square.js */ "./src/js/Logic/Square.js");

;

class lPiece {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 2, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 2, true)
  ]
}

class lPieceIsomer {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 2, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(3, 2, true)
  ]
}

class sPiece {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 2, true)
  ]
}

class sPieceIsomer {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 2, true)
  ]
}

class iPiece {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 2, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 3, true)
  ]
}

class tPiece {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(3, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true)
  ]
}

class oPiece {
  PIECE = [
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 0, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(4, 1, true),
    new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(5, 1, true)
  ]
}



/***/ }),

/***/ "./src/js/Logic/Square.js":
/*!********************************!*\
  !*** ./src/js/Logic/Square.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Square)
/* harmony export */ });
class Square {
  "use strict"
  constructor(x, y, isOccupied = false) {
    this.x = x
    this.y = y
    this.isOccupied = isOccupied
  }

  isOccupied

  set isOccupied(value) {
    this.isOccupied = value
  }
  // perkele

  get isOccupied() {
    return this.isOccupied
  }
}

/***/ }),

/***/ "./src/js/Logic/Tetris.js":
/*!********************************!*\
  !*** ./src/js/Logic/Tetris.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Logic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logic.js */ "./src/js/Logic/Logic.js");
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");
/* harmony import */ var _MobileControls_MobileControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../MobileControls/MobileControls.js */ "./src/js/MobileControls/MobileControls.js");
/* harmony import */ var _Graphics_Graphics_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Graphics/Graphics.js */ "./src/js/Graphics/Graphics.js");
/* harmony import */ var _Highscores_Highscore_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Highscores/Highscore.js */ "./src/js/Highscores/Highscore.js");






const Graphics = (0,_Graphics_Graphics_js__WEBPACK_IMPORTED_MODULE_3__.default)(document)

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
    Graphics.resetUi(0)
    var timeOutID
    let pieceStack
    let firstStart = true

    let IHighscore = (0,_Highscores_Highscore_js__WEBPACK_IMPORTED_MODULE_4__.default)()    
    const highscoreEl = document.querySelector(".highscore-wrapper")
    let highscores = IHighscore.getHighscores()
    IHighscore.renderScores(highscoreEl, highscores)
    // IHighscore.checkForHighscore(highscoreEl, highscores, 3000)

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

      pieceStack = new _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.PieceStack()
      board = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.createBoard()
      piece = pieceStack.getPiece().PIECE
      score = _config_prod_js__WEBPACK_IMPORTED_MODULE_1__.default.startingScore
      level = _config_prod_js__WEBPACK_IMPORTED_MODULE_1__.default.startingLevel
      fps = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.calculateFps(level)
      trackRowCount = 0
      isPaused = false
      gameOver = false  
      currentLevel = level
      Graphics.displayPieceStack(pieceStack.getStack())
      Graphics.resetUi(level)
      Graphics.drawEverything(board, piece)
    }
    
    function tick(direction) {
      if (!isPaused && !gameOver) {
        frame(direction);
        ({ trackRowCount, level } = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.incrementLevelAfter10Clears(trackRowCount, level));
        if (currentLevel != level) {
          currentLevel = level
          fps = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.moveToNextLevel(level)
          Graphics.displayLevelText(level)
        }
        timeOutID = schedule()
      } else {
        window.clearTimeout(timeOutID)
        timeOutID = null
      }
    }

    function frame(direction) {
      piece = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.movePiece(board, piece, direction)
      if (piece == -1) {
        piece = pieceStack.getPiece().PIECE
        Graphics.displayPieceStack(pieceStack.getStack())
      }
      let scoreMultiplier = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.checkFullRowsAndEndCondition(board)
      if (scoreMultiplier === -1) {
        console.log("Game over")
        highscores = IHighscore.checkForHighscore(highscoreEl, highscores, score)
        Graphics.displayGameOver()
        Graphics.displayFinalScore(score)
        playButton.innerText = "Play"
        return gameOver = true
      }
      trackRowCount += scoreMultiplier
      score = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.addScore(scoreMultiplier, level, score);
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
      if (e.code == _config_prod_js__WEBPACK_IMPORTED_MODULE_1__.default.keys.pause) {
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

    const stateInfo = document.querySelector(".state-info")
    const tetrisContainer = document.querySelector(".tetris-container")
    const canvas = document.querySelector("#myCanvas")
    window.onload = () => {
      // tetrisContainer.style.height = canvas.clientHeight
      tetrisContainer.style.width = canvas.clientWidth + 6
      Graphics.drawBorders()
    }

    ;(0,_MobileControls_MobileControls_js__WEBPACK_IMPORTED_MODULE_2__.default)(frame)

    window.onresize = () => {
      tetrisContainer.style.width = canvas.clientWidth + 6
    }
  })()
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tetris);

/***/ }),

/***/ "./src/js/MobileControls/MobileControls.js":
/*!*************************************************!*\
  !*** ./src/js/MobileControls/MobileControls.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(handler) {
  "use strict"
  console.log("Injecting mobile controls")
  let controls = document.createElement("div")
  controls.className = "mobile-controls-wrapper"
  controls.innerHTML = `
    <div class="mobile-controls">
      <div class="js-rotate">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" class="svg-inline--fa fa-sync fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"></path></svg>
      </div>
      <div class="js-arrow-right">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
      </div>
      <div class="js-arrow-down">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" class="svg-inline--fa fa-arrow-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>
      </div>
      <div class="js-arrow-left">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>
      </div>
    </div>
  `

  document.body.appendChild(controls)

  const rotate = document.querySelector(".js-rotate")
  const arrowRight = document.querySelector(".js-arrow-right")
  const arrowDown = document.querySelector(".js-arrow-down")
  const arrowLeft = document.querySelector(".js-arrow-left")
  
  rotate.onclick = () => handler("up")
  arrowRight.onclick = () => handler("right")
  arrowDown.onclick = () => handler("down")
  arrowLeft.onclick = () => handler("left")
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Logic_Tetris_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logic/Tetris.js */ "./src/js/Logic/Tetris.js");


(0,_Logic_Tetris_js__WEBPACK_IMPORTED_MODULE_0__.default)(document) 
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************!*\
  !*** ./src/css/index.css ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;