import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["villa", "appartement", "riad"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      address: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },

    images: [
      {
        type: String, // URL des images
      },
    ],

    features: {
      bedrooms: Number,
      bathrooms: Number,
      pool: Boolean,
      area: Number, // m²
    },

    ownerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);
