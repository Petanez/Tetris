const ezButton = document.getElementById("ezButton")
const normButton = document.getElementById("normButton")
const themeSwitch = document.querySelector("#themeSwitch")
const hideControls = document.querySelector("#toggleControls")
const hideControlsArrow = document.querySelector(".hide-controls__arrow")
const gameControls = document.querySelector(".game-info__controls")

document.addEventListener('keydown', function (e) {
  if (gameOver) return
  if (isPaused && e.code != "KeyP") return

  switch (e.code) {
    case "KeyP":
      if (!isPaused) {
        console.log("Game paused")
        gamePausedElement.innerHTML = "Game paused"
        isPaused = true
      } else {
        console.log("Game resumed")
        gamePausedElement.innerHTML = ""
        isPaused = false
      }
      break
    case "ArrowLeft":
      movePiece("left", piece.PIECE)
      drawEverything()
      break
    case "ArrowUp":
      // up key for rotating piece
      rotatePiece(piece)
      drawEverything()
      break
    case "ArrowRight":
      movePiece("right", piece.PIECE)
      drawEverything()
      break
    case "ArrowDown":
      downIsPressed = true
      movePiece("down", piece.PIECE)
      drawEverything()
      break
  }
})

// hideControls.onclick = () => {
//   let isClicked = hideControls.getAttribute("data-clicked") == "true"
//   console.log(isClicked)
//   if (isClicked) {
//     gameControls.classList.add("hidden")
//     hideControlsArrow.classList.add("upside-down")

//   } else {
//     gameControls.classList.remove("hidden")
//     hideControlsArrow.classList.remove("upside-down")
//   }
//   hideControls.dataset.clicked = !isClicked
// }


themeSwitch.onclick = () => {
  if (document.body.classList.contains("polarized")) {
    document.body.classList.remove("polarized")
    squareColor1 = "white"
    squareColor2 = "black"
    borderColor = "black"
    squareBorderColor = "black"
  } else {
    document.body.classList.add("polarized")
    squareColor1 = "black"
    squareColor2 = "white"
    borderColor = "white"
    squareBorderColor = "ghostwhite"
  }
  let el = document.createElement("div")
  el.classList = "cover"
  el.style.cssText = "position: absolute"
  document.querySelector(".page-container").appendChild(el)
  setTimeout(() => {
    el.remove()
    console.log("removing")
  }, 1000)
  drawEverything()
}

normButton.onclick = function () {
  if (gameOverTextFinished) {
    if (levelOpacityInterval != null) 
      clearInterval(levelOpacityInterval) 
    if (gameOverInterval != null) 
      clearInterval(gameOverInterval)
    clearBoard()
    restartGame()
  }
}