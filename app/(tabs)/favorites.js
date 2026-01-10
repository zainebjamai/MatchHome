import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');
const API_URL = "http://172.20.10.7:5000/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Veuillez vous connecter");
        router.replace("/login");
        return;
      }

      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
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
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const removeFromFavorites = async (favoriteId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`${API_URL}/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from local state
      setFavorites(favorites.filter(fav => fav._id !== favoriteId));
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la suppression");
    }
  };

  const confirmRemove = (favoriteId, propertyTitle) => {
    alert(
      "Retirer des favoris",
      `Voulez-vous retirer "${propertyTitle}" de vos favoris ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Retirer", 
          style: "destructive",
          onPress: () => removeFromFavorites(favoriteId)
        }
      ]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA').format(price);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Mes Favoris</Text>
          <Text style={styles.favoritesCount}>
            {favorites.length} {favorites.length === 1 ? 'propriété' : 'propriétés'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="filter-list" size={24} color="#4A6FA5" />
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={80} color="#D1D5DB" />
            <View style={styles.heartBackground}>
              <Ionicons name="heart" size={40} color="#FEE2E2" />
            </View>
          </View>
          
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyDescription}>
            Les propriétés que vous aimez apparaîtront ici
          </Text>
          
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Ionicons name="search" size={20} color="#FFF" />
            <Text style={styles.exploreButtonText}>Explorer les propriétés</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4A6FA5"]}
              tintColor="#4A6FA5"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Vos propriétés favorites
            </Text>
          }
          renderItem={({ item }) => {
            const property = item.propertyId;
            if (!property) return null;

            return (
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/property-detail/${property._id}`)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: property.images?.[0]
                          ? `http://172.20.10.7:5000${property.images[0]}`
                          : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=250&fit=crop",
                      }}
                      style={styles.image}
                    />
                    
                    <View style={styles.imageOverlay}>
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>{formatPrice(property.price)} MAD</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.removeFavoriteButton}
                        onPress={() => confirmRemove(item._id, property.title)}
                      >
                        <Ionicons name="heart" size={22} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryText}>{property.category}</Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {property.title}
                    </Text>
                    
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.locationText}>
                        {property.location?.city || 'Ville non spécifiée'}
                      </Text>
                    </View>
                    
                    <View style={styles.featuresContainer}>
                      {property.features?.bedrooms && (
                        <View style={styles.feature}>
                          <Ionicons name="bed-outline" size={16} color="#4A6FA5" />
                          <Text style={styles.featureText}>
                            {property.features.bedrooms} ch.
                          </Text>
                        </View>
                      )}
                      
                      {property.features?.bathrooms && (
                        <View style={styles.feature}>
                          <Ionicons name="water-outline" size={16} color="#4A6FA5" />
                          <Text style={styles.featureText}>
                            {property.features.bathrooms} sdb
                          </Text>
                        </View>
                      )}
                      
                      {property.features?.area && (
                        <View style={styles.feature}>
                          <Ionicons name="resize-outline" size={16} color="#4A6FA5" />
                          <Text style={styles.featureText}>
                            {property.features.area} m²
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.cardFooter}>
                      <Text style={styles.addedDate}>
                        Ajouté le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                      </Text>
                      <View style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>Voir détails</Text>
                        <Ionicons name="chevron-forward" size={16} color="#4A6FA5" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  favoritesCount: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  heartBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 20,
    marginLeft: 8,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  priceBadge: {
    backgroundColor: 'rgba(74, 111, 165, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  removeFavoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#4A6FA5',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#4A6FA5',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addedDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#4A6FA5',
    fontWeight: '600',
  },
});