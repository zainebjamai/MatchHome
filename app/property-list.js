import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

export default function PropertyList() {
  const { category, city } = useLocalSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [category, city]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("http://172.20.10.7:5000/api/properties");
      const data = await res.json();

      let filtered = data;

      // ✅ FILTRE PAR CATEGORIE
      if (category) {
        filtered = filtered.filter(
          (p) =>
            p.category?.toLowerCase().trim() ===
            category.toLowerCase().trim()
        );
      }

      // ✅ FILTRE PAR VILLE
      if (city) {
        filtered = filtered.filter(
          (p) =>
            p.location?.city?.toLowerCase().trim() ===
            city.toLowerCase().trim()
        );
      }

      setProperties(filtered);
    } catch (error) {
      console.log("Erreur chargement propriétés:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Aucune propriété trouvée
        </Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/property-detail/${item._id}`)}
          style={{ marginBottom: 20 }}
        >
          <Image
            source={{
              uri: item.images?.[0]
                ? `http://172.20.10.7:5000${item.images[0]}`
                : "https://via.placeholder.com/400x200",
            }}
            style={{ height: 200, borderRadius: 10 }}
          />
          <Text>{item.title}</Text>
          <Text>{item.price} MAD</Text>
          <Text>{item.location?.city}</Text>
          <Text>{item.category}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
