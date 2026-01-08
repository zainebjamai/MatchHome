import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";
import auth from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", auth, addFavorite);
router.get("/", auth, getFavorites);
router.delete("/:id", auth, removeFavorite);

export default router;
