"use strict"
import config from "../../config/prod.js"

class HighscoreNotFoundError extends Error {}

const HIGHSCORE_STORAGE_KEY = config.highscore.storageKey
const HIGHSCORE_INPUT_MAX_LENGTH = config.highscore.maxLength || 3
const HIGHSCORES_LENGTH = 10
const HIGHSCORE_EMPTY = {
  name: "",
  score: 0
}

const DB_URL = process.env.HIGHSCORE_DB_URL
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
    throw new HighscoreNotFoundError(config.errorMsg.highscoreNotFound)
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

export default {
  checkForHighscore,
  getHighscores,
  renderScores
}