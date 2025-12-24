import { router } from 'expo-router';
import { useState } from 'react';
import {
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false); // État pour la checkbox

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay sombre */}
        <View style={styles.overlay} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Conteneur principal qui pousse tout vers le bas */}
            <View style={styles.mainContainer}>
              
              {/* Logo/Header Section - PLUS BAS dans l'écran */}
              <View style={styles.header}>
                <Text style={styles.logoText}>MATCHHOME</Text>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subtitle}>Find your perfect home match</Text>
              </View>

              {/* Form Section */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Login to Your Account</Text>

                {/* Email Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#A0A0A0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                  />
                </View>

                
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setIsChecked(!isChecked)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkbox}>
                    {isChecked && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to MatchHome's Terms of Service and Privacy Policy
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, !isChecked && styles.loginButtonDisabled]}
                  onPress={() => isChecked && router.push('/')}
                  activeOpacity={0.8}
                  disabled={!isChecked}
                >
                  <Text style={[styles.loginButtonText, !isChecked && styles.loginButtonTextDisabled]}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>New to MatchHome?</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => router.push('/signup')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  activeOpacity={0.6}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: height * 0.1,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  welcomeText: {
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  // Styles pour la checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2D5AFF',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#2D5AFF',
    borderRadius: 3,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
    fontWeight: '500',
  },
  // Styles pour le bouton de connexion désactivé
  loginButton: {
    backgroundColor: '#2D5AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#2D5AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#CBD5E0',
    shadowColor: '#CBD5E0',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginButtonTextDisabled: {
    color: '#718096',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#718096',
    fontSize: 15,
    fontWeight: '600',
  },
  signupButton: {
    borderWidth: 2.5,
    borderColor: '#2D5AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#2D5AFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  forgotPasswordText: {
    color: '#718096',
    fontSize: 15,
    fontWeight: '600',
  },
});