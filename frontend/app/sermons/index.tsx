import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
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

export default function SermonsListScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [preachers, setPreachers] = useState<any[]>([]);
  const [selectedPreacher, setSelectedPreacher] = useState<number | null>(null);
  const [sermons, setSermons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (preacherId?: number | null, search?: string) => {
    try {
      const [preachersRes, sermonsRes] = await Promise.all([
        api.getPreachers().catch(() => ({ results: [] })),
        api.getSermons({
          preacher: preacherId || undefined,
          search: search || undefined,
        }).catch(() => ({ results: [] })),
      ]);

      setPreachers(preachersRes?.results || []);
      setSermons(sermonsRes?.results || []);
    } catch (err) {
      console.warn('Error loading sermons:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(selectedPreacher, searchQuery);
  }, [selectedPreacher]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedPreacher, searchQuery);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="ስብሐታት / ስብከት" subtitle="የመምህራን ትምህርቶች" showBack onBack={() => router.back()} />

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="ስብከት ወይም ሰባኪ ይፈልጉ..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => loadData(selectedPreacher, searchQuery)}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
        />
      </View>

      {/* Preachers Filter Pills */}
      <View style={styles.preachersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.preachersList}>
          <TouchableOpacity
            style={[
              styles.preacherPill,
              {
                backgroundColor: selectedPreacher === null ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedPreacher(null)}
          >
            <Text
              style={[
                styles.preacherPillText,
                { color: selectedPreacher === null ? '#FFFFFF' : colors.text },
              ]}
            >
              ሁሉም ሰባክያን
            </Text>
          </TouchableOpacity>

          {preachers.map((preacher) => {
            const isSelected = selectedPreacher === preacher.id;
            return (
              <TouchableOpacity
                key={preacher.id}
                style={[
                  styles.preacherPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedPreacher(preacher.id)}
              >
                <Text
                  style={[
                    styles.preacherPillText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {preacher.name_amharic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sermons List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>ስብከቶች በመጫን ላይ...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {sermons.map((sermon) => (
            <ContentCard
              key={sermon.id}
              title={sermon.title_amharic}
              subtitle={`${sermon.preacher_name || ''} • ${sermon.scripture_theme || ''}`}
              categoryTag={sermon.category_name || 'ስብከት'}
              duration={`${Math.floor(sermon.audio_duration_seconds / 60)} ደቂቃ`}
              onPress={() => router.push(`/sermons/${sermon.id}` as any)}
              onPlayPress={() => {
                playTrack({
                  id: sermon.id + 40000,
                  title_amharic: sermon.title_amharic,
                  artist_name: sermon.preacher_name,
                  audio_url: sermon.audio_url || 'https://example.com/sermons/glory_tewahedo.mp3',
                  duration_seconds: sermon.audio_duration_seconds || 3600,
                  category_name: 'ስብከት',
                });
              }}
            />
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
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
    marginTop: 10,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  preachersWrapper: {
    marginVertical: 6,
  },
  preachersList: {
    paddingHorizontal: 16,
  },
  preacherPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  preacherPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
