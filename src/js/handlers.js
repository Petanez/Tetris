export function keyPressHandler(e, isPaused, Graphics, Logic) {
  // if (gameOver) return
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
        Logic.movePiece("left")
        Graphics.drawEverything()
        break
      case "ArrowUp":
        // up key for rotating piece
        Logic.rotatePiece()
        Graphics.drawEverything()
        break
      case "ArrowRight":
        Logic.movePiece("right")
        Graphics.drawEverything()
        break
      case "ArrowDown":
        downIsPressed = true
        Logic.movePiece("down", piece.PIECE)
        Graphics.drawEverything()
        break
    }
}
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
  drawEverything()
}
// document.addEventListener('keydown', function (e) {
  //   if (gameOver) return
  //   if (isPaused && e.code != "KeyP") return
  
  //   switch (e.code) {
    //     case "KeyP":
    //       if (!isPaused) {
      //         console.log("Game paused")
      //         gamePausedElement.innerHTML = "Game paused"
      //         isPaused = true
      //       } else {
//         console.log("Game resumed")
//         gamePausedElement.innerHTML = ""
//         isPaused = false
//       }
//       break
//     case "ArrowLeft":
//       movePiece("left", piece.PIECE)
//       drawEverything()
//       break
//     case "ArrowUp":
//       // up key for rotating piece
//       rotatePiece(piece)
//       drawEverything()
//       break
//     case "ArrowRight":
//       movePiece("right", piece.PIECE)
//       drawEverything()
//       break
//     case "ArrowDown":
//       downIsPressed = true
//       movePiece("down", piece.PIECE)
//       drawEverything()
//       break
//   }
// })

// themeSwitch.onclick = () => {
//   if (document.body.classList.contains("polarized")) {
//     document.body.classList.remove("polarized")
//     squareColor1 = "white"
//     squareColor2 = "black"
//     borderColor = "black"
//     squareBorderColor = "black"
//   } else {
//     document.body.classList.add("polarized")
//     squareColor1 = "black"
//     squareColor2 = "white"
//     borderColor = "white"
//     squareBorderColor = "ghostwhite"
//   }
//   drawEverything()
// }

// // const normButton = document.getElementById("normButton")
// // normButton.onclick = function () {
// //   if (gameOverTextFinished) {
// //     if (levelOpacityInterval != null) 
// //       clearInterval(levelOpacityInterval) 
// //     if (gameOverInterval != null) 
// //       clearInterval(gameOverInterval)
// //     clearBoard()
// //     playGame()
// //   }
// // }