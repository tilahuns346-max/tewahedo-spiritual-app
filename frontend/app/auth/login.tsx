import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CrossLogo } from '../../components/CrossLogo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage('እባክዎ የተጠቃሚ ስም ወይም ኢሜይል እና የይለፍ ቃል ያስገቡ (Please fill in all fields)');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      await login({ email: usernameOrEmail.trim(), password });
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      console.log('Login error:', err);
      setErrorMessage(
        err.response?.data?.detail ||
        'የይለፍ ቃል ወይም የተጠቃሚ ስም አልተገኘም። እባክዎ እንደገና ይሞክሩ (Invalid credentials).'
      );
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
          <CrossLogo size={80} color={colors.primary} />
          <Text style={[styles.titleAm, { color: colors.primary }]}>መሐበረ ቅዱሳን</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>ወደ መለያዎ ይግቡ (Sign In)</Text>
        </View>

        {errorMessage ? (
          <View style={[styles.errorBox, { backgroundColor: '#FFECEC', borderColor: '#FF5C5C' }]}>
            <Ionicons name="alert-circle" size={18} color="#D32F2F" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>የተጠቃሚ ስም ወይም ኢሜይል</Text>
          <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Username or Email"
              placeholderTextColor={colors.subtext}
              autoCapitalize="none"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
            />
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 14 }]}>የይለፍ ቃል (Password)</Text>
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

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>ይግቡ (Sign In)</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerPrompt}>
            <Text style={[styles.promptText, { color: colors.subtext }]}>መለያ የለዎትም? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>ይመዝገቡ (Register)</Text>
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
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 6,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 40,
  },
  titleAm: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  loginBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  promptText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
