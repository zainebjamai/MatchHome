import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function PropertyList() {
  const { category, city } = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [category, city]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("http://172.20.10.7:5000/api/properties");
      const data = await res.json();

      let filtered = data;

      if (category) {
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase().trim() === category.toLowerCase().trim()
        );
      }

      if (city) {
        filtered = filtered.filter(
          (p) => p.location?.city?.toLowerCase().trim() === city.toLowerCase().trim()
        );
      }

      setProperties(filtered);
    } catch (error) {
      console.log("Erreur chargement propriétés:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA').format(price);
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'appartement': return 'home-outline';
      case 'maison': return 'business-outline';
      case 'villa': return 'star-outline';
      case 'bureau': return 'business-outline';
      default: return 'home-outline';
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Chargement des propriétés...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {category ? `${category}s` : 'Toutes les propriétés'}
          </Text>
          {city && (
            <Text style={styles.headerSubtitle}>
              <Ionicons name="location" size={14} color="#666" />
              {` ${city}`}
            </Text>
          )}
          <Text style={styles.resultCount}>
            {properties.length} {properties.length === 1 ? 'propriété trouvée' : 'propriétés trouvées'}
          </Text>
        </View>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4A6FA5"]}
            tintColor="#4A6FA5"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={80} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>Aucune propriété trouvée</Text>
            <Text style={styles.emptyText}>
              Aucune propriété ne correspond à vos critères de recherche
            </Text>
            <TouchableOpacity 
              style={styles.backToAllButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backToAllText}>Voir toutes les propriétés</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/property-detail/${item._id}`)}
            style={styles.propertyCard}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: item.images?.[0]
                    ? `http://172.20.10.7:5000${item.images[0]}`
                    : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=250&fit=crop",
                }}
                style={styles.propertyImage}
              />
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{formatPrice(item.price)} MAD</Text>
              </View>
              {item.featured && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="#FFF" />
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}
            </View>
            
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {item.title}
              </Text>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>
                  {item.location?.city || 'Ville non spécifiée'}
                </Text>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Ionicons 
                    name={getCategoryIcon(item.category)} 
                    size={16} 
                    color="#4A6FA5" 
                  />
                  <Text style={styles.detailText}>{item.category}</Text>
                </View>
                
                {item.bedrooms && (
                  <View style={styles.detailItem}>
                    <Ionicons name="bed-outline" size={16} color="#4A6FA5" />
                    <Text style={styles.detailText}>{item.bedrooms} chambres</Text>
                  </View>
                )}
                
                {item.surface && (
                  <View style={styles.detailItem}>
                    <Ionicons name="resize-outline" size={16} color="#4A6FA5" />
                    <Text style={styles.detailText}>{item.surface} m²</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.footer}>
                <Text style={styles.contactText}>Contactez l'agent</Text>
                <Ionicons name="chevron-forward" size={20} color="#4A6FA5" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  resultCount: {
    fontSize: 14,
    color: '#4A6FA5',
    marginTop: 8,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
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
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyInfo: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#4A6FA5',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#4A6FA5',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backToAllButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backToAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});