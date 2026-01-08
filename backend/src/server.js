import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import userRoutes from "./routes/user.routes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";




dotenv.config();

// Connexion DB
connectDB();

// Init app AVANT toute utilisation
const app = express();

// Middlewares globaux
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/favorites", favoriteRoutes);



// Route test (optionnelle mais utile)
app.get("/", (req, res) => {
  res.send("API MatchHome fonctionne 🚀");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
