const express = require("express")
const User = require("../Models/User")

const router = express.Router()
const { body, validationResult } = require("express-validator")
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const JWT_Sec = "SammuIsGoodGirl"

router.use(express.json())
router.use(express.urlencoded())

//Creating end point to create new user
router.post("/createUser", [body("name", "Name should be atleast 3 characters").isLength({ min: 3 }), body("email", "Enter valid email").isEmail(), body("password", "Password should be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
  //using express validation to validate the input and send the error if any
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  //if no error in validation
  try {
    //checking whether euser already exists by email
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: "User with this email already exists" })
    }
    //if user doesn't exist then create hash password to secure the password
    const salt = await bcrypt.genSalt(10)
    const secPass = bcrypt.hashSync(req.body.password, salt)

    //after creating hash of password create user in database
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    })

    //after creating user create authToken and send as response inorder to authenticate user for future request
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_Sec)

    return res.json(authToken)
  } catch (e) {
    res.status(400).json({ error: "Internal error" })
    console.log(e)
  }
})

//Login end point for logging in user
router.post("/login", [body("email", "Please enter valid email").isEmail(), body("password", "Password must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { email, password } = req.body
    let user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ error: "Please enter valid credentials" })
    } else {
      let compPass = await bcrypt.compare(password, user.password)
      if (!compPass) {
        return res.status(400).json({ error: "Please enter valid credentials" })
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_Sec)

      return res.send(authToken)
    }
  } catch (e) {
    res.status(400).json({ error: "Internal error" })
    console.log(e)
  }
})

module.exports = router
