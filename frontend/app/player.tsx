import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function FullPlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const {
    currentTrack,
    isPlaying,
    positionMs,
    durationMs,
    playbackRate,
    repeatMode,
    isShuffle,
    resumeTrack,
    pauseTrack,
    seekTo,
    playNext,
    playPrevious,
    setPlaybackRate,
    toggleRepeat,
    toggleShuffle,
  } = useAudio();

  const [showLyrics, setShowLyrics] = useState(false);

  if (!currentTrack) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="chevron-down" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={[styles.noTrackText, { color: colors.textSecondary }]}>ምንም የተመረጠ መዝሙር የለም</Text>
        </View>
      </View>
    );
  }

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekTouch = (e: any) => {
    const { locationX } = e.nativeEvent;
    const barWidth = width - 48;
    const ratio = Math.max(0, Math.min(locationX / barWidth, 1));
    seekTo(ratio * durationMs);
  };

  const handleRateCycle = () => {
    const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIdx = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIdx + 1) % rates.length];
    setPlaybackRate(nextRate);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B131F' : '#580C1F', paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.topAction}>
          <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>በማዳመጥ ላይ (Now Playing)</Text>
        <TouchableOpacity onPress={() => setShowLyrics(!showLyrics)} style={styles.topAction}>
          <Ionicons
            name={showLyrics ? 'musical-notes' : 'document-text-outline'}
            size={24}
            color={showLyrics ? '#D4AF37' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {showLyrics ? (
          /* Lyrics View */
          <View style={styles.lyricsContainer}>
            <Text style={styles.lyricsHeader}>የመዝሙር ስንኞች (Lyrics)</Text>
            <Text style={styles.lyricsText}>
              {currentTrack.lyrics_amharic || currentTrack.lyrics_geez || 'የዚህ መዝሙር ስንኞች በቅርቡ ይካተታሉ።'}
            </Text>
          </View>
        ) : (
          /* Album Artwork with Saint Icon */
          <View style={styles.artworkContainer}>
            <View style={styles.artworkGlow}>
              <Image
                source={
                  currentTrack.cover_image
                    ? { uri: currentTrack.cover_image }
                    : require('../assets/images/saint_monk.png')
                }
                style={styles.artworkImage}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* Track Info */}
        <View style={styles.trackInfoSection}>
          <Text style={styles.trackTitle} numberOfLines={2}>
            {currentTrack.title_amharic}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentTrack.artist_name || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
          </Text>
        </View>

        {/* Progress Bar & Timestamps */}
        <View style={styles.progressSection}>
          <TouchableOpacity activeOpacity={1} onPress={handleSeekTouch} style={styles.progressBarWrapper}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarActive, { width: `${progress * 100}%` }]} />
              <View style={[styles.scrubberThumb, { left: `${progress * 100}%` }]} />
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
          </View>
        </View>

        {/* Secondary Controls: Repeat, Rate, Shuffle */}
        <View style={styles.secondaryControlsRow}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.secondaryBtn}>
            <Ionicons
              name="shuffle"
              size={22}
              color={isShuffle ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRateCycle} style={styles.rateBadge}>
            <Text style={styles.rateText}>{playbackRate}x</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRepeat} style={styles.secondaryBtn}>
            <Ionicons
              name={repeatMode === 'track' ? 'repeat' : repeatMode === 'queue' ? 'repeat' : 'repeat-outline'}
              size={22}
              color={repeatMode !== 'off' ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)'}
            />
            {repeatMode === 'track' ? <Text style={styles.repeatBadge}>1</Text> : null}
          </TouchableOpacity>
        </View>

        {/* Primary Controls: Prev, Play/Pause, Next */}
        <View style={styles.mainControlsRow}>
          <TouchableOpacity onPress={playPrevious} style={styles.skipBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pauseTrack : resumeTrack}
            style={styles.playPauseBtn}
            activeOpacity={0.88}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={38}
              color="#7B1113"
              style={!isPlaying ? { marginLeft: 4 } : undefined}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.skipBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: Math.max(insets.bottom, 24) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topAction: {
    padding: 6,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  artworkContainer: {
    width: width * 0.76,
    height: width * 0.76,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkGlow: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.76) / 2,
    borderWidth: 3,
    borderColor: '#D4AF37',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  lyricsContainer: {
    width: '100%',
    height: width * 0.76,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
  },
  lyricsHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 8,
  },
  lyricsText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  trackInfoSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3E5AB',
    marginTop: 6,
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
    marginTop: 20,
  },
  progressBarWrapper: {
    height: 24,
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    position: 'relative',
  },
  progressBarActive: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  scrubberThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  secondaryControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 14,
  },
  secondaryBtn: {
    padding: 8,
    position: 'relative',
  },
  rateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  rateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  repeatBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 9,
    color: '#D4AF37',
    fontWeight: '800',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  skipBtn: {
    padding: 16,
  },
  playPauseBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    elevation: 8,
  },
  closeBtn: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTrackText: {
    fontSize: 16,
  },
});
