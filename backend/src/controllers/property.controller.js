import Property from "../models/Property.model.js";

/* ➕ Ajouter une propriété (AVEC PHOTOS) */
export const createProperty = async (req, res) => {
  try {
    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const property = await Property.create({
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,

      location: {
        address: req.body.address,
        city: req.body.city,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },

      features: {
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        pool: req.body.pool === "true",
        area: req.body.area,
      },

      ownerName: req.body.ownerName,
      phone: req.body.phone,

      images: imageUrls,
      user: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/* 📄 Toutes les propriétés (PUBLIC) */
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("user", "name email");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🏠 DASHBOARD (PUBLIC) */
export const getDashboardProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .limit(20);

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 👤 Mes propriétés */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔍 Propriété par ID */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 📂 Propriétés par catégorie */
export const getPropertiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const properties = await Property.find({
      category: new RegExp(`^${category}$`, "i"),
    }).populate("user", "name");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🌍 Propriétés par ville */
export const getPropertiesByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const properties = await Property.find({
      "location.city": new RegExp(`^${city}$`, "i"),
    }).populate("user", "name");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔎 Recherche (ville / catégorie / mot-clé) */
export const searchProperties = async (req, res) => {
  try {
    const { city, category, keyword } = req.query;

    const query = {};

    if (city) {
      query["location.city"] = new RegExp(city, "i");
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (keyword) {
      query.title = new RegExp(keyword, "i");
    }

    const properties = await Property.find(query).populate(
      "user",
      "name email"
    );

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ✏️ Modifier une propriété */
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 🔐 sécurité : seulement le propriétaire
    if (property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const imageUrls = req.files?.length
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : null;

    if (req.body.title !== undefined) property.title = req.body.title;
    if (req.body.category !== undefined) property.category = req.body.category;
    if (req.body.price !== undefined) property.price = req.body.price;

    property.location = {
      address: req.body.address ?? property.location.address,
      city: req.body.city ?? property.location.city,
      latitude: req.body.latitude ?? property.location.latitude,
      longitude: req.body.longitude ?? property.location.longitude,
    };

    property.features = {
      bedrooms: req.body.bedrooms ?? property.features.bedrooms,
      bathrooms: req.body.bathrooms ?? property.features.bathrooms,
      pool:
        req.body.pool !== undefined
          ? req.body.pool === "true" || req.body.pool === true
          : property.features.pool,
      area: req.body.area ?? property.features.area,
    };

    if (req.body.ownerName !== undefined)
      property.ownerName = req.body.ownerName;
    if (req.body.phone !== undefined) property.phone = req.body.phone;

    if (imageUrls) property.images = imageUrls;

    const updatedProperty = await property.save();
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* 🗑️ Supprimer une propriété */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 🔐 sécurité : seulement le propriétaire
    if (property.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
