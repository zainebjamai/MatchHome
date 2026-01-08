import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProperty() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

  /* 🔄 Charger la propriété */
  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await fetch(
        `http://172.20.10.7:5000/api/properties/${id}`
      );
      const data = await res.json();

      setTitle(data.title || "");
      setCategory(data.category || "");
      setPrice(String(data.price || ""));
      setAddress(data.location?.address || "");
      setCity(data.location?.city || "");
      setBedrooms(String(data.features?.bedrooms || ""));
      setBathrooms(String(data.features?.bathrooms || ""));
      setArea(String(data.features?.area || ""));
      setOwnerName(data.ownerName || "");
      setPhone(data.phone || "");
    } catch (error) {
      Alert.alert("Erreur", "Chargement impossible");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ UPDATE */
  const handleUpdate = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    const body = {
      title,
      category,
      price,
      address,
      city,
      bedrooms,
      bathrooms,
      area,
      ownerName,
      phone,
    };

    const response = await fetch(
      `http://172.20.10.7:5000/api/properties/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    Alert.alert("Succès", "Propriété modifiée", [
      {
        text: "OK",
        onPress: () => {
          // 🔥 ON REVIENT AU PROFIL PROPREMENT
          router.push("/(tabs)/profile");
        },
      },
    ]);
  } catch (error) {
    Alert.alert("Erreur", "Modification échouée");
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Modifier la propriété</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre" />
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Catégorie" />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Prix" keyboardType="numeric" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Adresse" />
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Ville" />
      <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms} placeholder="Chambres" keyboardType="numeric" />
      <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms} placeholder="Salles de bain" keyboardType="numeric" />
      <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="Surface" keyboardType="numeric" />
      <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="Nom du propriétaire" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Téléphone" />

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2D5AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
