const Farmer = require("../models/Farmer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyFirebaseToken } = require("../utils/firebaseAdmin");


// ================= REGISTER =================
exports.registerFarmer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new Farmer({
      name,
      email,
      password: hashedPassword,
    });

    await newFarmer.save();

    res.status(201).json({
      message: "Farmer registered successfully ✅",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ================= LOGIN =================
exports.loginFarmer = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    console.log("FARMER MODEL READY STATE:", Farmer.db.readyState);

    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(400).json({ message: "Invalid email ❌" });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: farmer
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    console.error("LOGIN STACK:", error.stack);
    res.status(500).json({ message: "Server Error ❌", error: error.message });
  }
};

// ================= PHONE LOGIN =================
exports.phoneLoginFarmer = async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({ message: "No token provided ❌" });
    }

    // 1. Verify token with Firebase Admin
    const decodedToken = await verifyFirebaseToken(firebaseToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: "Token does not contain phone number ❌" });
    }

    // 2. Check if user exists in MongoDB via phone
    const farmer = await Farmer.findOne({ phone });

    // 3. If not found, tell client to redirect to signup
    if (!farmer) {
      return res.status(404).json({
        message: "Phone number not registered. Please create an account first.",
        notRegistered: true,
        phone: phone,
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Phone login successful ✅",
      token,
      user: farmer,
    });
  } catch (error) {
    console.error("PHONE LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server Error ❌", error: error.message });
  }
};

// ================= PHONE REGISTER =================
exports.phoneRegisterFarmer = async (req, res) => {
  try {
    const { firebaseToken, name } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({ message: "No token provided ❌" });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required ❌" });
    }

    // 1. Verify token with Firebase Admin
    const decodedToken = await verifyFirebaseToken(firebaseToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: "Token does not contain phone number ❌" });
    }

    // 2. Check if phone already registered
    const existingFarmer = await Farmer.findOne({ phone });
    if (existingFarmer) {
      return res.status(400).json({
        message: "Phone number already registered. Please login instead.",
        alreadyRegistered: true,
      });
    }

    // 3. Create new user
    const newFarmer = new Farmer({
      name: name.trim(),
      phone: phone,
      authProvider: "phone",
    });
    await newFarmer.save();

    // 4. Generate JWT
    const token = jwt.sign(
      { id: newFarmer._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Phone registration successful ✅",
      token,
      user: newFarmer,
    });
  } catch (error) {
    console.error("PHONE REGISTER ERROR:", error.message);
    res.status(500).json({ message: "Server Error ❌", error: error.message });
  }
};