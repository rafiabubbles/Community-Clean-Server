
const express = require("express");

const router = express.Router();

let categoryCollection;

// Middleware to inject collection
router.use((req, res, next) => {
  if (!categoryCollection) {
    return res.status(500).json({ message: "Category collection not initialized" });
  }
  req.collection = categoryCollection;
  next();
});

// GET all category cards
router.get("/", async (req, res) => {
  try {
    const cards = await req.collection.find({}).sort({ _id: 1 }).toArray();
    res.json(cards);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    res.status(500).json({ message: "Failed to fetch category cards", error: err.message });
  }
});

// POST a new category card 
router.post("/", async (req, res) => {
  try {
    const card = req.body;
    card.createdAt = new Date();
    const result = await req.collection.insertOne(card);
    res.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("POST /api/categories error:", err);
    res.status(500).json({ message: "Failed to create category card", error: err.message });
  }
});

// Function to initialize collection
router.init = (collection) => {
  categoryCollection = collection;
};

module.exports = router;
