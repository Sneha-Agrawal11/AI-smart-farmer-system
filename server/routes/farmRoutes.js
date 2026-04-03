const express = require("express");
const router = express.Router();

const { createFarmData, getMyFarms, updateFarm, deleteFarm, refreshFarm } = require("../controllers/farmController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, createFarmData);
router.get("/my-farms", verifyToken, getMyFarms);
router.put("/update/:id", verifyToken, updateFarm);
router.put("/refresh/:id", verifyToken, refreshFarm);
router.delete("/delete/:id", verifyToken, deleteFarm);

module.exports = router;