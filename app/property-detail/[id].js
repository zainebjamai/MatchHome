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
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
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
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Ionicons name="home-outline" size={60} color="#CCCCCC" />
        <Text style={styles.errorText}>Propriété introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔙 Header avec image */}
      <View style={styles.imageContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        >
          {property.images?.map((img, index) => (
            <Image
              key={index}
              source={{ uri: `http://172.20.10.7:5000${img}` }}
              style={styles.image}
            />
          ))}
        </ScrollView>
        
        {/* Overlay pour les boutons */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={26}
                color="#FF4757"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Titre et prix */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{property.price.toLocaleString()} MAD</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{property.category}</Text>
            </View>
          </View>
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#4A6FA5" />
            <Text style={styles.sectionTitle}>Localisation</Text>
          </View>
          <Text style={styles.locationText}>{property.location?.address}</Text>
          <Text style={styles.cityText}>
            <Ionicons name="location-outline" size={16} color="#666" />
            {` ${property.location?.city}`}
          </Text>
        </View>

        {/* Détails */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="home" size={20} color="#4A6FA5" />
            <Text style={styles.sectionTitle}>Détails</Text>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialIcons name="bed" size={24} color="#4A6FA5" />
              <Text style={styles.detailLabel}>Chambres</Text>
              <Text style={styles.detailValue}>{property.features?.bedrooms || "N/A"}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <FontAwesome name="bath" size={20} color="#4A6FA5" />
              <Text style={styles.detailLabel}>Salles de bain</Text>
              <Text style={styles.detailValue}>{property.features?.bathrooms || "N/A"}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="resize" size={20} color="#4A6FA5" />
              <Text style={styles.detailLabel}>Surface</Text>
              <Text style={styles.detailValue}>{property.features?.area || "N/A"} m²</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#4A6FA5" />
            <Text style={styles.sectionTitle}>Contact</Text>
          </View>
          
          <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <Text style={styles.ownerName}>{property.ownerName}</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call" size={18} color="#666" />
                <Text style={styles.phone}>{property.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="chatbubble" size={18} color="#FFF" />
              <Text style={styles.contactButtonText}>Contacter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Admin */}
        {isAuthenticated && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="settings" size={20} color="#4A6FA5" />
              <Text style={styles.sectionTitle}>Gestion</Text>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editBtn]}
                onPress={() => router.push(`/edit-property/${property._id}`)}
              >
                <Ionicons name="create-outline" size={20} color="#FFF" />
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#FFF" />
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

/* 🎨 Styles améliorés */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F8F9FA"
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500"
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 12
  },
  imageContainer: {
    height: 300,
    position: 'relative'
  },
  image: {
    width: width,
    height: 300,
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40
  },
  titleSection: {
    marginBottom: 25
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    lineHeight: 32
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A6FA5'
  },
  categoryTag: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  categoryText: {
    color: '#4A6FA5',
    fontSize: 14,
    fontWeight: '600'
  },
  section: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500'
  },
  cityText: {
    fontSize: 14,
    color: '#777',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailItem: {
    alignItems: 'center',
    flex: 1
  },
  detailLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    marginBottom: 4
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16
  },
  contactInfo: {
    flex: 1
  },
  ownerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  phone: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  contactButton: {
    backgroundColor: '#4A6FA5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600'
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12
  },
  editBtn: {
    backgroundColor: "#4A6FA5",
  },
  deleteBtn: {
    backgroundColor: "#E53E3E",
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 15
  },
});