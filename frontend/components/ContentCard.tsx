import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  categoryTag?: string;
  imageUrl?: string;
  duration?: string;
  onPress: () => void;
  onPlayPress?: () => void;
  style?: ViewStyle;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  categoryTag,
  imageUrl,
  duration,
  onPress,
  onPlayPress,
  style,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Thumbnail or Fallback Icon */}
      <View style={styles.imageContainer}>
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require('../assets/images/app_logo_cross.png')
          }
          style={styles.image}
          resizeMode="cover"
        />
        {onPlayPress ? (
          <TouchableOpacity
            style={[styles.playOverlay, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            onPress={onPlayPress}
          >
            <View style={[styles.playIconCircle, { backgroundColor: colors.accent }]}>
              <Ionicons name="play" size={18} color="#7B1113" style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Info Container */}
      <View style={styles.info}>
        {categoryTag ? (
          <View style={[styles.tag, { backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(123, 17, 19, 0.08)' }]}>
            <Text style={[styles.tagText, { color: isDark ? colors.accent : colors.primary }]}>
              {categoryTag}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.bottomRow}>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}

          {duration ? (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                {duration}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  durationText: {
    fontSize: 12,
    marginLeft: 3,
  },
});

export default ContentCard;
