const express = require("express")
const fetchUser = require("../../middleware/fetchUser")
const Laptop = require("../../Models/Electronics/Laptop")
const { body, validationResult } = require("express-validator")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded())
let success = false

//Add laptop to the list
router.post(
  "/addLaptop",
  fetchUser,
  [
    body("name", "Name should be minimim 5 characters").isLength({ min: 5 }),
    body("details", "Details should be minimum 5 characters").isLength({ min: 5 }),
    body("price", "Please enter price").custom(value => {
      if (value < 1) {
        throw new Error("Price should be more than 1")
      }
      if (isNaN(value)) {
        throw new Error("Price should be number")
      }
      return true
    }),
    body("count", "Please enter count").custom(value => {
      if (value < 1) {
        throw new Error("Count should me more than 0")
      }
      if (isNaN(value)) {
        throw new Error("Price should be number")
      }
      return true
    }),
    body("image", "Please enter valid URL").isURL()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() })
    }
    const { name, details, price, count, image } = req.body
    let laptop = await Laptop.findOne({ name, user: req.user.id })
    if (laptop) {
      success = false
      return res.status(400).json({ error: "This item already present in your store, instead update the count", success })
    } else {
      laptop = await Laptop.create({
        name,
        details,
        price,
        count,
        image,
        user: req.user.id
      })
      success = true
      return res.json({ success: "Succesfully added item", success })
    }
  }
)

//Remove the item from the list
router.delete("/removeLaptop/:id", fetchUser, async (req, res) => {
  //Authenticate the user by fetchUser middleware if user is genuine then only delete the item oe else send error
  let laptop = await Laptop.findById(req.params.id)
  if (laptop.user.toString() !== req.user.id) {
    success = false
    return res.status(400).json({ error: "You are not allowed to delete unauthorised item", success })
  } else {
    laptop = await Laptop.findByIdAndDelete(req.params.id)
    return res.json({ error: "Successfully deleted", success })
  }
})

//Update count of laptop
router.put(
  "/updateCount/:id",
  fetchUser,
  [
    body("count", "Please enter count").custom(value => {
      if (value < 1) {
        throw new Error("Count should me more than 0")
      }
      if (isNaN(value)) {
        throw new Error("Price should be number")
      }
      return true
    })
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    let newItem = { count: req.body.count }

    let laptop = await Laptop.findById(req.params.id)
    console.log(laptop)
    if (laptop.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      laptop = await Laptop.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated", laptop, success })
    }
  }
)

//update all details
router.put(
  "/updateItem/:id",
  fetchUser,
  [
    body("name", "Name should be minimim 5 characters").isLength({ min: 5 }),
    body("details", "Details should be minimum 5 characters").isLength({ min: 5 }),
    body("price", "Please enter price").custom(value => {
      if (value < 1) {
        throw new Error("Price should be more than 1")
      }
      if (isNaN(value)) {
        throw new Error("Price should be number")
      }
      return true
    }),
    body("count", "Please enter count").custom(value => {
      if (value < 1) {
        throw new Error("Count should me more than 0")
      }
      if (isNaN(value)) {
        throw new Error("Count should be number")
      }
      return true
    }),
    body("image", "Please enter valid URL").isURL()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, details, price, count, image } = req.body
    let newItem = {}
    if (name) {
      newItem.name = name
    }
    if (details) {
      newItem.details = details
    }
    if (price) {
      newItem.price = price
    }
    if (count) {
      newItem.count = count
    }
    if (name) {
      newItem.image = image
    }

    let laptop = await Laptop.findById(req.params.id)
    if (laptop.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      laptop = await Laptop.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated item", laptop, success })
    }
  }
)

module.exports = router
