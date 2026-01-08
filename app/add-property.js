import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddProperty() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [pool, setPool] = useState(false);

  const [images, setImages] = useState([]);

  /* 📸 Choisir plusieurs images */
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  /* ➕ Ajouter property */
  const handleAddProperty = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        return;
      }

      const formData = new FormData();

      // champs texte
      formData.append("title", title);
      formData.append("category", category); // villa | appartement | riad
      formData.append("price", price);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("ownerName", ownerName);
      formData.append("phone", phone);

      // features
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);
      formData.append("area", area);
      formData.append("pool", pool);

      // images (IMPORTANT : name = "images")
      images.forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: `photo_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const response = await fetch(
        "http://172.20.10.7:5000/api/properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.message || "Erreur serveur");
        return;
      }

      Alert.alert("Succès", "Propriété ajoutée avec succès");
      router.replace("/profile");
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Impossible d'ajouter la propriété");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter une propriété</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Informations principales</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Titre de l'annonce" 
            placeholderTextColor="#999"
            value={title} 
            onChangeText={setTitle} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Catégorie (villa, appartement, riad)" 
            placeholderTextColor="#999"
            value={category} 
            onChangeText={setCategory} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Prix (MAD)" 
            placeholderTextColor="#999"
            keyboardType="numeric" 
            value={price} 
            onChangeText={setPrice} 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Localisation</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ville" 
            placeholderTextColor="#999"
            value={city} 
            onChangeText={setCity} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Adresse complète" 
            placeholderTextColor="#999"
            value={address} 
            onChangeText={setAddress} 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Contact</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nom du propriétaire" 
            placeholderTextColor="#999"
            value={ownerName} 
            onChangeText={setOwnerName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Téléphone" 
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone} 
            onChangeText={setPhone} 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Caractéristiques</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureInputContainer}>
              <Text style={styles.featureLabel}>Chambres</Text>
              <TextInput 
                style={styles.featureInput} 
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={bedrooms} 
                onChangeText={setBedrooms} 
              />
            </View>
            <View style={styles.featureInputContainer}>
              <Text style={styles.featureLabel}>Salles de bain</Text>
              <TextInput 
                style={styles.featureInput} 
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={bathrooms} 
                onChangeText={setBathrooms} 
              />
            </View>
            <View style={styles.featureInputContainer}>
              <Text style={styles.featureLabel}>Surface (m²)</Text>
              <TextInput 
                style={styles.featureInput} 
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric" 
                value={area} 
                onChangeText={setArea} 
              />
            </View>
            <TouchableOpacity 
              style={[styles.poolButton, pool && styles.poolButtonActive]}
              onPress={() => setPool(!pool)}
            >
              <Ionicons 
                name={pool ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={20} 
                color={pool ? "#2D5AFF" : "#999"} 
              />
              <Text style={[styles.poolText, pool && styles.poolTextActive]}>
                Piscine
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Photos</Text>
          <TouchableOpacity style={styles.photoBtn} onPress={pickImages}>
            <Ionicons name="camera" size={28} color="#2D5AFF" />
            <Text style={styles.photoText}>Ajouter des photos</Text>
            <Text style={styles.photoSubText}>Sélectionnez jusqu'à 10 images</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imageRow}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: img.uri }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setImages(newImages);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bouton d'ajout */}
        <TouchableOpacity style={styles.button} onPress={handleAddProperty}>
          <Text style={styles.buttonText}>PUBLIER L'ANNONCE</Text>
          <Ionicons name="checkmark-circle" size={22} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#999" />
          <Text style={styles.navText}>Retour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/home')}
        >
          <Ionicons name="home-outline" size={22} color="#999" />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
        >
          <Ionicons name="add-circle" size={24} color="#2D5AFF" />
          <Text style={styles.navTextActive}>Ajouter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={22} color="#999" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerPlaceholder: {
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureInputContainer: {
    width: '48%',
  },
  featureLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 5,
  },
  featureInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  poolButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  poolButtonActive: {
    backgroundColor: 'rgba(45, 90, 255, 0.1)',
    borderColor: '#2D5AFF',
  },
  poolText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  poolTextActive: {
    color: '#2D5AFF',
    fontWeight: '600',
  },
  photoBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e8e8e8',
    borderStyle: 'dashed',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2D5AFF',
    marginTop: 10,
    marginBottom: 5,
  },
  photoSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#2D5AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#2D5AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  bottomSpacer: {
    height: 20,
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
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(45, 90, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
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