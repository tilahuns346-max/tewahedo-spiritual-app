import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BilingualText } from '../../components/BilingualText';
import { useTheme } from '../../context/ThemeContext';
import { videosAPI } from '../../services/api';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      loadVideo(Number(id));
    }
  }, [id]);

  const loadVideo = async (videoId: number) => {
    try {
      setLoading(true);
      const res = await videosAPI.getVideoDetail(videoId);
      setVideo(res.data);
    } catch (err) {
      console.log('Error fetching video detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const openYouTube = () => {
    if (!video) return;
    const url = video.youtube_id
      ? `https://www.youtube.com/watch?v=${video.youtube_id}`
      : video.video_url;
    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>ቪዲዮውን በመጫን ላይ...</Text>
      </View>
    );
  }

  if (!video) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
        <Text style={[styles.errorText, { color: colors.text }]}>ቪዲዮው አልተገኘም</Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>ተመለስ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="ቪዲዮ እይታ"
        titleEnglish="Watch Video"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.9} style={styles.videoPlayerBox} onPress={openYouTube}>
          <Image
            source={{
              uri:
                video.thumbnail_url ||
                `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`,
            }}
            style={styles.playerThumbnail}
            resizeMode="cover"
          />
          <View style={styles.bigPlayButton}>
            <Ionicons name="play" size={36} color="#FFFFFF" />
          </View>
          <View style={styles.watchNotice}>
            <Ionicons name="logo-youtube" size={16} color="#FF0000" />
            <Text style={styles.watchNoticeText}>በ YouTube ይመልከቱ (Watch on YouTube)</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.contentCard}>
          <BilingualText
            amharic={video.title_amharic}
            english={video.title_english}
            amharicStyle={[styles.mainTitleAm, { color: colors.text }]}
            englishStyle={[styles.mainTitleEn, { color: colors.subtext }]}
          />

          <View style={styles.metaRow}>
            {video.preacher_name ? (
              <View style={[styles.badge, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="person" size={12} color={colors.secondary} />
                <Text style={[styles.badgeText, { color: colors.secondary }]}>
                  {video.preacher_name}
                </Text>
              </View>
            ) : null}
            {video.views_count ? (
              <Text style={[styles.metaText, { color: colors.subtext }]}>
                {video.views_count} እይታዎች
              </Text>
            ) : null}
            {video.date_recorded ? (
              <Text style={[styles.metaText, { color: colors.subtext }]}>
                {video.date_recorded}
              </Text>
            ) : null}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.border }]}
              onPress={() => setIsFavorited(!isFavorited)}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorited ? colors.primary : colors.text}
              />
              <Text style={[styles.actionBtnText, { color: isFavorited ? colors.primary : colors.text }]}>
                {isFavorited ? 'የተወደደ' : 'ውደድ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border }]} onPress={openYouTube}>
              <Ionicons name="open-outline" size={20} color={colors.text} />
              <Text style={[styles.actionBtnText, { color: colors.text }]}>ክፈት</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionHeading, { color: colors.text }]}>ስለ ቪዲዮው ዝርዝር (Description)</Text>
          <Text style={[styles.descriptionText, { color: colors.subtext }]}>
            {video.description || 'ለዚህ ቪዲዮ ተጨማሪ ማብራሪያ አልተዘጋጀም።'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  backBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  videoPlayerBox: {
    width: '100%',
    height: 240,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerThumbnail: {
    width: '100%',
    height: '100%',
  },
  bigPlayButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(123, 17, 19, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  watchNotice: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  watchNoticeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    padding: 16,
  },
  mainTitleAm: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  mainTitleEn: {
    fontSize: 14,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
