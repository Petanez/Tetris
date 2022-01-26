export default {
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
}