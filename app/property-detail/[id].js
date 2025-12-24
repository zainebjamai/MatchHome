import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Données de test pour différentes propriétés
const propertyData = {
  1: {
    id: 1,
    title: "Villa Moderne à Casablanca",
    price: "3,500,000 MAD",
    location: "Anfa, Casablanca",
    description: "Magnifique villa moderne avec piscine et jardin...",
    type: "Villa",
    surface: "300 m²",
    bedrooms: 4,
    bathrooms: 3,
    features: ["Piscine", "Jardin", "Garage", "Climatisation"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
    ],
  },
  2: {
    id: 2,
    title: "Appartement Marina Rabat",
    price: "1,200,000 MAD",
    location: "Marina de Rabat",
    description: "Appartement neuf avec vue sur la marina...",
    type: "Appartement",
    surface: "85 m²",
    bedrooms: 3,
    bathrooms: 2,
    features: ["Vue marina", "Piscine", "Salle de sport"],
    images: [
      "https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w=800&auto=format&fit=crop",
    ],
  },
  3: {
    id: 3,
    title: "Villa de Luxe Marrakech",
    price: "8,000,000 MAD",
    location: "Palmeraie, Marrakech",
    description: "Somptueuse villa dans la Palmeraie...",
    type: "Villa de Luxe",
    surface: "600 m²",
    bedrooms: 5,
    bathrooms: 4,
    features: ["Piscine", "Spa", "Jardin exotique"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    ],
  },
  4: {
    id: 4,
    title: "Riad Traditionnel Fès",
    price: "850,000 MAD",
    location: "Médina, Fès",
    description: "Authentique riad restauré dans la médina...",
    type: "Riad",
    surface: "180 m²",
    bedrooms: 2,
    bathrooms: 1,
    features: ["Patio", "Fontaine", "Terrasses"],
    images: [
      "https://images.unsplash.com/photo-1548625361-5c43d9e0833b?w=800&auto=format&fit=crop",
    ],
  },
};

export default function PropertyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // Récupérer les données de la propriété
  const property = propertyData[id] || propertyData[1];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header avec image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {/* Boutons header */}
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3B30" : "#FFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Informations principales */}
        <View style={styles.infoSection}>
          <Text style={styles.price}>{property.price}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="#2D5AFF" />
            <Text style={styles.location}>{property.location}</Text>
          </View>
        </View>

        {/* Stats rapides */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <FontAwesome5 name="bed" size={20} color="#2D5AFF" />
            <Text style={styles.statValue}>{property.bedrooms}</Text>
            <Text style={styles.statLabel}>Chambres</Text>
          </View>
          
          <View style={styles.stat}>
            <FontAwesome5 name="bath" size={20} color="#2D5AFF" />
            <Text style={styles.statValue}>{property.bathrooms}</Text>
            <Text style={styles.statLabel}>Salles de bain</Text>
          </View>
          
          <View style={styles.stat}>
            <FontAwesome5 name="ruler-combined" size={20} color="#2D5AFF" />
            <Text style={styles.statValue}>{property.surface}</Text>
            <Text style={styles.statLabel}>Surface</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Caractéristiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caractéristiques</Text>
          <View style={styles.featuresList}>
            {property.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={20} color="#FFF" />
            <Text style={styles.contactButtonText}>Contacter l'agent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.visitButton}>
            <Ionicons name="calendar" size={20} color="#2D5AFF" />
            <Text style={styles.visitButtonText}>Visite guidée</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5AFF',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  actionButtons: {
    padding: 20,
    flexDirection: 'row',
    gap: 15,
  },
  contactButton: {
    flex: 2,
    backgroundColor: '#2D5AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  visitButton: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2D5AFF',
  },
  visitButtonText: {
    color: '#2D5AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});