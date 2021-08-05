import express from "express"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT
const ip = process.env.TEST_SERVER_IP 

const app = express()
app.use(express.static("./dist"))
app.listen(PORT, ip, () => {
  console.log("Server listening on port " + PORT)
})

