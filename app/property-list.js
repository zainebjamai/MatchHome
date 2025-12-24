import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Fake data
const propertiesData = [
  { id: 1, type: "Villa", city: "Casablanca", price: "3.5M MAD", bedrooms: 4, bathrooms: 3, address: "Villa Moderne, Casablanca", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop" },
  { id: 2, type: "Appartement", city: "Rabat", price: "1.2M MAD", bedrooms: 3, bathrooms: 2, address: "Appartement Marina, Rabat", image: "https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w=800&auto=format&fit=crop" },
  { id: 3, type: "Villa de Luxe", city: "Marrakech", price: "8M MAD", bedrooms: 5, bathrooms: 4, address: "Villa Luxe, Marrakech", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop" },
  { id: 4, type: "Riad", city: "Fès", price: "850K MAD", bedrooms: 2, bathrooms: 1, address: "Riad Traditionnel, Fès", image: "https://images.unsplash.com/photo-1548625361-5c43d9e0833b?w=800&auto=format&fit=crop" },
];

const categories = ["Villa", "Appartement", "Riad", "Studio", "Maisons", "Luxe"];
const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

export default function PropertyList({ route }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredProperties, setFilteredProperties] = useState(propertiesData);

  // Filtrer les propriétés selon les critères
  useEffect(() => {
    let filtered = propertiesData;

    // Filtrage exclusif : catégorie ou ville
    if (selectedCategory) {
      filtered = propertiesData.filter(p => p.type === selectedCategory);
    } else if (selectedCity) {
      filtered = propertiesData.filter(p => p.city === selectedCity);
    }

    // Filtrage par recherche texte
    if (searchText) {
      filtered = filtered.filter(p =>
        p.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [selectedCategory, selectedCity, searchText]);

  const renderProperty = ({ item }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => router.push(`/property-detail/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyPrice}>{item.price}</Text>
        <Text style={styles.propertyType}>{item.type}</Text>
        <Text style={styles.propertyCity}>{item.city}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
        <Text style={styles.propertyDetails}>{item.bedrooms} ch • {item.bathrooms} sdb</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filtre catégories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.filterButtonActive
            ]}
            onPress={() => {
              setSelectedCategory(selectedCategory === cat ? '' : cat);
              setSelectedCity(''); // reset ville si catégorie sélectionnée
            }}
          >
            <Text style={selectedCategory === cat ? styles.filterTextActive : styles.filterText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtre villes */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {cities.map(city => (
          <TouchableOpacity
            key={city}
            style={[
              styles.filterButton,
              selectedCity === city && styles.filterButtonActive
            ]}
            onPress={() => {
              setSelectedCity(selectedCity === city ? '' : city);
              setSelectedCategory(''); // reset catégorie si ville sélectionnée
            }}
          >
            <Text style={selectedCity === city ? styles.filterTextActive : styles.filterText}>{city}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste des propriétés */}
      <FlatList
        data={filteredProperties}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProperty}
        contentContainerStyle={{ padding: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  filterScroll: { paddingHorizontal: 15, marginVertical: 10 },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: { backgroundColor: '#2D5AFF', borderColor: '#2D5AFF' },
  filterText: { color: '#333' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  propertyImage: { width: '100%', height: 180 },
  propertyInfo: { padding: 15 },
  propertyPrice: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  propertyType: { fontSize: 14, color: '#2D5AFF', marginBottom: 5 },
  propertyCity: { fontSize: 14, color: '#C1272D', marginBottom: 5 },
  propertyAddress: { fontSize: 14, color: '#444', marginBottom: 5 },
  propertyDetails: { fontSize: 12, color: '#666' },
});
