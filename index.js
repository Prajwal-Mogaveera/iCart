const express = require("express")
const connectToMongo = require("./db")
const app = express()
const port = 4040

connectToMongo()

app.use("/api/user", require("./Routes/user"))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
