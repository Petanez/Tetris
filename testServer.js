const PORT = 8080

const express = require("express")
const app = express()

app.use(express.static("./dist"))

app.listen(PORT, "192.168.1.33", () => {
  console.log("Server listening on port " + PORT)
})

