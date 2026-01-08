import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
console.log("🔥 AUTH CONTROLLER ACTUEL CHARGÉ 🔥");

export const register = async (req, res) => {
    console.log("🔥 REGISTER ROUTE TOUCHED");

  try {
    const { name, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({
      message: "Utilisateur créé",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
export const login = async (req, res) => {
    console.log("✅ LOGIN NOUVELLE VERSION");

  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // 2. Vérifier le mot de passe
const isMatch = await user.comparePassword(password);
;
    if (!isMatch) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // 3. Créer le TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Réponse
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
