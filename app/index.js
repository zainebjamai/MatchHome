import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://172.20.10.7:5000/api";



export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
const [isAuthenticated, setIsAuthenticated] = useState(false);
useEffect(() => {
  fetchDashboard();
  checkAuth();
}, []);

const checkAuth = async () => {
  const token = await AsyncStorage.getItem("token");
  setIsAuthenticated(!!token);

  if (token) {
    fetchFavorites(token);
  }
};

const fetchFavorites = async (token) => {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFavorites(data.map((f) => f._id));
  } catch (err) {
    console.log("Erreur favoris", err);
  }
};
const toggleFavorite = async (propertyId) => {
  if (!isAuthenticated) {
    router.push("/login");
    return;
  }

  const token = await AsyncStorage.getItem("token");
  const isFav = favorites.includes(propertyId);

  try {
    await fetch(`${API_URL}/favorites/${propertyId}`, {
      method: isFav ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  } catch (error) {
    console.log("Erreur favoris", error);
  }
};

  const fetchDashboard = async () => {
    try {
      // Charger les propriétés
      const propertiesRes = await fetch(`${API_URL}/properties`);
      const propertiesData = await propertiesRes.json();
      const list = Array.isArray(propertiesData)
        ? propertiesData
        : Array.isArray(propertiesData.properties)
        ? propertiesData.properties
        : [];
      setFeaturedProperties(list.slice(0, 6));
      // 🔁 Créer les catégories dynamiques depuis les propriétés
const uniqueCategories = [...new Set(list.map(p => p.category?.toLowerCase()))];

const dynamicCategories = uniqueCategories
  .filter(cat => CATEGORY_CONFIG[cat])
  .map(cat => ({
    key: cat,
    name: CATEGORY_CONFIG[cat].name,
    icon: CATEGORY_CONFIG[cat].icon,
  }));

setCategories(dynamicCategories);


      
      
    } catch (error) {
      console.log("Erreur chargement dashboard:", error);
      alert("Erreur chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Recherche par ville
  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push({
      pathname: "/property-list",
      params: { city: searchText },
    });
  };
const CATEGORY_CONFIG = {
  appartement: { name: "Appartement", icon: "building" },
  villa: { name: "Villa", icon: "home" },
  riad: { name: "Riad", icon: "door-open" },
};
   

  // Moroccan cities
  const cities = [
    { id: 1, name: "Casablanca", propertyCount: "1,250+" },
    { id: 2, name: "Rabat", propertyCount: "850+" },
    { id: 3, name: "Marrakech", propertyCount: "1,100+" },
    { id: 4, name: "Fès", propertyCount: "650+" },
    { id: 5, name: "Tanger", propertyCount: "720+" },
    { id: 6, name: "Agadir", propertyCount: "580+" },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D5AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header avec drapeau Maroc */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>MATCHHOME</Text>
              <View style={styles.moroccoBadge}>
                <Text style={styles.moroccoText}>🇲🇦 MAROC</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-circle" size={28} color="#2D5AFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcome}>Trouvez Votre Maison Idéale</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher à Casablanca, Rabat, Marrakech..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15,000+</Text>
            <Text style={styles.statLabel}>Biens</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>

        
         {/* Catégories */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Catégories</Text>

  <View style={styles.categoriesGrid}>
    {categories.length === 0 ? (
      <Text style={{ color: "#666" }}>Aucune catégorie disponible</Text>
    ) : (
      categories.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={styles.categoryCard}
          onPress={() =>
            router.push({
              pathname: "/property-list",
              params: { category: category.key },
            })
          }
        >
          <View style={styles.categoryIcon}>
            <FontAwesome5
              name={category.icon}
              size={22}
              color="#2D5AFF"
            />
          </View>

          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
      ))
    )}
  </View>
</View>



        {/* ⭐ Propriétés en Vedette */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Propriétés en Vedette</Text>
            <TouchableOpacity onPress={() => router.push("/property-list")}>
              <Text style={styles.seeAll}>Voir Tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.propertiesScroll}
          >
            {featuredProperties.length === 0 ? (
              <Text style={{ marginLeft: 20, color: "#666" }}>
                Aucune propriété disponible
              </Text>
            ) : (
              featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property._id}
                  style={styles.propertyCard}
                  onPress={() =>
                    router.push(`/property-detail/${property._id}`)
                  }
                >
                  {/* 🖼️ Image */}
                  <Image
                    source={{
                      uri: property.images?.[0]
                        ? `http://172.20.10.7:5000${property.images[0]}`
                        : "https://via.placeholder.com/400x200.png?text=No+Image",
                    }}
                    style={styles.propertyImage}
                  />

                  {/* ℹ️ Infos */}
                  <View style={styles.propertyInfo}>
                    <View style={styles.propertyHeader}>
                      <Text style={styles.propertyPrice}>
                        {property.price?.toLocaleString()} MAD
                      </Text>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{property.category}</Text>
                      </View>
                    </View>

                    <Text style={styles.propertyCity}>
                      {property.location?.city || "Ville inconnue"}
                    </Text>

                    <Text style={styles.propertyAddress} numberOfLines={1}>
                      {property.title}
                    </Text>
                  </View>

                  {/* ❤️ Favoris */}
                  <TouchableOpacity
  style={styles.favoriteButton}
  onPress={() => toggleFavorite(property._id)}
>
  <Ionicons
    name={favorites.includes(property._id) ? "heart" : "heart-outline"}
    size={20}
    color={favorites.includes(property._id) ? "#E53E3E" : "#666"}
  />
</TouchableOpacity>

                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Prix moyens par ville */}
        <View style={styles.pricesSection}>
          <Text style={styles.sectionTitle}>Prix Moyens au Maroc</Text>
          <View style={styles.priceList}>
            <View style={styles.priceItem}>
              <Text style={styles.cityName}>Casablanca</Text>
              <Text style={styles.priceValue}>2.5M - 8M MAD</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.cityName}>Marrakech</Text>
              <Text style={styles.priceValue}>1.8M - 12M MAD</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.cityName}>Rabat</Text>
              <Text style={styles.priceValue}>1.2M - 5M MAD</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.cityName}>Tanger</Text>
              <Text style={styles.priceValue}>1M - 6M MAD</Text>
            </View>
          </View>
        </View>

        {/* Pourquoi choisir MatchHome Maroc */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Pourquoi MatchHome Maroc?</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <Ionicons name="shield-checkmark" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Biens Vérifiés</Text>
              <Text style={styles.benefitText}>
                Toutes nos propriétés sont authentifiées
              </Text>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="document-text" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Conseils Juridiques</Text>
              <Text style={styles.benefitText}>
                Accompagnement pour les formalités
              </Text>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="headset" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Support Local</Text>
              <Text style={styles.benefitText}>
                Équipe disponible dans tout le Maroc
              </Text>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="language" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Multilingue</Text>
              <Text style={styles.benefitText}>Arabe, Français, Anglais</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Prêt à Trouver Votre Maison?</Text>
          <Text style={styles.footerText}>
            Commencez votre recherche avec le leader immobilier au Maroc
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.getStartedText}>Commencer Maintenant</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer pour bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home" size={24} color="#2D5AFF" />
          <Text style={styles.navTextActive}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/property-list")}
        >
          <Ionicons name="search" size={24} color="#999" />
          <Text style={styles.navText}>Rechercher</Text>
        </TouchableOpacity>

       

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D5AFF",
    letterSpacing: 1,
  },
  moroccoBadge: {
    backgroundColor: "#C1272D",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  moroccoText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  profileButton: {
    padding: 4,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 25,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    paddingVertical: 15,
  },
  searchButton: {
    backgroundColor: "#2D5AFF",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D5AFF",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e8e8e8",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  seeAll: {
    fontSize: 15,
    color: "#2D5AFF",
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  categoryCard: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(45, 90, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  citiesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  cityCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginRight: 15,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cityCount: {
    fontSize: 14,
    color: "#666",
  },
  propertiesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  propertyCard: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  propertyImage: {
    width: "100%",
    height: 200,
  },
  propertyInfo: {
    padding: 20,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  typeBadge: {
    backgroundColor: "rgba(45, 90, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    color: "#2D5AFF",
    fontWeight: "600",
  },
  propertyCity: {
    fontSize: 14,
    color: "#C1272D",
    fontWeight: "600",
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 15,
    color: "#444",
    marginBottom: 15,
  },
  propertyDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  pricesSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  priceList: {
    marginTop: 15,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D5AFF",
  },
  benefitsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  benefitCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  benefitText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  footer: {
    backgroundColor: "#2D5AFF",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  footerText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 25,
  },
  getStartedButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  getStartedText: {
    color: "#2D5AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 80,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  navItemActive: {
    backgroundColor: "rgba(45, 90, 255, 0.1)",
    borderRadius: 15,
  },
  navText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  navTextActive: {
    color: "#2D5AFF",
    fontWeight: "600",
  },
});