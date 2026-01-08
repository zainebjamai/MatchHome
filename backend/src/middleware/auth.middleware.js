import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Vérifier si le token existe dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ Extraire le token
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Récupérer l'utilisateur (sans le password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // continuer vers la route
    } catch (error) {
      return res.status(401).json({ message: "Token invalide" });
    }
  }

  // 5️⃣ Si pas de token
  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }
};

export default protect;
