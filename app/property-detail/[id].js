import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://172.20.10.7:5000/api";

export default function PropertyDetail() {
  const { id } = useLocalSearchParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchProperty();
    checkIfFavorite();
  }, []);

  /* 🔐 Vérifier authentification */
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  /* 📡 Charger la propriété */
  const fetchProperty = async () => {
    try {
      const res = await fetch(`${API_URL}/properties/${id}`);
      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.message || "Propriété introuvable");
        return;
      }

      setProperty(data);
    } catch (err) {
      Alert.alert("Erreur", "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  /* ❤️ Vérifier si déjà en favoris */
  const checkIfFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const exists = data.some(
        (fav) => fav.propertyId?._id === id
      );

      setIsFavorite(exists);
    } catch (e) {
      console.log(e);
    }
  };

  /* ❤️ Ajouter / supprimer favoris */
  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Connexion requise");
        router.push("/login");
        return;
      }

      if (isFavorite) {
        await fetch(`${API_URL}/favorites/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
      } else {
        await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId: id }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      Alert.alert("Erreur", "Action impossible");
    }
  };

  /* 🗑️ Supprimer propriété */
  const handleDelete = async () => {
    Alert.alert("Confirmation", "Supprimer cette propriété ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          await fetch(`${API_URL}/properties/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Alert.alert("Succès", "Propriété supprimée");
          router.replace("/(tabs)/profile");
        },
      },
    ]);
  };

  /* ⏳ Loading */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Text>Propriété introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#2D5AFF" />
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color="#E53E3E"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 📸 Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {property.images?.map((img, index) => (
          <Image
            key={index}
            source={{ uri: `http://172.20.10.7:5000${img}` }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* 🏷️ Infos */}
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.price}>{property.price} MAD</Text>
      <Text>{property.category}</Text>

      <Text style={styles.section}>📍 Localisation</Text>
      <Text>{property.location?.address}</Text>
      <Text>{property.location?.city}</Text>

      <Text style={styles.section}>🏠 Détails</Text>
      <Text>Chambres : {property.features?.bedrooms}</Text>
      <Text>Salles de bain : {property.features?.bathrooms}</Text>
      <Text>Surface : {property.features?.area} m²</Text>

      <Text style={styles.section}>📞 Contact</Text>
      <Text>{property.ownerName}</Text>
      <Text>{property.phone}</Text>

      {/* ✏️ Actions */}
      {isAuthenticated && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              router.push(`/edit-property/${property._id}`)
            }
          >
            <Text style={styles.btnText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
  },
  image: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "700", margin: 15 },
  price: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 15,
    color: "#2D5AFF",
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginHorizontal: 15,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },
  editBtn: {
    backgroundColor: "#2D5AFF",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#E53E3E",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
