import Tetris from "./Tetris"

const normButton = document.getElementById("normButton")
let game = Tetris() 
let firstClick = true
normButton.onclick = () => {
  console.log(game)
  if (firstClick) {
    game.initGame()
    game.playGame()
    firstClick = false
  } else {
    game.initGame()
  }
} 
