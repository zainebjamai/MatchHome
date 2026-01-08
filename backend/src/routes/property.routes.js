import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,

  // 🔥 NOUVELLES FONCTIONS
  getPropertiesByCategory,
  getPropertiesByCity,
  searchProperties,
  getDashboardProperties,
} from "../controllers/property.controller.js";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* ➕ Ajouter une propriété (USER CONNECTÉ + PHOTOS) */
router.post(
  "/",
  protect,
  upload.array("images", 7),
  createProperty
);

/* 📄 Toutes les propriétés (PUBLIC) */
router.get("/", getAllProperties);

/* 🏠 DASHBOARD (PUBLIC - avec images + user) */
router.get("/dashboard", getDashboardProperties);

/* 🔎 RECHERCHE (ville, catégorie, mot-clé) */
router.get("/search", searchProperties);

/* 📂 Par catégorie (villa / appartement / riad) */
router.get("/category/:category", getPropertiesByCategory);

/* 🌍 Par ville */
router.get("/city/:city", getPropertiesByCity);

/* 👤 Mes propriétés (USER CONNECTÉ) */
router.get("/me", protect, getMyProperties);

/* 🔍 Une propriété par ID */
router.get("/:id", getPropertyById);

/* ✏️ Modifier une propriété (USER CONNECTÉ) */
router.put(
  "/:id",
  protect,
  upload.array("images", 7),
  updateProperty
);

/* 🗑️ Supprimer une propriété (USER CONNECTÉ) */
router.delete("/:id", protect, deleteProperty);

export default router;
