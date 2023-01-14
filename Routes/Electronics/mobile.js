const express = require("express")
const fetchUser = require("../../middleware/fetchUser")
const { body, validationResult } = require("express-validator")
const Mobile = require("../../Models/Electronics/Mobile")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded())
let success = false

//End point to add mobiles
router.post(
  "/addMobile",
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
    // console.log(req.body)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, details, price, count, image } = req.body
    //check this item is already present in this seller store if yes send error otherwise create the item
    let mobile = await Mobile.findOne({ name: name, user: req.user.id })
    if (mobile) {
      success = false
      return res.status(400).json({ Error: "This item already present in your store, instead please update the count of existing item", success })
    } else {
      mobile = await Mobile.create({
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
router.delete("/removeMobile/:id", fetchUser, async (req, res) => {
  //Authenticate the user by fetchUser middleware if user is genuine then only delete the item oe else send error
  let mobile = await Mobile.findById(req.params.id)
  if (mobile.user.toString() !== req.user.id) {
    success = false
    return res.status(400).json({ error: "You are not allowed to delete unauthorised item", success })
  } else {
    mobile = await Mobile.findByIdAndDelete(req.params.id)
    success = true
    return res.json({ error: "Successfully deleted", success })
  }
})

//Update count of mobile
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

    let mobile = await Mobile.findById(req.params.id)
    console.log(mobile)
    if (mobile.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      mobile = await Mobile.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated", mobile, success })
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
        throw new Error("Price should be number")
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

    let mobile = await Mobile.findById(req.params.id)
    if (mobile.user.toString() !== req.user.id) {
      success = false
      return res.status(400).json({ error: "You are not allowed to update unauthorized item", success })
    } else {
      mobile = await Mobile.findByIdAndUpdate(req.params.id, { $set: newItem }, { new: true })
      success = true
      return res.json({ success: "Successfully updated item", mobile, success })
    }
  }
)

module.exports = router
