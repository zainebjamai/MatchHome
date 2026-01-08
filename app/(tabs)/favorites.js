import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://172.20.10.7:5000/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  /* 📡 Charger les favoris */
  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Veuillez vous connecter");
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur chargement favoris");
        return;
      }

      setFavorites(data);
    } catch (error) {
      console.log(error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  /* ⏳ LOADING */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D5AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#2D5AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>❤️ Mes Favoris</Text>
      </View>

      {/* 📭 Aucun favori */}
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const property = item.propertyId;

            if (!property) return null;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push(`/property-detail/${property._id}`)
                }
              >
                <Image
                  source={{
                    uri: property.images?.[0]
                      ? `http://172.20.10.7:5000${property.images[0]}`
                      : "https://via.placeholder.com/400x200.png?text=No+Image",
                  }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.price}>
                    {property.price?.toLocaleString()} DH
                  </Text>

                  <Text style={styles.city}>
                    {property.location?.city || "Ville inconnue"}
                  </Text>

                  <Text numberOfLines={1} style={styles.titleProp}>
                    {property.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D5AFF",
  },
  city: {
    fontSize: 14,
    color: "#C1272D",
    marginVertical: 4,
  },
  titleProp: {
    fontSize: 15,
    color: "#333",
  },
});
