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

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [sermon, setSermon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getSermonDetail(Number(id))
        .then((data) => setSermon(data))
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePlayAudio = () => {
    if (!sermon) return;
    playTrack({
      id: sermon.id + 40000,
      title_amharic: sermon.title_amharic,
      artist_name: sermon.preacher?.name_amharic,
      audio_url: sermon.audio_url || 'https://example.com/sermons/glory_tewahedo.mp3',
      duration_seconds: sermon.audio_duration_seconds || 3600,
      category_name: 'ስብከት',
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
        title={sermon?.title_amharic || 'ስብከት'}
        subtitle={sermon?.preacher?.name_amharic}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sermon Title & Preacher Header Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {sermon?.title_amharic}
          </Text>

          <View style={styles.preacherRow}>
            <Ionicons name="person-circle" size={32} color={colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.preacherName, { color: colors.primary }]}>
                {sermon?.preacher?.title_rank_display} {sermon?.preacher?.name_amharic}
              </Text>
              {sermon?.preacher?.church_parish ? (
                <Text style={[styles.preacherChurch, { color: colors.textSecondary }]}>
                  {sermon?.preacher?.church_parish}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Scripture Theme */}
          {sermon?.scripture_theme ? (
            <View style={[styles.scriptureBadge, { backgroundColor: isDark ? 'rgba(212,175,55,0.15)' : 'rgba(123,17,19,0.08)' }]}>
              <Ionicons name="bookmark" size={16} color={colors.accent} />
              <Text style={[styles.scriptureText, { color: isDark ? colors.accent : colors.primary }]}>
                የመነሻ ጥቅስ: {sermon.scripture_theme}
              </Text>
            </View>
          ) : null}

          {/* Play Audio Button */}
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: colors.primary }]} onPress={handlePlayAudio}>
            <Ionicons name="play-circle" size={24} color="#FFFFFF" />
            <Text style={styles.playBtnText}>ስብከቱን አዳምጥ (Play Sermon)</Text>
          </TouchableOpacity>
        </View>

        {/* Description Section */}
        {sermon?.description ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>የስብከቱ ማብራሪያ (Synopsis)</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {sermon.description}
            </Text>
          </View>
        ) : null}

        {/* Preacher Biography Section */}
        {sermon?.preacher?.biography ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>ስለ ሰባኪው (About Preacher)</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {sermon.preacher.biography}
            </Text>
          </View>
        ) : null}

        <View style={{ height: 80 }} />
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
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  preacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  preacherName: {
    fontSize: 15,
    fontWeight: '700',
  },
  preacherChurch: {
    fontSize: 12,
    marginTop: 2,
  },
  scriptureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  scriptureText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
