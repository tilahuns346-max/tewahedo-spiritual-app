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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { Header } from '../../components/Header';
import { ContentCard } from '../../components/ContentCard';
import { api } from '../../services/api';

export default function AudioScreen() {
  const { colors, isDark } = useTheme();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (catSlug?: string | null, search?: string) => {
    try {
      const [catsRes, tracksRes] = await Promise.all([
        api.getAudioCategories().catch(() => []),
        api.getAudioTracks({
          category: catSlug || undefined,
          search: search || undefined,
        }).catch(() => ({ results: [] })),
      ]);

      setCategories(catsRes || []);
      setTracks(tracksRes?.results || []);
    } catch (err) {
      console.warn('Error loading audio tracks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearch = () => {
    loadData(selectedCategory, searchQuery);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedCategory, searchQuery);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="በድምፅ" subtitle="መዝሙርና መንፈሳዊ ዜማዎች" />

      {/* Search Input Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="መዝሙር፣ ዘማሪ ወይም ርእስ ይፈልጉ..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => { setSearchQuery(''); loadData(selectedCategory, ''); }}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories Horizontal Tabs */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          <TouchableOpacity
            style={[
              styles.categoryPill,
              {
                backgroundColor: selectedCategory === null ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryPillText,
                { color: selectedCategory === null ? '#FFFFFF' : colors.text },
              ]}
            >
              ሁሉም (All)
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.slug)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {cat.name_amharic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Track List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>መዝሙራት በመጫን ላይ...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {tracks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>ምንም መዝሙር አልተገኘም</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                እባክዎ ሌላ ምድብ ወይም ቃል ይፈልጉ።
              </Text>
            </View>
          ) : (
            tracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const formattedDuration = `${Math.floor(track.duration_seconds / 60)}:${(track.duration_seconds % 60).toString().padStart(2, '0')}`;
              return (
                <ContentCard
                  key={track.id}
                  title={track.title_amharic}
                  subtitle={track.artist_name || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
                  categoryTag={track.category_name}
                  duration={formattedDuration}
                  onPress={() => playTrack(track, tracks)}
                  onPlayPress={() => playTrack(track, tracks)}
                  style={isCurrent ? { borderColor: colors.accent, borderWidth: 1.5 } : undefined}
                />
              );
            })
          )}
          <View style={{ height: 90 }} />
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
  categoriesWrapper: {
    marginVertical: 6,
  },
  categoriesList: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
});
