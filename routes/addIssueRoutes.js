// routes/addIssueRoutes.js
const express = require("express");

let addIssueCollection;

function init(collection) {
  addIssueCollection = collection;
}

const router = express.Router();

// GET all addIssues
router.get("/", async (req, res) => {
  try {
    const issues = await addIssueCollection.find().sort({ date: -1 }).toArray();
    res.json(issues);
  } catch (err) {
    console.error("GET /api/add-issue error:", err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// POST new addIssue
router.post("/", async (req, res) => {
  try {
    const issue = req.body;
    issue.status = "ongoing";
    issue.date = new Date();

    const result = await addIssueCollection.insertOne(issue);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("POST /api/add-issue error:", err);
    res.status(500).json({ message: "Failed to create issue" });
  }
});

module.exports = { router, init };
