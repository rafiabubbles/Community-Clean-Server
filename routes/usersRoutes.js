const express = require("express");
let User;

function init(userModel) {
  User = userModel;
}

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET user by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// POST create user
router.post("/", async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

module.exports = { router, init };
