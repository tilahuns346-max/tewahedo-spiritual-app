import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BilingualText } from '../../components/BilingualText';
import { useTheme } from '../../context/ThemeContext';
import { videosAPI } from '../../services/api';

export default function VideosScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, vidsRes] = await Promise.all([
        videosAPI.getCategories(),
        videosAPI.getVideos(selectedCategory ? { category: selectedCategory } : {}),
      ]);
      setCategories(catsRes.data.results || catsRes.data || []);
      setVideos(vidsRes.data.results || vidsRes.data || []);
    } catch (err) {
      console.log('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((v: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.title_amharic?.toLowerCase().includes(q) ||
      v.title_english?.toLowerCase().includes(q) ||
      v.preacher_name?.toLowerCase().includes(q)
    );
  });

  const renderVideoItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/videos/${item.id}` as any)}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{
              uri:
                item.thumbnail_url ||
                `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`,
            }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playBadge}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
          </View>
          {item.duration_seconds > 0 && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {Math.floor(item.duration_seconds / 60)}:
                {(item.duration_seconds % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <BilingualText
            amharic={item.title_amharic}
            english={item.title_english}
            amharicStyle={[styles.videoTitleAm, { color: colors.text }]}
            englishStyle={[styles.videoTitleEn, { color: colors.subtext }]}
          />
          {item.preacher_name ? (
            <Text style={[styles.preacherName, { color: colors.secondary }]}>
              {item.preacher_name}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.subtext }]}>
              {item.views_count || 0} እይታዎች
            </Text>
            {item.date_recorded && (
              <Text style={[styles.metaText, { color: colors.subtext }]}>
                {item.date_recorded}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="ቪዲዮ ቤተ-መጻሕፍት"
        titleEnglish="Spiritual Video Library"
        subtitle="ትምህርቶች፣ ስብከቶች፣ እና የመንፈሳዊ መድረክ ቪዲዮዎች"
        showBack
      />

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.subtext} />
          <TextInput
            placeholder="ቪዲዮዎችን ፈልግ (Search videos)..."
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name_amharic: 'ሁሉም', name_english: 'All' }, ...categories]}
          keyExtractor={(item) => (item.id === null ? 'all' : item.id.toString())}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {item.name_amharic}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.subtext }]}>
            ቪዲዮዎችን በማዘጋጀት ላይ...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={54} color={colors.subtext} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                ምንም ቪዲዮ አልተገኘም
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
                እባክዎ ሌላ ምድብ ወይም ፍለጋ ይሞክሩ
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  categoriesSection: {
    marginVertical: 4,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 90,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    width: '100%',
    height: 190,
    backgroundColor: '#000',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(123, 17, 19, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 14,
  },
  videoTitleAm: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  videoTitleEn: {
    fontSize: 13,
    marginTop: 2,
  },
  preacherName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  metaText: {
    fontSize: 11,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});
