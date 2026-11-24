import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Header } from '../../components/Header';
import { ContentCard } from '../../components/ContentCard';
import { api } from '../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyData, setDailyData] = useState<any>(null);
  const [featuredTracks, setFeaturedTracks] = useState<any[]>([]);
  const [featuredLessons, setFeaturedLessons] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [todayOverview, tracksRes, lessonsRes] = await Promise.all([
        api.getTodayOverview().catch(() => null),
        api.getAudioTracks({ is_featured: true }).catch(() => ({ results: [] })),
        api.getLessons({ is_featured: true }).catch(() => ({ results: [] })),
      ]);

      setDailyData(todayOverview);
      setFeaturedTracks(tracksRes?.results || []);
      setFeaturedLessons(lessonsRes?.results || []);
    } catch (err) {
      console.warn('Error loading home data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const quickNavItems = [
    { label: 'መዝሙር', icon: 'musical-notes', route: '/(tabs)/audio', color: '#D4AF37' },
    { label: 'ቅዳሴ', icon: 'book', route: '/kidase', color: '#7B1113' },
    { label: 'ውዳሴ ማርያም', icon: 'rose', route: '/wudase', color: '#B8860B' },
    { label: 'ስብከት', icon: 'mic', route: '/sermons', color: '#580C1F' },
    { label: 'ጸሎት', icon: 'shield', route: '/prayers', color: '#800020' },
    { label: 'ትምህርት', icon: 'school', route: '/(tabs)/learn', color: '#AA841E' },
    { label: 'ቪዲዮ', icon: 'videocam', route: '/videos', color: '#9C1A1D' },
    { label: 'ቀን መቁጠሪያ', icon: 'calendar', route: '/calendar', color: '#7B1113' },
  ];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>መንፈሳዊ መረጃ በመጫን ላይ...</Text>
      </View>
    );
  }

  const ethCal = dailyData?.ethiopian_calendar;
  const verse = dailyData?.verse;
  const devotional = dailyData?.devotional;
  const todaySaints = dailyData?.saints || [];
  const fasting = dailyData?.fasting;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Ethiopian Calendar & Fasting Banner */}
        <View style={[styles.calendarBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.calendarLeft}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.calendarDate, { color: colors.text }]}>
                {ethCal?.formatted || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቀን መቁጠሪያ'}
              </Text>
              <Text style={[styles.calendarWeekday, { color: colors.textSecondary }]}>
                {ethCal?.weekday_amharic ? `ዕለተ ${ethCal.weekday_amharic}` : 'እንኳን ደህና መጡ'}
              </Text>
            </View>
          </View>
          {fasting ? (
            <View
              style={[
                styles.fastingBadge,
                { backgroundColor: fasting.is_fasting_day ? '#7B1113' : 'rgba(34, 197, 94, 0.15)' },
              ]}
            >
              <Text style={[styles.fastingText, { color: fasting.is_fasting_day ? '#FFFFFF' : '#15803D' }]}>
                {fasting.is_fasting_day ? 'የጾም ቀን' : 'የፍስክ ቀን'}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Today's Saint Banner */}
        {todaySaints.length > 0 ? (
          <View style={[styles.saintCard, { backgroundColor: isDark ? colors.surface : '#FFF9EE', borderColor: colors.accent }]}>
            <View style={styles.saintHeader}>
              <View style={styles.badgeRow}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Text style={[styles.saintBadgeText, { color: colors.primary }]}>የዕለቱ ቅዱስ (Synaxarium)</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/calendar')}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>ሁሉንም እይ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.saintBody}>
              <Image
                source={require('../../assets/images/saint_monk.png')}
                style={styles.saintImage}
                resizeMode="cover"
              />
              <View style={styles.saintInfo}>
                <Text style={[styles.saintName, { color: colors.text }]}>
                  {todaySaints[0].name_amharic}
                </Text>
                <Text style={[styles.saintFeast, { color: colors.primary }]}>
                  {todaySaints[0].feast_description || 'መታሰቢያ በዓል'}
                </Text>
                <Text style={[styles.saintBio, { color: colors.textSecondary }]} numberOfLines={2}>
                  {todaySaints[0].biography_amharic || 'የቅዱሱ በረከትና ምልጃ ከሁላችን ጋር ይሁን።'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Daily Bible Verse */}
        {verse ? (
          <View style={[styles.verseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.verseHeader}>
              <Ionicons name="book" size={18} color={colors.accent} />
              <Text style={[styles.verseLabel, { color: colors.primary }]}>የዕለቱ ጥቅስ</Text>
            </View>
            <Text style={[styles.verseText, { color: colors.text }]}>
              "{verse.verse_text_amharic}"
            </Text>
            <Text style={[styles.verseRef, { color: colors.accent }]}>
              {verse.verse_reference}
            </Text>
            {verse.commentary ? (
              <Text style={[styles.verseCommentary, { color: colors.textSecondary }]}>
                {verse.commentary}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Quick Access Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ፈጣን መዳረሻ (Categories)</Text>
        </View>

        <View style={styles.quickGrid}>
          {quickNavItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              style={[styles.gridItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(212,175,55,0.15)' : 'rgba(123,17,19,0.08)' }]}>
                <Ionicons name={item.icon as any} size={24} color={isDark ? colors.accent : colors.primary} />
              </View>
              <Text style={[styles.gridLabel, { color: colors.text }]} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Audio Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>የተመረጡ መዝሙራት (Featured Audio)</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/audio')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>ሁሉንም አዳምጥ</Text>
          </TouchableOpacity>
        </View>

        {featuredTracks.map((track) => (
          <ContentCard
            key={track.id}
            title={track.title_amharic}
            subtitle={track.artist_name || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
            categoryTag="መዝሙር"
            duration={`${Math.floor(track.duration_seconds / 60)}:${(track.duration_seconds % 60).toString().padStart(2, '0')}`}
            onPress={() => playTrack(track, featuredTracks)}
            onPlayPress={() => playTrack(track, featuredTracks)}
          />
        ))}

        {/* Daily Spiritual Devotional */}
        {devotional ? (
          <View style={[styles.devotionalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.devotionalHeader}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Text style={[styles.devotionalTitle, { color: colors.text }]}>
                {devotional.title_amharic}
              </Text>
            </View>
            <Text style={[styles.devotionalAuthor, { color: colors.accent }]}>
              ምክረ አበው - {devotional.author_saint}
            </Text>
            <Text style={[styles.devotionalContent, { color: colors.textSecondary }]}>
              {devotional.content_amharic}
            </Text>
          </View>
        ) : null}

        {/* Featured Lessons */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ትምህርተ ተዋሕዶ (Teachings)</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>ተጨማሪ ትምህርቶች</Text>
          </TouchableOpacity>
        </View>

        {featuredLessons.map((lesson) => (
          <ContentCard
            key={lesson.id}
            title={lesson.title_amharic}
            subtitle={lesson.summary}
            categoryTag={lesson.category_name_amharic || 'ትምህርት'}
            duration={`${Math.floor(lesson.audio_duration_seconds / 60)} ደቂቃ`}
            onPress={() => router.push(`/lesson/${lesson.id}` as any)}
          />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  calendarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  calendarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarDate: {
    fontSize: 14,
    fontWeight: '700',
  },
  calendarWeekday: {
    fontSize: 12,
    marginTop: 2,
  },
  fastingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fastingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  saintCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  saintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saintBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saintBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saintImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  saintInfo: {
    flex: 1,
    marginLeft: 12,
  },
  saintName: {
    fontSize: 16,
    fontWeight: '800',
  },
  saintFeast: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  saintBio: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  verseCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  verseText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 23,
    fontStyle: 'italic',
  },
  verseRef: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 6,
  },
  verseCommentary: {
    fontSize: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23%',
    aspectRatio: 0.95,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  devotionalCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  devotionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devotionalTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  devotionalAuthor: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  devotionalContent: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
});
