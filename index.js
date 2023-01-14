const express = require("express")
const connectToMongo = require("./db")
const app = express()
const port = 4040

connectToMongo()

app.use("/api/user", require("./Routes/user"))
app.use("/api/electronics/mobile", require("./Routes/Electronics/mobile"))
app.use("/api/electronics/laptop", require("./Routes/Electronics/laptop"))
app.use("/api/electronics/desktop", require("./Routes/Electronics/desktop"))
app.use("/api/fashion/shirt", require("./Routes/Fashion/Shirt"))
app.use("/api/fashion/pant", require("./Routes/Fashion/Pant"))
app.use("/api/fashion/footwear", require("./Routes/Fashion/Footwear"))
app.use("/api/homeappliances/refrigerator", require("./Routes/HomeAppliances/Refrigerator"))
app.use("/api/homeappliances/tv", require("./Routes/HomeAppliances/TV"))
app.use("/api/homeappliances/washingMachine", require("./Routes/HomeAppliances/WashingMachine"))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
