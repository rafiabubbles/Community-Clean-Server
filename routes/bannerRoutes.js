import express from "express";
import Banner from "../models/Banner.js";

const router = express.Router();

// Get all banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error });
  }
});

export default router;
