const jwt = require("jsonwebtoken")
const JWT_Sec = "SammuIsGoodGirl"

//middleware function for verifying user through auth-token and provide user id if user is genuine

const fetchUser = (req, res, next) => {
  //store auth token from header
  const token = req.header("auth-token")
  console.log(token)
  try {
    //if token is blank then send error
    if (!token) {
      console.log(token)
      return res.status(400).json({ error: "Invalid credential" })
    } else {
      //verify token with JWT_Sec ,if user is verified then store user details example: { user: { id: '63a99cc7fbb0f37416f3997a' }, iat: 1672062745 }
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
