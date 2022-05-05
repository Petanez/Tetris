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
  initial: {
    level: 1,
    score: 0
  },
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
    width: 10,
    borderWidth: 0
  },
  keys: {
    pause: "KeyP"
  },
  errorMsg: {
    highscoreNotFound: "Highscore not found"
  },
  highscore: {
    maxLength: 8,
    storageKey: "tetris.highscore",
    dbUrl: ""
  },
  pieceStack: {
    firstPiece: {
      animationTime: 140
    }
  },
  polarized: {
    storageKey: "tetris.polarized"
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

;

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(document) {
  const root = document.documentElement
  root.style.setProperty("--thickness-canvas-border", _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.borderWidth + "px")
  root.style.setProperty("--time-first-piece-animation", _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.pieceStack.firstPiece.animationTime + "ms")

  const rowRemovalAnimationTime = 700;
  const c = document?.querySelector("#myCanvas")
  const squareSize = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.size
  const gridHeight = squareSize * _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height
  const gridWidth = squareSize * _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.width
  const primaryColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
  const secondaryColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
  const boardWidth = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.width
  const boardHeight = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height


  const ctx = c.getContext("2d")
  c.height = gridHeight
  c.width = gridWidth
        
  const scoreElement = document.getElementById("score")
  const finalScoreElement = document.getElementById("finalScore")
  const levelElement = document.getElementById("lvl")
  const gameOverElement = document.getElementById("gOvr")
  const gamePausedElement = document.getElementById("gamePaused")
  const pieceStackEl = document.querySelector(".state-info__piece-stack")
  
  let squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
  let isPolarized = JSON.parse(localStorage.getItem(_config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.polarized.storageKey)) || false
  if (isPolarized) document.body.classList.add("polarized")
  
  
  function polarizeHandler(element, board, piece) {
    console.log("handling polarization")
    if (element.classList.contains("polarized")) {
      squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.secondaryColor
      isPolarized = false
      JSON.stringify(localStorage.setItem(_config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.polarized.storageKey, JSON.stringify(false)))
    } else {
      squareBorderColor = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.square.primaryColor
      isPolarized = true
      JSON.stringify(localStorage.setItem(_config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.polarized.storageKey, JSON.stringify(true)))
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
      }, _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.pieceStack.firstPiece.animationTime)
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
    let opacity = `${((y / 2) / _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height)}`
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
      ctx.strokeStyle = `rgba(${rgb},${rgb},${rgb},${y*(y/_config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.board.height)})`
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
      c.style.filter = "blur(0em)"
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")
      gamePausedElement.innerText = ""
      stackFirstPiece.style.animation = "var(--animation-first-piece)"
    } else {
      c.style.filter = "blur(.5em)"
      const stackFirstPiece = document.querySelector(".state-info__piece-stack > *:first-child")
      gamePausedElement.innerText = "PAUSED"
      stackFirstPiece.style.animation = "none"
    }
  }
  
  function resetUi(level) {
    displayLevelText(level)
    c.style.filter = "blur(0em)"
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



/***/ }),

