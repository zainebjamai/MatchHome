import { Stack } from 'expo-router';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.appContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <Stack
        screenOptions={{
          // Configuration globale
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0, // Android
            shadowOpacity: 0, // iOS
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
          },
          headerTitleStyle: {
            fontFamily: Platform.select({
              ios: 'Inter-SemiBold',
              android: 'Inter-SemiBold',
            }),
            fontSize: 18,
            color: '#1A1A1A',
            fontWeight: '600',
            letterSpacing: -0.3,
          },
          headerTitleAlign: 'center',
          headerTintColor: '#4A90E2',
          headerBackTitle: '',
          headerBackTitleVisible: false,
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="login"
          options={{ 
            headerShown: false,
            contentStyle: { 
              backgroundColor: '#FFFFFF',
            },
            animation: 'fade',
          }}
        />

        <Stack.Screen
          name="index"
          options={{ 
            title: 'Accueil',
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: '#FFFFFF',
              elevation: 3,
              shadowColor: 'rgba(0, 0, 0, 0.08)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 8,
              borderBottomWidth: 0,
            },
            headerTitleStyle: {
              fontFamily: Platform.select({
                ios: 'Inter-Bold',
                android: 'Inter-Bold',
              }),
              fontSize: 20,
              color: '#1A1A1A',
              fontWeight: '700',
            },
          }}
        />

        <Stack.Screen
          name="signup"
          options={{ 
            title: 'Créer un compte',
            headerStyle: {
              backgroundColor: '#FFFFFF',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            },
            headerTitleStyle: {
              fontFamily: Platform.select({
                ios: 'Inter-SemiBold',
                android: 'Inter-SemiBold',
              }),
              fontSize: 17,
              color: '#1A1A1A',
              fontWeight: '600',
            },
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="property-detail"
          options={{ 
            title: 'Détails du bien',
            headerTransparent: true,
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              color: '#FFFFFF',
              fontFamily: Platform.select({
                ios: 'Inter-SemiBold',
                android: 'Inter-SemiBold',
              }),
              fontSize: 17,
              fontWeight: '600',
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            },
            headerBackTitleVisible: false,
            headerBackground: () => (
              <View style={styles.transparentHeaderBackground} />
            ),
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{ 
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
  name="properties"
  options={{ 
    headerShown: false
  }}
/>
      </Stack>
      
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  transparentHeaderBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  // Styles pour les ombres selon la plateforme
  ...Platform.select({
    ios: {
      shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    },
    android: {
      elevation: {
        elevation: 3,
      },
    },
  }),
});