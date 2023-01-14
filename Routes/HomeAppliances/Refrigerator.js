const express = require("express")
const fetchUser = require("../../middleware/fetchUser")
const { body, validationResult } = require("express-validator")
const Refrigerator = require("../../Models/Home Apliances/Refrigerator")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded())
let success = false

//Add Refrigerator to the list
router.post(
  "/addRefrigerator",
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
    let refrigerator = await Refrigerator.findOne({ name, user: req.user.id })
    if (refrigerator) {
      success = false
      return res.status(400).json({ error: "This item already present in your store, instead update the count", success })
    } else {
      refrigerator = await Refrigerator.create({
        name,
        details,
        price,
        count,
        image,

        user: req.user.id
      })
      success = true
      res.json({ success: "Succesfully added item", success })
    }
  }
)

//Remove item
router.delete("/removeRefrigerator/:id", fetchUser, async (req, res) => {
  let refrigerator = await Refrigerator.findById(req.params.id)
  if (refrigerator.user.toString() !== req.user.id) {
    success = false
    return res.status(400).json({ error: "You are not allowed to delete unauthorized item", success })
  } else {
    refrigerator = await Refrigerator.findByIdAndDelete(req.params.id)
    success = true
    return res.status(200).json({ success: "Succesfully deleted", refrigerator, success })
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

    let refrigerator = await Refrigerator.findById(req.params.id)
    console.log(refrigerator)
    if (refrigerator.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      refrigerator = await Refrigerator.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated", refrigerator, success })
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

    let refrigerator = await Refrigerator.findById(req.params.id)
    if (refrigerator.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      refrigerator = await Refrigerator.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated item", refrigerator, success })
    }
  }
)

module.exports = router
