import STORAGE_KEY from "./key.js"
import config from "../../config/prod.js"

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
      highscores = Array.from({ length: 10 }, () => 0)
    } 
  }
  return highscores
}

function getHighscoresFromLocalStorage() {
  let highscores
  let key 
  for (let i = 0; key = window.localStorage.key(i); i++) {
    if (key == STORAGE_KEY)
      highscores = JSON.parse(window.localStorage.getItem(key))
  }
  if (!highscores) throw new HighscoreNotFoundError(config.errorMsgs.highscoreNotFound)
  else return highscores
}

function renderScores(element, scores) {
  while (element.firstChild) element.firstChild.remove()
  let highscoresEl = document.createElement("div")
  highscoresEl.className = "highscores"
  for (let score of scores) {
    highscoresEl.appendChild(createScoreElement(score))
  }
  element.appendChild(highscoresEl)
}

function createScoreElement(score) {
  let el = document.createElement("div")
  el.innerText = score || ""
  el.className = "highscores__score"
  return el
}

function updateStorage(key, scores) {
  window.localStorage.setItem(key, JSON.stringify(scores))
}

function updateScore(element, highscores, score, i) {
  let newHead = highscores.slice(0, i)
  let newTail = [score, ...highscores.slice(i, -1)]
  console.log(`highscores before update ${highscores}\ni ${i}\nnew head ${newHead}\nnew tail ${newTail}`)
  const newScores = [...newHead, ...newTail]
  renderScores(element, newScores)
  updateStorage(STORAGE_KEY, newScores)
  return newScores
}

function checkForHighscore(element, highscores, score) {
  let i = highscores.findIndex(highscore => highscore <= score)
  if (i != -1) {
    console.log("New highscore")
    return updateScore(element, highscores, score, i)
  } 
  return highscores
}

export default function() {
  return (function() {   
    return {
      updateScore,
      checkForHighscore,
      getHighscores,
      renderScores
    }
  })()
}