/***/ "./src/js/Highscores/Highscore.js":
/*!****************************************!*\
  !*** ./src/js/Highscores/Highscore.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");

;

class HighscoreNotFoundError extends Error {}

const HIGHSCORE_STORAGE_KEY = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.highscore.storageKey
const HIGHSCORE_INPUT_MAX_LENGTH = _config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.highscore.maxLength || 3
const HIGHSCORES_LENGTH = 10
const HIGHSCORE_EMPTY = {
  name: "",
  score: 0
}

const DB_URL = ""
let highscores

function getHighscores() {
  if (highscores) return highscores
  if (DB_URL) {
    // Get highscores from a db
  } else {
    try {
      highscores = getHighscoresFromLocalStorage()
    } catch (e) {
      console.log(e)
      highscores = Array.from({ length: HIGHSCORES_LENGTH }, () => { return { ...HIGHSCORE_EMPTY } } )
    } 
  }
  return highscores
}

function setHighscores(scores) {
  highscores = scores
  if (DB_URL) updateDatabase(scores)
  else updateStorage(scores)
}

function getHighscoresFromLocalStorage() {
  let highscores
  let key 
  for (let i = 0; key = window.localStorage.key(i); i++) {
    if (key == HIGHSCORE_STORAGE_KEY)
      highscores = JSON.parse(window.localStorage.getItem(key))
  }
  if (!highscores) 
    throw new HighscoreNotFoundError(_config_prod_js__WEBPACK_IMPORTED_MODULE_0__.default.errorMsg.highscoreNotFound)
  else 
    return highscores
}

function renderScores(element) {
  console.log("Rendering highscores")
  while (element.firstChild) 
    element.firstChild.remove()
  let highscoresEl = document.createElement("div")
  highscoresEl.className = "highscores"
  for (let highscore of getHighscores()) 
    highscoresEl.appendChild(createScoreElement(highscore.name, highscore.score))
  element.appendChild(highscoresEl)
}

function createScoreElement(name, score) {
  let el = document.createElement("div")
  el.className = "highscores__score"
  
  let nameEl = document.createElement("span")
  nameEl.innerText = name || ""
  el.appendChild(nameEl)

  let scoreEl = document.createElement("span")
  scoreEl.innerText = score || ""
  el.appendChild(scoreEl)

  return el
}

function updateStorage(scores) {
  window.localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(scores))
}

function updateDatabase(scores) {
  console.log("updating db")
}

function updateScore(element, highscore, i) {
  let newHead = highscores.slice(0, i)
  let newTail = [
    {
      name: highscore.name,
      score: highscore.score
    }, 
    ...highscores.slice(i, -1)
  ]
  const newScores = [...newHead, ...newTail]
  setHighscores(newScores)
  renderScores(element)
  return newScores
}

async function checkForHighscore(element, score, error) {
  let i = highscores.findIndex(highscore => highscore.score < score)
  if (i != -1) {
    console.log("New highscore")
    const playerName = await renderNewHighscoreForm(error)
    const highscore = { 
      name: playerName,
      score
    }
    return updateScore(element, highscore, i)
  } 
  return highscores
}

function createInput(attributes = []) {
  const input = document.createElement("input")
  for (let att of attributes) 
    input.setAttribute(att.name, att.value)
  return input
}

async function renderNewHighscoreForm(error) {
  return new Promise((res, rej) => {
    const nameForm = document.createElement("form")
    nameForm.id = "highscoreForm"
    nameForm.className = "js-name-form" 
    
    const input = createInput([
      { name: "type", value: "text"},
      { name: "name", value: "name"},
      { name: "maxLength", value: HIGHSCORE_INPUT_MAX_LENGTH },
      { name: "placeholder", value: error?.message || `Enter name (max ${HIGHSCORE_INPUT_MAX_LENGTH} letter A-B)`}
    ])
    nameForm.appendChild(input)
    
    const submit = createInput([
      { name: "type", value: "submit" },
      { name: "value", value: "Submit" }
    ])
    nameForm.appendChild(submit)
    
    const pageWrapper = document.querySelector(".page-container")
    pageWrapper.appendChild(nameForm)
    
    nameForm.addEventListener("submit", e => {
      e.preventDefault()
      let name = e.target.name.value 
      if (!isValidInput(name)) {
        e.target.remove()
        rej(new Error("Letters only A-Z"))
      }
      e.target.remove()
      res(name)
    })
  })
}

function isValidInput(str) {
  const regEx = /^[a-zA-z]+$/gi
  if (str.length > HIGHSCORE_INPUT_MAX_LENGTH) return false
  if (!(regEx.test(str))) return false
  return true
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  checkForHighscore,
  getHighscores,
  renderScores
});

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
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");

;



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function() {
  const newPiece = () => {
    return randomPiece()
  }

  const newTestPiece = () => {
    return new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.iPiece()
  }
  
  const lockPiece = (board, p) => {
    p.every(val => {
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
      stack.push(newPiece())
      return stack.shift()
    }
  }
  
  function randomPiece() {
    const nPieces = 7
    const randomNum = Math.floor(Math.random() * nPieces)
    return (
        randomNum === 0 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.lPiece() 
      : randomNum === 1 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.oPiece() 
      : randomNum === 2 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.tPiece() 
      : randomNum === 3 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.lPieceIsomer() 
      : randomNum === 4 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.sPiece() 
      : randomNum === 5 ? new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.sPieceIsomer() 
      : new _Pieces_js__WEBPACK_IMPORTED_MODULE_1__.iPiece()
    )
  }

  function getBoardTopography(board) {
    return board.reduce((acc, c, i) => {
      c.forEach((n, j) => { 
        if (n.isOccupied && i < acc[j]) {
          acc[j] = i
        }
      })
      return acc
    }, Array.from({ length: board[0].length }, () => {
      return board.length
    }))
  }

  function getPieceTopography(piece) {
    //////////////////////////////////////////////////
    // get piece topography
    // as of this state works with none rotations
    let pieceTop = piece.reduce((acc, c, i) => {
      let objI = acc.findIndex(obj => obj.x == c.x)
      if (objI == -1)
        acc.push({x: c.x, y: c.y})
      else if (acc[objI].y < c.y)
        acc[objI].y = c.y
      return acc 
    }, [])
    console.log("pieceTop", pieceTop)
    
  }

  function getTarget(board, piece) {
    // store required steps to get to target
    let targetSteps = {
      rotations: 0, // later
      movesX: 0,
      direction: "left"
    };
    // get topography of board
    let boardTop = getBoardTopography(board); 

    //////////////////////////////////////////////////
    // compare the piece with the board topography
    // if board "floor" is flat, find rotations to get the piece as low as possible
    // with no room below the piece
    
    // Find highest and lowest differences between square distances
    let differences = piece.reduce((acc, c, _) => {
      if (!acc.x.includes(c.x))
        acc.x.push(c.x)
      if (!acc.y.includes(c.y))
        acc.y.push(c.y)
      return acc
    }, {x: [], y: []})
    let xDiff = differences.x
    let yDiff = differences.y
    let rotations = 0
    // if ()
  }
  
  function tryLowerPiece(board, p) {
    // return -1 if piece gets locked
    if (p.every(square => square.y < board.length - 1)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y++
    } else {
      lockPiece(board, p)
      return []
    }
    // if the new x, y has an occupied square return to previous x, y
    if (p.some(square => board[square.y][square.x].isOccupied)) {
      for (let i = 0; i < p.length; i++) 
        p[i].y--
      lockPiece(board, p)
      return []
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
      newCoordinates = rotate(p)
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
  
  function rotate(p) {
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
  
  function checkFullRows(board) {
    let rowsToReplace = [];
    for (let y = board.length - 1; y >= 0; y--) {
      let isFullRow = true
      for (let x = 0; x < board[y].length; x++)
        if (!board[y][x].isOccupied) 
          isFullRow = false
      if (isFullRow) 
        rowsToReplace.push(y)
    }
    if (rowsToReplace.length)
      replaceRows(board, rowsToReplace)      
    return rowsToReplace

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
    let i = rows.length - 1
    while (i >= 0) {
      board.splice(rows[i], 1)
      addFullRow(board)
      i--
    }
  }
  
  function createBoard() {
    return Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.height }, (v, _) => {
      return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.width }, (_, x) => {
        return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
      })
    })
  }

  function createTestBoard(n) {
    return Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.height }, (v, _) => {
      if (_ < n) {
        return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.width }, (_, x) => {
          return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
        })
      } else {
        return v = Array.from({ length: _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.width }, (_, x) => {
          if (x < 9) {
            return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0, true)
          } else {
            return new _Square_js__WEBPACK_IMPORTED_MODULE_0__.default(x, 0)
          }
        })
      }
    })
  }
  
  function moveToLevel(level) {
    console.log(`Moving to level ${level}`)
    return calculateFps(level)
  }
  
  function calculateFps(level) {
    return (1600 / (1.8 * level))
  }

  return {
    calculateFps,
    createBoard,
    createTestBoard,
    newPiece,
    newTestPiece,
    lockPiece,
    randomPiece,
    isOPiece,
    spaceIsOccupied,
    checkFullRows,
    incrementLevelAfter10Clears,
    moveToLevel,
    tryLowerPiece,
    movePiece,
    rotatePiece,
    addScore,
    getTarget,
    PieceStack
  }
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
  constructor(x, y, isOccupied = false) {
    this.x = x
    this.y = y
    this.isOccupied = isOccupied
  }

  isOccupied

  set isOccupied(value) {
    this.isOccupied = value
  }

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
/* harmony export */   "default": () => (/* binding */ Tetris)
/* harmony export */ });
/* harmony import */ var _Logic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logic.js */ "./src/js/Logic/Logic.js");
/* harmony import */ var _Graphics_Graphics_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Graphics/Graphics.js */ "./src/js/Graphics/Graphics.js");
/* harmony import */ var _config_prod_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/prod.js */ "./src/config/prod.js");
/* harmony import */ var _MobileControls_MobileControls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../MobileControls/MobileControls.js */ "./src/js/MobileControls/MobileControls.js");
/* harmony import */ var _Highscores_Highscore_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Highscores/Highscore.js */ "./src/js/Highscores/Highscore.js");

