const express = require("express");
const { ObjectId } = require("mongodb");

let Issue;

function init(issueModel) {
  Issue = issueModel;
}

const router = express.Router();

// GET all issues
router.get("/", async (req, res) => {
  try {
    const { limit, category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const issues = await Issue.getAll(filter, limit ? parseInt(limit) : 0);
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

// GET issue by ID
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.getById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch issue" });
  }
});

// POST new issue
router.pos("/", async (req, res) => {
  try {
    const result = await Issue.create(req.body);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create issue" });
  }
});

module.exports = { router, init };
