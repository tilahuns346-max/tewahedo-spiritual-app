import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

export const MiniPlayer: React.FC = () => {
  const router = useRouter();
  const { currentTrack, isPlaying, isMiniPlayerVisible, positionMs, durationMs, resumeTrack, pauseTrack, playNext, closeMiniPlayer } = useAudio();
  const { colors, isDark } = useTheme();

  if (!isMiniPlayerVisible || !currentTrack) {
    return null;
  }

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;

  const handleOpenPlayer = () => {
    router.push('/player');
  };

  const togglePlay = (e: any) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    playNext();
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    closeMiniPlayer();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handleOpenPlayer}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surface : colors.primary,
          borderTopColor: colors.border,
        },
      ]}
    >
      {/* Progress Bar Line */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
      </View>

      <View style={styles.contentRow}>
        {/* Cover Art / Saint Icon */}
        <Image
          source={
            currentTrack.cover_image
              ? { uri: currentTrack.cover_image }
              : require('../assets/images/app_logo_cross.png')
          }
          style={styles.coverArt}
          resizeMode="cover"
        />

        {/* Track Title and Singer */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title_amharic}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist_name || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ'}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlay} style={styles.playButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={36}
              color={colors.accent}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.controlButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="play-skip-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.controlButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={20} color="#E5E7EB" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  coverArt: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  artist: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    paddingHorizontal: 6,
  },
  controlButton: {
    paddingHorizontal: 8,
  },
});

export default MiniPlayer;
