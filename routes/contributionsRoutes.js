const express = require("express");
let Contribution;

function init(contributionModel) {
  Contribution = contributionModel;
}

const router = express.Router();

// GET contributions (optional: filter by issueId or email)
router.get("/", async (req, res) => {
  try {
    const { issueId, email } = req.query;
    const filter = {};
    if (issueId) filter.issueId = issueId;
    if (email) filter.email = email;

    const contributions = await Contribution.getAll(filter);
    res.json(contributions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contributions" });
  }
});

// POST contribution
router.post("/", async (req, res) => {
  try {
    const result = await Contribution.create(req.body);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create contribution" });
  }
});

module.exports = { router, init };
