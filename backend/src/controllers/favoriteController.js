import Favorite from "../models/Favorite.js";

/* ➕ Ajouter aux favoris */
export const addFavorite = async (req, res) => {
  const { propertyId } = req.body;

  const exists = await Favorite.findOne({
    userId: req.user.id,
    propertyId,
  });

  if (exists) {
    return res.status(400).json({ message: "Déjà en favoris" });
  }

  const favorite = await Favorite.create({
    userId: req.user.id,
    propertyId,
  });

  res.status(201).json(favorite);
};

/* 📋 Liste des favoris */
export const getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.id })
    .populate("propertyId");

  res.json(favorites);
};

/* ❌ Supprimer des favoris */
export const removeFavorite = async (req, res) => {
  await Favorite.findOneAndDelete({
    userId: req.user.id,
    propertyId: req.params.id,
  });

  res.json({ message: "Supprimé des favoris" });
};
