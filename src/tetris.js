const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const blockSize = 35;
const borderLineWidth = 10;
const gridHeight = blockSize * 24;
const gridWidth = blockSize * 10;
const scoreBoardElement = document.getElementById("scoreboard");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("lvl");
const finalScoreElement = document.getElementById("finalScore");
const gameOverElement = document.getElementById("gOvr");
const ezButton = document.getElementById("ezButton");
const normButton = document.getElementById("normButton");
const gamePausedElement = document.getElementById("gamePaused");
const gameElem = document.querySelector(".game");
const themeSwitch = document.querySelector("#themeSwitch");
const hideControls = document.querySelector("#toggleControls")
const hideControlsArrow = document.querySelector(".hide-controls__arrow")
const gameControls = document.querySelector(".game-info__controls")

let isPolarized = document.body.classList.contains("polarized")
let borderColor = "black";
let squareColor1 = "white";
let squareColor2 = "black";

c.height = gridHeight + borderLineWidth * 2;
c.width = gridWidth + borderLineWidth * 2;

let defaultFps = 2;
let level;
let board;
let piece;
let isPaused = false;
let downIsPressed = false;
let isEz = false;
let gameOver = false;
let score = 0;
scoreElement.innerHTML = score;

window.onload = () => drawBorders();

// when trackRowCount >= 10, reset & increment level
let rowsToReplace = [];
let mainInterval;
let secondaryInterval;
let mainIntervalDivident = 1500;
function playGame() {
  if (mainInterval != null) { clearInterval(mainInterval); }
  if (secondaryInterval != null) { clearInterval(secondaryInterval); }
  score = 0;
  level = 1;
  let currentLevel = level;
  let calculateTimer = (mainIntervalDivident / (defaultFps * level));
  let mainIntervalTimer = calculateTimer;
  let secondaryIntervalTimer = 100;
  drawLevelText();
  createBoard();
  setPiece();
  //  use secondary interval to detect full rows and change main interval if level changes
  secondaryInterval = setInterval(function () {
    if (!isPaused) {
      checkFullRowsAndEndCondition();
      rowsToReplace = replaceRowsAndAddToScore(rowsToReplace);
      incrementLevelAfter10Clears();
      if (currentLevel != level) {
        moveToNextLevel();
        currentLevel = level;
      }
    }
    if (gameOver) {
      gameOverConditionReached();
    }
    downIsPressed = false;
  }, secondaryIntervalTimer);

  // Main interval to lower pieces
  mainInterval = setInterval(runLevel, mainIntervalTimer);
}