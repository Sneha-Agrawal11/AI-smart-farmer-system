const express = require("express");
const router = express.Router();

const { registerFarmer, loginFarmer, phoneLoginFarmer, phoneRegisterFarmer } = require("../controllers/farmerController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", registerFarmer);
router.post("/login", loginFarmer);
router.post("/phone-login", phoneLoginFarmer);
router.post("/phone-register", phoneRegisterFarmer);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected Route Accessed ✅",
    user: req.user,
  });
});

module.exports = router;