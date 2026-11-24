import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BilingualText } from '../../components/BilingualText';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { teachingsAPI } from '../../services/api';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState<number>(16);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      loadLesson(Number(id));
    }
  }, [id]);

  const loadLesson = async (lessonId: number) => {
    try {
      setLoading(true);
      const res = await teachingsAPI.getLessonDetail(lessonId);
      setLesson(res.data);
    } catch (err) {
      console.log('Error fetching lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const playLessonAudio = () => {
    if (!lesson || !lesson.audio_url) return;
    playTrack({
      id: 90000 + lesson.id,
      title_amharic: lesson.title_amharic,
      title_english: lesson.title_english,
      artist_name: lesson.author_or_teacher || 'ተዋሕዶ ትምህርት',
      audio_url: lesson.audio_url,
      cover_image: lesson.cover_image,
      duration_seconds: lesson.duration_minutes ? lesson.duration_minutes * 60 : 600,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>ትምህርቱን በመጫን ላይ...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="book-outline" size={48} color={colors.subtext} />
        <Text style={[styles.errorText, { color: colors.text }]}>ትምህርቱ አልተገኘም</Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>ተመለስ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="ትምህርተ ተዋሕዶ"
        titleEnglish="Spiritual Lesson"
        showBack
        rightAction={
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              onPress={() => setFontSize((prev) => Math.max(13, prev - 2))}
              style={styles.fontAdjustBtn}
            >
              <Text style={[styles.fontAdjustText, { color: colors.headerText }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize((prev) => Math.min(26, prev + 2))}
              style={styles.fontAdjustBtn}
            >
              <Text style={[styles.fontAdjustText, { color: colors.headerText }]}>A+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.bookmarkBtn}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? colors.secondary : colors.headerText}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <BilingualText
            amharic={lesson.title_amharic}
            english={lesson.title_english}
            amharicStyle={[styles.lessonTitleAm, { color: colors.text }]}
            englishStyle={[styles.lessonTitleEn, { color: colors.subtext }]}
          />
          {lesson.author_or_teacher ? (
            <Text style={[styles.teacherName, { color: colors.secondary }]}>
              አዘጋጅ/አስተማሪ፡ {lesson.author_or_teacher}
            </Text>
          ) : null}
        </View>

        {lesson.audio_url && (
          <TouchableOpacity
            style={[styles.audioCard, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={playLessonAudio}
          >
            <View style={styles.audioIconBox}>
              <Ionicons
                name={currentTrack?.id === 90000 + lesson.id && isPlaying ? 'pause' : 'volume-high'}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.audioTextBox}>
              <Text style={styles.audioTitleAm}>የትምህርቱን ድምፅ አዳምጥ</Text>
              <Text style={styles.audioSubEn}>Listen to audio lesson</Text>
            </View>
            <Ionicons name="play-circle" size={32} color="#D4AF37" />
          </TouchableOpacity>
        )}

        <View style={[styles.bodyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contentText, { color: colors.text, fontSize, lineHeight: fontSize * 1.6 }]}>
            {lesson.content_text || lesson.summary || 'ይህ ትምህርት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን እምነትና ቀኖና የሚያስረዳ መንፈሳዊ ትምህርት ነው።'}
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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontAdjustBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  fontAdjustText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookmarkBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  titleContainer: {
    marginBottom: 16,
  },
  lessonTitleAm: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  lessonTitleEn: {
    fontSize: 14,
    marginTop: 4,
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  audioIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTextBox: {
    flex: 1,
  },
  audioTitleAm: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  audioSubEn: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  bodyCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  contentText: {
    textAlign: 'left',
  },
});
