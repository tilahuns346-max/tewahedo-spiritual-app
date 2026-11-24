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

export default function WudaseDayScreen() {
  const { day } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [dayData, setDayData] = useState<any>(null);
  const [stanzas, setStanzas] = useState<any[]>([]);
  const [fontSize, setFontSize] = useState<number>(17);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (day) {
      loadDay(String(day));
    }
  }, [day]);

  const loadDay = async (dayCode: string) => {
    try {
      const data = await api.getWudaseDayDetail(dayCode);
      setDayData(data);
      setStanzas(data.stanzas || []);
    } catch (err) {
      console.warn('Error loading wudase day:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (!dayData) return;
    playTrack({
      id: dayData.id + 20000,
      title_amharic: dayData.name_amharic,
      artist_name: 'ቅዱስ ኤፍሬም ሶርያዊ',
      audio_url: dayData.audio_url || 'https://example.com/audio/wudase_monday.mp3',
      duration_seconds: dayData.audio_duration_seconds || 1200,
      category_name: 'ውዳሴ ማርያም',
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
        title={dayData?.name_amharic || 'ውዳሴ ማርያም'}
        subtitle={dayData?.name_geez}
        showBack
        onBack={() => router.back()}
      />

      {/* Control Banner */}
      <View style={[styles.controlBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.themeMeta}>
          <Text style={[styles.dayTitle, { color: colors.text }]}>
            {dayData?.name_geez}
          </Text>
          <Text style={[styles.themeSummary, { color: colors.textSecondary }]} numberOfLines={1}>
            {dayData?.theme_summary}
          </Text>
        </View>

        <View style={styles.rightActions}>
          {/* Audio Recitation Button */}
          <TouchableOpacity style={[styles.audioPlayBtn, { backgroundColor: colors.accent }]} onPress={handlePlayAudio}>
            <Ionicons name="volume-high" size={20} color="#7B1113" />
            <Text style={styles.audioPlayText}>አዳምጥ</Text>
          </TouchableOpacity>

          {/* Font Resizing */}
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

      {/* Stanzas Reading View */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stanzasScroll}>
        {stanzas.map((stanza) => (
          <View
            key={stanza.id}
            style={[
              styles.stanzaCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Stanza Badge Header */}
            <View style={styles.stanzaHeader}>
              <View style={[styles.stanzaBadge, { backgroundColor: isDark ? 'rgba(212,175,55,0.15)' : 'rgba(123,17,19,0.08)' }]}>
                <Text style={[styles.stanzaBadgeText, { color: isDark ? colors.accent : colors.primary }]}>
                  አንቀጽ {stanza.stanza_number}
                </Text>
              </View>
            </View>

            {/* Ge'ez Stanza */}
            <Text style={[styles.geezStanza, { fontSize: fontSize + 1, color: colors.text }]}>
              {stanza.text_geez}
            </Text>

            {/* Amharic Translation */}
            <Text style={[styles.amharicStanza, { fontSize, color: isDark ? '#E2E8F0' : '#334155' }]}>
              {stanza.text_amharic}
            </Text>

            {/* Spiritual Commentary */}
            {stanza.spiritual_meaning ? (
              <View style={[styles.commentaryCard, { backgroundColor: isDark ? 'rgba(212,175,55,0.08)' : '#FFFBEB' }]}>
                <Text style={[styles.commentaryLabel, { color: colors.accent }]}>የአንድምታ ትርጓሜ (Commentary):</Text>
                <Text style={[styles.commentaryText, { color: isDark ? '#E5E7EB' : '#92400E' }]}>
                  {stanza.spiritual_meaning}
                </Text>
              </View>
            ) : null}
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
  themeMeta: {
    flex: 1,
    marginRight: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  themeSummary: {
    fontSize: 12,
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
  stanzasScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  stanzaCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 1,
  },
  stanzaHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stanzaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stanzaBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  geezStanza: {
    fontWeight: '700',
    lineHeight: 29,
    marginBottom: 10,
  },
  amharicStanza: {
    lineHeight: 26,
    fontWeight: '500',
  },
  commentaryCard: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  commentaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  commentaryText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
