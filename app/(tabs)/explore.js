import { router } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const properties = [
  { id: '1', title: 'Villa à Agadir', price: 8500 },
  { id: '2', title: 'Appartement à Marrakech', price: 6500 },
];

export default function Explore() {
  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/property-detail/${item.id}`)}
            style={{ marginBottom: 15, backgroundColor: '#fff', padding: 15, borderRadius: 10 }}
          >
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text style={{ color: '#1e90ff' }}>{item.price} DH</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
