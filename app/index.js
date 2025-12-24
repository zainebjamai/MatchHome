import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Home() {
  const [searchText, setSearchText] = useState('');

  // faux data

  const featuredProperties = [
    {
      id: 1,
      price: "3.5M MAD",
      bedrooms: 4,
      bathrooms: 3,
      address: "Villa Moderne, Casablanca",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
      city: "Casablanca",
      type: "Villa"
    },
    {
      id: 2,
      price: "1.2M MAD",
      bedrooms: 3,
      bathrooms: 2,
      address: "Appartement Marina, Rabat",
      image: "https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w=800&auto=format&fit=crop",
      city: "Rabat",
      type: "Appartement"
    },
    {
      id: 3,
      price: "8M MAD",
      bedrooms: 5,
      bathrooms: 4,
      address: "Villa Luxe, Marrakech",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
      city: "Marrakech",
      type: "Villa de Luxe"
    },
    {
      id: 4,
      price: "850K MAD",
      bedrooms: 2,
      bathrooms: 1,
      address: "Riad Traditionnel, Fès",
      image: "https://images.unsplash.com/photo-1548625361-5c43d9e0833b?w=800&auto=format&fit=crop",
      city: "Fès",
      type: "Riad"
    },
  ];

  // Categories spécifiques au Maroc
  const categories = [
    { id: 1, name: "Villas", icon: "home" },
    { id: 2, name: "Appartements", icon: "building" },
    { id: 3, name: "Riads", icon: "door-open" },
    { id: 4, name: "Studios", icon: "city" },
    { id: 5, name: "Maisons", icon: "house-user" },
    { id: 6, name: "Luxe", icon: "crown" },
  ];

  // Moroccan cities
  const cities = [
    { id: 1, name: "Casablanca", propertyCount: "1,250+" },
    { id: 2, name: "Rabat", propertyCount: "850+" },
    { id: 3, name: "Marrakech", propertyCount: "1,100+" },
    { id: 4, name: "Fès", propertyCount: "650+" },
    { id: 5, name: "Tanger", propertyCount: "720+" },
    { id: 6, name: "Agadir", propertyCount: "580+" },
  ];

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
            <TouchableOpacity style={styles.profileButton}>
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
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => router.push('/property-list')}
              >
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push('/property-list')}
              >
                <View style={styles.categoryIcon}>
                  <FontAwesome5 name={category.icon} size={22} color="#2D5AFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Villes populaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Villes Populaires</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.citiesScroll}
          >
            {cities.map((city) => (
              <TouchableOpacity 
                key={city.id}
                style={styles.cityCard}
                onPress={() => router.push('/property-list')}
              >
                <Text style={styles.cityName}>{city.name}</Text>
                <Text style={styles.cityCount}>{city.propertyCount} biens</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Propriétés vedettes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Propriétés en Vedette</Text>
            <TouchableOpacity onPress={() => router.push('/property-list')}>
              <Text style={styles.seeAll}>Voir Tout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.propertiesScroll}
          >
            {featuredProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
               onPress={() => router.push(`/property-detail/${property.id}`)}


              >
                <Image
                  source={{ uri: property.image }}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
                
                <View style={styles.propertyInfo}>
                  <View style={styles.propertyHeader}>
                    <Text style={styles.propertyPrice}>{property.price}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{property.type}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.propertyCity}>{property.city}</Text>
                  <Text style={styles.propertyAddress}>{property.address}</Text>
                  
                  <View style={styles.propertyDetails}>
                    <View style={styles.detail}>
                      <Ionicons name="bed" size={16} color="#666" />
                      <Text style={styles.detailText}>{property.bedrooms} ch</Text>
                    </View>
                    <View style={styles.detail}>
                      <Ionicons name="water" size={16} color="#666" />
                      <Text style={styles.detailText}>{property.bathrooms} sdb</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={20} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
              <Text style={styles.benefitText}>Toutes nos propriétés sont authentifiées</Text>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="document-text" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Conseils Juridiques</Text>
              <Text style={styles.benefitText}>Accompagnement pour les formalités</Text>
            </View>
            <View style={styles.benefitCard}>
              <Ionicons name="headset" size={28} color="#2D5AFF" />
              <Text style={styles.benefitTitle}>Support Local</Text>
              <Text style={styles.benefitText}>Équipe disponible dans tout le Maroc</Text>
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
            onPress={() => router.push('/login')}
          >
            <Text style={styles.getStartedText}>Commencer Maintenant</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer pour bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color="#2D5AFF" />
          <Text style={styles.navTextActive}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/property-list')}
        >
          <Ionicons name="search" size={24} color="#999" />
          <Text style={styles.navText}>Rechercher</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Favoris</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/login')}
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D5AFF',
    letterSpacing: 1,
  },
  moroccoBadge: {
    backgroundColor: '#C1272D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  moroccoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  profileButton: {
    padding: 4,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 25,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    paddingVertical: 15,
  },
  searchButton: {
    backgroundColor: '#2D5AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D5AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e8e8e8',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAll: {
    fontSize: 15,
    color: '#2D5AFF',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 90, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  citiesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  cityCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginRight: 15,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cityCount: {
    fontSize: 14,
    color: '#666',
  },
  propertiesScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  propertyCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  propertyInfo: {
    padding: 20,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  typeBadge: {
    backgroundColor: 'rgba(45, 90, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    color: '#2D5AFF',
    fontWeight: '600',
  },
  propertyCity: {
    fontSize: 14,
    color: '#C1272D',
    fontWeight: '600',
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 15,
    color: '#444',
    marginBottom: 15,
  },
  propertyDetails: {
    flexDirection: 'row',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pricesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  priceList: {
    marginTop: 15,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5AFF',
  },
  benefitsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  benefitCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    backgroundColor: '#2D5AFF',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 25,
  },
  getStartedButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    color: '#2D5AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(45, 90, 255, 0.1)',
    borderRadius: 15,
  },
  navText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2D5AFF',
    fontWeight: '600',
  },
});