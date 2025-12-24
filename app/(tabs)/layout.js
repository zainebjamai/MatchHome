import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>

      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard' }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil' }}
      />

      <Tabs.Screen
        name="favorites"
        options={{ title: 'Favoris' }}
      />

    </Tabs>
  );
}
