import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

 useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAll();
    }, [])
  );




  const fetchAll = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Token introuvable, reconnecte-toi");
        router.replace("/login");
        return;
      }

      /* 👤 PROFIL USER */
      const userRes = await fetch(
        "http://172.20.10.7:5000/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await userRes.json();

      if (!userRes.ok) {
        alert(userData.message || "Erreur profil");
        return;
      }

      /* 🏠 PROPRIÉTÉS DU USER */
      const propRes = await fetch(
        "http://172.20.10.7:5000/api/properties/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const propData = await propRes.json();

      if (!propRes.ok) {
        alert(propData.message || "Erreur properties");
        return;
      }

      setUser(userData);
      setProperties(propData);
    } catch (error) {
      console.log(error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>MATCHHOME</Text>
              <View style={styles.moroccoBadge}>
                <Text style={styles.moroccoText}>🇲🇦 PROFIL</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || "Utilisateur"}</Text>
          <Text style={styles.userEmail}>{user?.email || "Email"}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{properties.length}</Text>
              <Text style={styles.statLabel}>Biens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.statLabel}>Premium</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.statLabel}>Vérifié</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{user?.phone || "Non renseigné"}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Membre depuis</Text>
              <Text style={styles.infoValue}>Janvier 2024</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push("/add-property")}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(45, 90, 255, 0.1)' }]}>
                <Ionicons name="add-circle" size={28} color="#2D5AFF" />
              </View>
              <Text style={styles.actionText}>Ajouter un bien</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
  style={styles.actionCard}
  onPress={() => router.push("/favorites")}
>

              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                <Ionicons name="heart" size={28} color="#FFC107" />
              </View>
              <Text style={styles.actionText}>Favoris</Text>
            </TouchableOpacity>
            
          
          </View>
        </View>

        {/* My Properties */}
        <View style={styles.propertiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes propriétés</Text>
            <TouchableOpacity onPress={() => router.push("/add-property")}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {properties.length === 0 ? (
            <View style={styles.emptyProperties}>
              <Ionicons name="home-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Aucune propriété ajoutée</Text>
              <TouchableOpacity 
                style={styles.addFirstButton}
                onPress={() => router.push("/add-property")}
              >
                <Text style={styles.addFirstText}>Ajouter votre premier bien</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.propertiesList}
              contentContainerStyle={styles.propertiesListContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/property-detail/${item._id}`)}
                  style={styles.propertyCard}
                >
                  {item.images && item.images[0] ? (
                    <Image
  source={{ uri: `http://172.20.10.7:5000${item.images[0]}` }}
  style={styles.propertyImage}
  resizeMode="cover"
/>

                  ) : (
                    <View style={styles.propertyImagePlaceholder}>
                      <Ionicons name="home" size={30} color="#ccc" />
                    </View>
                  )}
                  
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.propertyPrice}>
                      {item.price?.toLocaleString()} DH
                    </Text>
                    <View style={styles.propertyDetails}>
                      <Text style={styles.propertyDetail}>
                        {item.category} • {item.city}
                      </Text>
                    </View>
                   
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

       

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={22} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
       <TouchableOpacity
  style={styles.navItem}
  onPress={() => router.push("/")} // ou "/" selon ton home
>
  <Ionicons name="home-outline" size={24} color="#999" />
  <Text style={styles.navText}>Accueil</Text>
</TouchableOpacity>

        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/explore')}
        >
          <Ionicons name="search" size={24} color="#999" />
          <Text style={styles.navText}>Explorer</Text>
        </TouchableOpacity>
        
      <TouchableOpacity
  style={styles.navItem}
  onPress={() => router.push("/favorites")}
>
  <Ionicons name="heart-outline" size={24} color="#999" />
  <Text style={styles.navText}>Favoris</Text>
</TouchableOpacity>

        
        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
        >
          <Ionicons name="person" size={24} color="#2D5AFF" />
          <Text style={styles.navTextActive}>Profil</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
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
    paddingBottom: 20,
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
    marginBottom: 10,
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
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D5AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2D5AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e8e8e8',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 15,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  propertiesSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAll: {
    fontSize: 14,
    color: '#2D5AFF',
    fontWeight: '600',
  },
  emptyProperties: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#2D5AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  propertiesList: {
    marginLeft: -5,
  },
  propertiesListContent: {
    paddingLeft: 5,
  },
  propertyCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  propertyImage: {
    width: '100%',
    height: 120,
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5AFF',
    marginBottom: 8,
  },
  propertyDetails: {
    marginBottom: 10,
  },
  propertyDetail: {
    fontSize: 12,
    color: '#666',
  },
  propertyStatus: {
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusAvailable: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  statusRented: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: '#C1272D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 30,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
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