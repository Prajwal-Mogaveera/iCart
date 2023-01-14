const express = require("express")
const fetchUser = require("../../middleware/fetchUser")
const { body, validationResult } = require("express-validator")
const TV = require("../../Models/Home Apliances/TV")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded())
let success = false

//Add TV to the list
router.post(
  "/addTV",
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
    let tv = await TV.findOne({ name, user: req.user.id })
    if (tv) {
      success = false
      return res.status(400).json({ error: "This item already present in your store, instead update the count", success })
    } else {
      tv = await TV.create({
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

//Remove item
router.delete("/removeTV/:id", fetchUser, async (req, res) => {
  let tv = await TV.findById(req.params.id)
  if (tv.user.toString() !== req.user.id) {
    success = false
    return res.status(400).json({ error: "You are not allowed to delete unauthorized item", success })
  } else {
    tv = await TV.findByIdAndDelete(req.params.id)
    success = true
    return res.status(200).json({ success: "Succesfully deleted", tv, success })
  }
})

//Update count of Shirt
router.put(
  "/updateCount/:id",
  fetchUser,
  [
    body("count", "Please enter count").custom(value => {
      if (value < 1) {
        throw new Error("Count should me more than 0")
      }
      if (isNaN(value)) {
        throw new Error("Count should be number")
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

    let tv = await TV.findById(req.params.id)
    console.log(tv)
    if (tv.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      tv = await TV.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated", tv, success })
    }
  }
)

//Update all details

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
    if (image) {
      newItem.image = image
    }

    let tv = await TV.findById(req.params.id)
    if (tv.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      tv = await TV.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated item", tv, success })
    }
  }
)

module.exports = router
