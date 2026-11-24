import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CrossLogo } from '../../components/CrossLogo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [baptismalName, setBaptismalName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'am' | 'en' | 'gez'>('am');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('እባክዎ የተጠቃሚ ስም፣ ኢሜይል እና የይለፍ ቃል ያስገቡ (Please fill in required fields)');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('የይለፍ ቃሎች አይመሳሰሉም (Passwords do not match)');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('የይለፍ ቃል ቢያንስ 6 ሆሄያት መሆን አለበት (Password must be at least 6 characters)');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await register({
        username: username.trim(),
        email: email.trim(),
        full_name: fullName.trim(),
        baptismal_name: baptismalName.trim(),
        password,
        confirm_password: confirmPassword,
        preferred_language: preferredLanguage,
      });
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      console.log('Registration error:', err);
      const resData = err.response?.data;
      if (resData) {
        const firstKey = Object.keys(resData)[0];
        const msg = Array.isArray(resData[firstKey]) ? resData[firstKey][0] : resData[firstKey];
        setErrorMessage(`${firstKey}: ${msg}`);
      } else {
        setErrorMessage('ምዝገባው አልተሳካም። እባክዎ እንደገና ይሞክሩ (Registration failed).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <CrossLogo size={60} color={colors.primary} />
          <Text style={[styles.titleAm, { color: colors.primary }]}>አዲስ መለያ ይፍጠሩ</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Create an Account</Text>
        </View>

        {errorMessage ? (
          <View style={[styles.errorBox, { backgroundColor: '#FFECEC', borderColor: '#FF5C5C' }]}>
            <Ionicons name="alert-circle" size={18} color="#D32F2F" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>የተጠቃሚ ስም (Username) *</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Username"
              placeholderTextColor={colors.subtext}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>ኢሜይል (Email) *</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="email@example.com"
              placeholderTextColor={colors.subtext}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>ሙሉ ስም (Full Name)</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="id-card-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.subtext}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>የክርስትና ስም (Baptismal Name)</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="flower-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="ለምሳሌ፡ ገብረ ማርያም / ወለተ ጊዮርጊስ"
              placeholderTextColor={colors.subtext}
              value={baptismalName}
              onChangeText={setBaptismalName}
            />
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>የይለፍ ቃል (Password) *</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 12 }]}>የይለፍ ቃል ያረጋግጡ (Confirm Password) *</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.subtext}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerBtnText}>ተመዝገብ (Sign Up)</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={[styles.promptText, { color: colors.subtext }]}>ቀደም ሲል መለያ አለዎት? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>ይግቡ (Sign In)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleAm: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    flex: 1,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  registerBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
