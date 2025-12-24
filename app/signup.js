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

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.contentContainer}>
                            {/* Logo/Header Section - Place en haut */}
                            <View style={styles.header}>
                                <Text style={styles.logoText}>MATCHHOME</Text>
                                <Text style={styles.welcomeText}>Create Account</Text>
                                <Text style={styles.subtitle}>Join us to find your perfect home match</Text>
                            </View>

                            {/* Form Section - Plus petit et centré */}
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>Sign Up</Text>

                                {/* Full Name Field */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>FULL NAME</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nom complet"
                                        placeholderTextColor="#A0A0A0"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                    />
                                </View>

                                {/* Email Field */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Name@example.com"
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
                                        placeholder=".............."
                                        placeholderTextColor="#A0A0A0"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                        autoCorrect={false}
                                    />
                                </View>

                                {/* Confirm Password Field */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="..............."
                                        placeholderTextColor="#A0A0A0"
                                        secureTextEntry
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        autoCorrect={false}
                                    />
                                </View>

                                {/* Checkbox Section */}
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

                                {/* Sign Up Button */}
                                <TouchableOpacity
                                    style={[styles.signupButton, !isChecked && styles.signupButtonDisabled]}
                                    onPress={() => isChecked && router.push('/')}
                                    activeOpacity={0.8}
                                    disabled={!isChecked}
                                >
                                    <Text style={[styles.signupButtonText, !isChecked && styles.signupButtonTextDisabled]}>
                                        CREATE ACCOUNT
                                    </Text>
                                </TouchableOpacity>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>Already have an account?</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={() => router.push('/login')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.loginButtonText}>SIGN IN</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Footer - Plus petit */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    © 2024 MatchHome. All rights reserved.
                                </Text>
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