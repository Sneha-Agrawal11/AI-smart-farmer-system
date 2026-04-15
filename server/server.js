const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

async function startServer() {
  try {
    const PORT = process.env.PORT || 5000;

    // Connect to MongoDB FIRST before defining models/routes
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: true,
    });
    console.log("MongoDB Connected ✅");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected ⚠️");
    });

    const app = express();
    
    // Configure CORS to allow frontend requests
    app.use(cors({
      origin: [
        'http://localhost:3000', // Local development
        'http://localhost:5173', // Vite dev server
        'https://ai-smart-farmer-system.vercel.app', // Vercel production
        process.env.FRONTEND_URL || '' // Environment variable for flexibility
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());
    
    // Import routes AFTER DB connection
    const farmerRoutes = require("./routes/farmerRoutes");
    const farmRoutes = require("./routes/farmRoutes");
    const recommendRoutes = require("./routes/recommendRoutes");
    const chatRoutes = require("./routes/chatRoutes");
    
    app.use("/api/farmers", farmerRoutes);
    app.use("/api/farms", farmRoutes);
    app.use("/api/recommend", recommendRoutes);
    app.use("/api/chat", chatRoutes);
    
    app.get("/", (req, res) => {
      res.json({ message: "Smart Farmer Backend Running 🚀" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB Error ❌", err);
    process.exit(1);
  }
}

startServer();