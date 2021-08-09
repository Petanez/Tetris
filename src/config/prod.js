export default {
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
    width: 10,
    borderWidth: 3
  },
  keys: {
    pause: "KeyP"
  },
  errorMsgs: {
    highscoreNotFound: "Highscore not found"
  },
  highscore: {
    maxLength: 8,
    storageKey: "tetris.highscores"
  },
  pieceStack: {
    firstPiece: {
      animationTime: 140
    }
  }
}