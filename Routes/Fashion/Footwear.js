const express = require("express")
const fetchUser = require("../../middleware/fetchUser")
const { body, validationResult } = require("express-validator")
const Footwear = require("../../Models/Fashion/Footwear")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded())
let success = false

//Add footwear to the list
router.post(
  "/addFootwear",
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
    body("tag", "Please enter valid tag").isString(),
    body("size", "Please enter valid size").isString(),
    body("image", "Please enter valid URL").isURL()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() })
    }
    const { name, details, price, count, tag, size, image } = req.body
    let footwear = await Footwear.findOne({ name, user: req.user.id })
    if (footwear) {
      success = false
      return res.status(400).json({ error: "This item already present in your store, instead update the count", success })
    } else {
      footwear = await Footwear.create({
        name,
        details,
        price,
        count,
        image,
        tag,
        size,
        user: req.user.id
      })
      success = true
      return res.json({ success: "Succesfully added item", success })
    }
  }
)

//Remove item from the list
router.delete("/removeFootwear/:id", fetchUser, async (req, res) => {
  console.log(req.user.id)
  let footwear = await Footwear.findById(req.params.id)
  if (footwear.user.toString() !== req.user.id) {
    success = false
    return res.status(400).json({ error: "You are not allowed to modify unauthorised item", success })
  } else {
    footwear = await Footwear.findByIdAndRemove(req.params.id)
    success = true
    return res.json({ success: "Deleted item successfully", footwear, success })
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

    let footwear = await Footwear.findById(req.params.id)
    console.log(footwear)
    if (footwear.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      footwear = await Footwear.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated", footwear, success })
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
    body("tag", "Please enter valid tag").isString(),
    body("size", "Please enter valid size").isString(),
    body("image", "Please enter valid URL").isURL()
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, details, price, count, tag, size, image } = req.body
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
    if (tag) {
      newItem.tag = tag
    }
    if (size) {
      newItem.size = size
    }

    let footwear = await Footwear.findById(req.params.id)
    if (footwear.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      footwear = await Footwear.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated item", footwear, success })
    }
  }
)

module.exports = router
