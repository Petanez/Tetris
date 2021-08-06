import STORAGE_KEY from "./key.js"
import config from "../../config/prod.js"

class HighscoreNotFoundError extends Error {}

const HIGHSCORES_LENGTH = 10
const HIGHSCORE_EMPTY = {
  name: "",
  score: 0
}

function getHighscores(dbUrl) {
  let highscores
  if (dbUrl) {
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

function getHighscoresFromLocalStorage() {
  let highscores
  let key 
  for (let i = 0; key = window.localStorage.key(i); i++) {
    if (key == STORAGE_KEY)
      highscores = JSON.parse(window.localStorage.getItem(key))
  }
  if (!highscores) 
    throw new HighscoreNotFoundError(config.errorMsgs.highscoreNotFound)
  else 
    return highscores
}

function renderScores(element, scores) {
  while (element.firstChild) 
    element.firstChild.remove()
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
  renderScores(element, newScores)
  updateStorage(STORAGE_KEY, newScores)
  return newScores
}

async function checkForHighscore(element, highscores, score) {
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
  const input = document.createElement("input")
  for (let att of attributes) 
    input.setAttribute(att.name, att.value)
  return input
}

async function renderForm() {
  return new Promise((res, rej) => {
    const nameForm = document.createElement("form")
    nameForm.id = "highscoreForm"
    nameForm.className = "js-name-form" 
    
    const input = createInput([
      { name: "type", value: "text"},
      { name: "name", value: "name"},
      { name: "maxLength", value: "8"},
      { name: "placeholder", value: "Enter name (max 8 letter A-B)"}
    ])
    nameForm.appendChild(input)
    
    const submit = createInput([
      { name: "type", value: "submit" },
      { name: "value", value: "Submit" }
    ])
    nameForm.appendChild(submit)
    
    const pageWrapper = document.querySelector(".page-container")
    pageWrapper.appendChild(nameForm)
    
    nameForm.addEventListener("submit", (e) => {
      e.preventDefault()
      let name = e.target.name.value 
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
  if (str.length > 8) return false
  if (!(regEx.test(str))) return false
  return true
}

export default function() {
  return (function() {   
    return {
      checkForHighscore,
      getHighscores,
      renderScores
    }
  })()
}