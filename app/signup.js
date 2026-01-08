import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 FONCTION SIGNUP
  const handleSignup = async () => {
    if (!fullName || !email || !password || !phone) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (!isChecked) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://172.20.10.7:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password,
            phone: phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erreur', data.message || 'Erreur lors de l’inscription');
        return;
      }

      Alert.alert('Succès', 'Compte créé avec succès');
      router.push('/login');

    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.contentContainer}>

              <View style={styles.header}>
                <Text style={styles.logoText}>MATCHHOME</Text>
                <Text style={styles.welcomeText}>Create Account</Text>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Sign Up</Text>

                {/* FULL NAME */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>FULL NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                {/* EMAIL */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                {/* PHONE */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PHONE</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CONFIRM PASSWORD</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                {/* CHECKBOX */}
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setIsChecked(!isChecked)}
                >
                  <View style={styles.checkbox}>
                    {isChecked && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the terms
                  </Text>
                </TouchableOpacity>

                {/* BUTTON */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text style={styles.signupButtonText}>
                    {loading ? 'LOADING...' : 'CREATE ACCOUNT'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/login')}
                >
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: height * 0.05,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    logoText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 3,
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 10,
    },
    welcomeText: {
        fontSize: 32,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
    },
    subtitle: {
        fontSize: 18,
        color: '#F8F8F8',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 15,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '500',
        height: 48,
    },
    // Styles pour la checkbox
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
        marginBottom: 16,
        paddingHorizontal: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#2D5AFF',
        borderRadius: 5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxInner: {
        width: 10,
        height: 10,
        backgroundColor: '#2D5AFF',
        borderRadius: 2,
    },
    checkboxText: {
        flex: 1,
        fontSize: 12,
        color: '#2D3748',
        lineHeight: 18,
        fontWeight: '500',
    },
    // Styles pour le bouton de création de compte
    signupButton: {
        backgroundColor: '#2D5AFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
        shadowColor: '#2D5AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signupButtonDisabled: {
        backgroundColor: '#CBD5E0',
        shadowColor: '#CBD5E0',
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    signupButtonTextDisabled: {
        color: '#718096',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        paddingHorizontal: 12,
        color: '#718096',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        borderWidth: 2,
        borderColor: '#2D5AFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 12,
    },
    loginButtonText: {
        color: '#2D5AFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 15,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },
});