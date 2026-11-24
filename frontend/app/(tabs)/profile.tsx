import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { CrossLogo } from '../../components/CrossLogo';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, language, setLanguage } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'መውጣት (Logout)',
      'እርግጠኛ ኖት መውጣት ይፈልጋሉ?',
      [
        { text: 'ይቅር', style: 'cancel' },
        { text: 'ውጣ', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="ፕሮፋይል" subtitle="የተጠቃሚ መለያና ምርጫዎች" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {isAuthenticated && user ? (
            <View style={styles.userHeader}>
              <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
                <CrossLogo size={36} />
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user.full_name || 'ምእመን'}
                </Text>
                {user.baptismal_name ? (
                  <Text style={[styles.baptismalName, { color: colors.primary }]}>
                    የክርስትና ስም: {user.baptismal_name}
                  </Text>
                ) : null}
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.email}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.guestContainer}>
              <CrossLogo size={56} />
              <Text style={[styles.guestTitle, { color: colors.text }]}>
                እንኳን ወደ መሐበረ ቅዱሳን በደህና መጡ!
              </Text>
              <Text style={[styles.guestDesc, { color: colors.textSecondary }]}>
                የተመረጡ መዝሙራትን ለማስቀመጥ፣ የንባብ ታሪክ ለመከታተልና አጫዋች ዝርዝር ለመፍጠር እባክዎ ይግቡ።
              </Text>
              <View style={styles.authButtonsRow}>
                <TouchableOpacity
                  style={[styles.loginBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/auth/login')}
                >
                  <Text style={styles.loginBtnText}>ይግቡ (Login)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.registerBtn, { borderColor: colors.primary }]}
                  onPress={() => router.push('/auth/register')}
                >
                  <Text style={[styles.registerBtnText, { color: colors.primary }]}>ይመዝገቡ (Register)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Spiritual Library & Personal Shortcuts */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>መንፈሳዊ ማህደር (Personal Library)</Text>

        <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/playlists')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="list" size={22} color={colors.primary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>የግል አጫዋች ዝርዝሮች (My Playlists)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/downloads')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="download-outline" size={22} color={colors.accent} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>የወረዱ ፋይሎች (Offline Media)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/calendar')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="calendar-outline" size={22} color="#AA841E" />
              <Text style={[styles.menuLabel, { color: colors.text }]}>የአጽዋማትና በዓላት መቁጠሪያ (Calendar)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences & Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>ምርጫዎችና ቅንብሮች (Settings)</Text>

        <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Theme Mode Toggle */}
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={toggleTheme}>
            <View style={styles.menuLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={colors.primary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>ገጽታ (Theme Mode)</Text>
            </View>
            <Text style={[styles.menuValue, { color: colors.accent }]}>
              {isDark ? 'ዋዜማ (Dark)' : 'ብርሃን (Light)'}
            </Text>
          </TouchableOpacity>

          {/* Language Selection */}
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="language" size={22} color={colors.accent} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>ቋንቋ (Language)</Text>
            </View>
            <View style={styles.langSelector}>
              {(['am', 'gez', 'en'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.langPill,
                    {
                      backgroundColor: language === lang ? colors.primary : 'transparent',
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.langText,
                      { color: language === lang ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {lang === 'am' ? 'አማ' : lang === 'gez' ? 'ግዕዝ' : 'EN'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Logout Button if Logged In */}
        {isAuthenticated ? (
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#DC2626' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>ከመለያ ውጣ (Logout)</Text>
          </TouchableOpacity>
        ) : null}

        {/* App Version Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            መሐበረ ቅዱሳን (Tewahedo Media) v1.0.0
          </Text>
          <Text style={[styles.subVersionText, { color: colors.textSecondary }]}>
            የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መንፈሳዊ መተግበሪያ
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 14,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  baptismalName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  guestContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  guestDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  authButtonsRow: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  loginBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  registerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    marginLeft: 8,
  },
  registerBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  menuContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  menuValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  langSelector: {
    flexDirection: 'row',
  },
  langPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 6,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subVersionText: {
    fontSize: 11,
    marginTop: 2,
  },
});
