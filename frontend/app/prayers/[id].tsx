import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Header } from '../../components/Header';
import { api } from '../../services/api';

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [prayer, setPrayer] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [fontSize, setFontSize] = useState<number>(17);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadPrayer(Number(id));
    }
  }, [id]);

  const loadPrayer = async (bookId: number) => {
    try {
      const data = await api.getPrayerBookDetail(bookId);
      setPrayer(data);
      setSections(data.sections || []);
    } catch (err) {
      console.warn('Error loading prayer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (!prayer) return;
    playTrack({
      id: prayer.id + 30000,
      title_amharic: prayer.title_amharic,
      artist_name: prayer.author || 'የቤተክርስቲያን አበው',
      audio_url: prayer.audio_url || 'https://example.com/prayers/daily_prayer.mp3',
      duration_seconds: prayer.audio_duration_seconds || 600,
      category_name: 'ጸሎት',
    });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={prayer?.title_amharic || 'ጸሎት'}
        subtitle={prayer?.title_geez}
        showBack
        onBack={() => router.back()}
      />

      {/* Control Banner */}
      <View style={[styles.controlBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.prayerMeta}>
          <Text style={[styles.prayerTitle, { color: colors.text }]}>
            {prayer?.title_geez}
          </Text>
          <Text style={[styles.occasionMeta, { color: colors.primary }]}>
            {prayer?.occasion_time_display}
          </Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={[styles.audioPlayBtn, { backgroundColor: colors.accent }]} onPress={handlePlayAudio}>
            <Ionicons name="volume-high" size={20} color="#7B1113" />
            <Text style={styles.audioPlayText}>አዳምጥ</Text>
          </TouchableOpacity>

          <View style={styles.fontBtns}>
            <TouchableOpacity onPress={() => setFontSize(Math.max(14, fontSize - 2))} style={styles.fontBtn}>
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(Math.min(26, fontSize + 2))} style={styles.fontBtn}>
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sections List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionsScroll}>
        {sections.map((section) => (
          <View
            key={section.id}
            style={[
              styles.sectionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {section.section_title ? (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {section.section_title}
                </Text>
              </View>
            ) : null}

            {/* Ge'ez Text */}
            <Text style={[styles.geezPrayer, { fontSize: fontSize + 1, color: colors.text }]}>
              {section.text_geez}
            </Text>

            {/* Amharic Text */}
            <Text style={[styles.amharicPrayer, { fontSize, color: isDark ? '#E2E8F0' : '#334155' }]}>
              {section.text_amharic}
            </Text>
          </View>
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
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  prayerMeta: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  occasionMeta: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  audioPlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B1113',
    marginLeft: 4,
  },
  fontBtns: {
    flexDirection: 'row',
  },
  fontBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  fontBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 1,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  geezPrayer: {
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 10,
  },
  amharicPrayer: {
    lineHeight: 26,
    fontWeight: '500',
  },
});
