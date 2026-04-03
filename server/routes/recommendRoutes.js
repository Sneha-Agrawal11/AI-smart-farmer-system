const express = require("express");
const router = express.Router();
const { recommendCrop } = require("../controllers/recommendController");

// POST /api/recommend-crop - Get crop recommendations (public endpoint)
router.post("/recommend-crop", recommendCrop);

module.exports = router;

