import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';

export default function BooksScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const sections = [
    {
      title: 'ሥርዓተ ቅዳሴ (Divine Liturgy)',
      subtitle: '14ቱ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቅዳሴያት',
      description: 'የግዕዝ ዜማ፣ የአማርኛ ትርጉም፣ የካህን፣ የዲያቆንና የሕዝብ ተሰጥኦ',
      route: '/kidase',
      icon: 'book',
      color: '#7B1113',
      badge: '14 ቅዳሴያት',
    },
    {
      title: 'ውዳሴ ማርያም (Wudase Mariam)',
      subtitle: 'የሰባቱ ቀናት ምስጋናና አንቀጸ ብርሃን',
      description: 'በቅዱስ ኤፍሬምና በቅዱስ ያሬድ የተደረሱ የድንግል ማርያም ምስጋናዎች',
      route: '/wudase',
      icon: 'rose',
      color: '#D4AF37',
      badge: '7 ቀናት',
    },
    {
      title: 'መጽሐፈ ጸሎት (Daily Prayers)',
      subtitle: 'የዘወትር ጸሎት፣ ጸሎተ ሃይማኖት፣ መልክአ ማርያም',
      description: 'የማለዳ፣ የሠርክና የሌሊት ጸሎታት ከድምፅ ንባብ ጋር',
      route: '/prayers',
      icon: 'shield',
      color: '#580C1F',
      badge: 'ጸሎታት',
    },
    {
      title: 'መጽሐፈ ስንክሳር (Synaxarium)',
      subtitle: 'የቅዱሳን ታሪክና የዓመቱ በዓላት',
      description: 'በየዕለቱ የሚነበቡ የቅዱሳን ገድልና የቤተክርስቲያን መታሰቢያዎች',
      route: '/calendar',
      icon: 'calendar',
      color: '#AA841E',
      badge: 'ስንክሳር',
    },
    {
      title: 'ስብሐታትና ስብከት (Sermons)',
      subtitle: 'የተመረጡ የስብከት ድምፆችና ቪዲዮዎች',
      description: 'በመምህራነ ቤተክርስቲያን የተሰጡ መንፈሳዊ ትምህርቶችና ስብከቶች',
      route: '/sermons',
      icon: 'mic',
      color: '#800020',
      badge: 'ስብከቶች',
    },
    {
      title: 'መንፈሳዊ ቪዲዮዎች (Video Library)',
      subtitle: 'የቤተክርስቲያን አገልግሎቶችና ዘጋቢ ፊልሞች',
      description: 'የበዓላት ማዕዶች፣ የሥርዓተ ቅዳሴና የመንፈሳዊ ጉባኤያት ቪዲዮዎች',
      route: '/videos',
      icon: 'videocam',
      color: '#9C1A1D',
      badge: 'ቪዲዮ',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="መጻሕፍት" subtitle="ሥርዓተ ቅዳሴና ጸሎት" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner with Liturgical Image */}
        <View style={[styles.bannerCard, { backgroundColor: isDark ? colors.surface : '#7B1113' }]}>
          <Image
            source={require('../../assets/images/liturgy_priest_ref.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>ሥርዓተ አምልኮና ጸሎት</Text>
            <Text style={styles.bannerSubtitle}>
              "በመንፈስ እጸልያለሁ በአእምሮም ደግሞ እጸልያለሁ" (1ኛ ቆሮ 14:15)
            </Text>
          </View>
        </View>

        {/* Section Cards */}
        {sections.map((sec, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.88}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push(sec.route as any)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(212,175,55,0.15)' : 'rgba(123,17,19,0.08)' }]}>
              <Ionicons name={sec.icon as any} size={28} color={isDark ? colors.accent : colors.primary} />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                  {sec.title}
                </Text>
                <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(123,17,19,0.1)' }]}>
                  <Text style={[styles.badgeText, { color: isDark ? colors.accent : colors.primary }]}>
                    {sec.badge}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardSubtitle, { color: colors.accent }]}>
                {sec.subtitle}
              </Text>

              <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {sec.description}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={{ alignSelf: 'center', marginLeft: 8 }} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  bannerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    height: 140,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#F3E5AB',
    marginTop: 6,
    fontWeight: '500',
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 7,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
});
