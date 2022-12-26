const jwt = require("jsonwebtoken")
const JWT_Sec = "SammuIsGoodGirl"

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token")
  console.log(token)
  try {
    if (!token) {
      console.log(token)
      return res.status(400).json({ error: "Invalid credential" })
    } else {
      const data = jwt.verify(token, JWT_Sec)

      req.user = data.user
      console.log(data)
      next()
    }
  } catch (e) {
    return res.status(400).json({ error: "Internal error" })
  }
}
module.exports = fetchUser
