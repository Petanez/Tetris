import fs from "fs"
import path from "path"

import nodeCanvas from "node-canvas"
import jsdom from "jsdom"

import config from "../../src/config/prod.js"
import GraphicsModule from "../../src/js/Graphics/Graphics.js"

const { JSDOM } = jsdom
// import { expect } from "@jest/globals"

const TetrisHtml = fs.readFileSync(
  path.resolve("src/Tetris.html"),
  {encoding:'utf8', flag:'r'}
)
const { mocDoc } = (new JSDOM(TetrisHtml)).window
const Graphics = GraphicsModule(mocDoc)

describe("Initialization tests", () => {
  
  
  it("Should return html", () => {
    expect(true).toBe(true)
  })
})