;





function Tetris(document, ai) {
  const Graphics = (0,_Graphics_Graphics_js__WEBPACK_IMPORTED_MODULE_1__.default)(document)
  Graphics.resetUi(0)

  // Mobile controls
  ;(0,_MobileControls_MobileControls_js__WEBPACK_IMPORTED_MODULE_3__.default)(document, frame)

  // Highscores
  const highscoreWrapper = document.querySelector(".highscore-wrapper")
  _Highscores_Highscore_js__WEBPACK_IMPORTED_MODULE_4__.default.renderScores(highscoreWrapper)

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

    pieceStack = new _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.PieceStack()
    board = debug ? _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.createTestBoard(10) : _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.createBoard()
    piece = debug ? _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.newTestPiece().PIECE : pieceStack.getPiece().PIECE
    score = _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.initial.score
    level = _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.initial.level
    fps = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.calculateFps(level)
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
        piece = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.movePiece(board, piece, direction)
      }
    }
    else
      piece = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.movePiece(board, piece, direction)
    if (!piece.length) {
      piece = pieceStack.getPiece().PIECE
      Graphics.animateFirstPiece()
      Graphics.displayPieceStack(pieceStack.getStack())
      if (_Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.spaceIsOccupied(board, piece)) 
        handleGameOver()
    }
    let rowsToReplace = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.checkFullRows(board)
    if (rowsToReplace.length)
      Graphics.rowRemovalAnimations(rowsToReplace)
    let scoreMultiplier = rowsToReplace.length
    trackRowCount += scoreMultiplier
    score = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.addScore(scoreMultiplier, level, score);
    Graphics.updateScore(score);
    Graphics.drawEverything(board, piece);

    ({ trackRowCount, level } = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.incrementLevelAfter10Clears(trackRowCount, level));
    if (currentLevel != level) {
      currentLevel = level
      fps = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.moveToLevel(level)
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
      target = _Logic_js__WEBPACK_IMPORTED_MODULE_0__.default.getTarget(board, piece)

    }
    if (!isPaused) aiSchedule()
  }

    /*
  Get piece topography

  (S-PIECE TOPOGRAPHY)
  0: {x: 0, y: 0}
  1: {x: 1, y: 1}
  2: {x: 2, y: 0}

  (BOARD TOPOGRAPHY)
  (10) [24, 24, 23, 22, 23, 24, 24, 24, 24, 24]
  
  Find topography distance differences from graph

  Find the closest to optimal topography difference

  Next 
    -> Find necessary amount of rotations
    -> Find required moves in x direction
  */

  function aiSchedule() {
    return window.setTimeout(aiTick, 400)
  }

  function playGame(ai) {
    console.log("Game started")
    return timeOutID = ai ? aiSchedule() : schedule();
  }
  
  async function handleGameOver(error = "") {
    console.log("Game over")
    gameOver = true
    Graphics.displayGameOver()
    Graphics.displayFinalScore(score)
    Graphics.removePieceStack()
    playButton.innerText = "Play"
    highscoreWrapper.classList.add("game-over")
    await _Highscores_Highscore_js__WEBPACK_IMPORTED_MODULE_4__.default.checkForHighscore(highscoreWrapper, score, error)
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
    if (e.code == _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.keys.pause) {
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
    tetrisContainer.style.width = `${canvas.clientWidth + _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.borderWidth * 2}px`
  }
  window.onresize = () => {
    tetrisContainer.style.width = `${canvas.clientWidth + _config_prod_js__WEBPACK_IMPORTED_MODULE_2__.default.board.borderWidth * 2}px`
  }
}

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

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(document, handler) {
  const ROTATE_BTN = "js-rotate"
  const KEY_RIGHT = "js-arrow-right"
  const KEY_DOWN = "js-arrow-down"
  const KEY_LEFT = "js-arrow-left"

  console.log("Rendering mobile controls")
  let controls = document.createElement("div")
  controls.className = "mobile-controls-wrapper"
  controls.innerHTML = `
    <div class="mobile-controls">
      <div class="${ROTATE_BTN}">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" class="svg-inline--fa fa-sync fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"></path></svg>
      </div>
      <div class="${KEY_RIGHT}">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
      </div>
      <div class="${KEY_DOWN}">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" class="svg-inline--fa fa-arrow-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>
      </div>
      <div class="${KEY_LEFT}">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>
      </div>
    </div>
  `
  document.body.appendChild(controls)

  const rotate = document.querySelector(`.${ROTATE_BTN}`)
  const arrowRight = document.querySelector(`.${KEY_RIGHT}`)
  const arrowDown = document.querySelector(`.${KEY_DOWN}`)
  const arrowLeft = document.querySelector(`.${KEY_LEFT}`)

  rotate.addEventListener("touchstart", () => touchStart("up", 400))
  arrowRight.addEventListener("touchstart", () => touchStart("right", 200))
  arrowDown.addEventListener("touchstart", () => touchStart("down", 100))
  arrowLeft.addEventListener("touchstart", () => touchStart("left", 400))

  rotate.addEventListener("touchend", touchEnd)
  arrowRight.addEventListener("touchend", touchEnd)
  arrowDown.addEventListener("touchend", touchEnd)
  arrowLeft.addEventListener("touchend", touchEnd)
  
  var timer
  function onLongTouch(direction, duration) {
    touchStart(direction, duration)
  }

  function touchStart(direction, duration = 100) {
    handler(direction)
    timer = setTimeout(() => { 
      onLongTouch(direction, duration)
    }, duration) 
  }

  function touchEnd() {
    if (timer)
      clearTimeout(timer)
  }
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


(0,_Logic_Tetris_js__WEBPACK_IMPORTED_MODULE_0__.default)(document, true) 
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