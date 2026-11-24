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

export default function KidaseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playTrack } = useAudio();

  const [anaphora, setAnaphora] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadAnaphora(Number(id));
    }
  }, [id]);

  const loadAnaphora = async (anaphoraId: number) => {
    try {
      const data = await api.getAnaphoraDetail(anaphoraId);
      setAnaphora(data);
      setSections(data.sections || []);
    } catch (err) {
      console.warn('Error loading anaphora:', err);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { label: 'ሁሉም (All)', value: null },
    { label: 'ካህን (Priest)', value: 'PRIEST' },
    { label: 'ዲያቆን (Deacon)', value: 'DEACON' },
    { label: 'ሕዝብ (People)', value: 'PEOPLE' },
  ];

  const filteredSections = selectedRole
    ? sections.filter((s) => s.liturgical_role === selectedRole)
    : sections;

  const handlePlayLiturgy = () => {
    if (!anaphora) return;
    playTrack({
      id: anaphora.id + 10000,
      title_amharic: anaphora.title_amharic,
      artist_name: anaphora.author_father,
      audio_url: anaphora.audio_url || 'https://example.com/audio/kidase_apostles.mp3',
      duration_seconds: anaphora.audio_duration_seconds || 3600,
      category_name: 'ቅዳሴ',
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
        title={anaphora?.title_amharic || 'ሥርዓተ ቅዳሴ'}
        subtitle={anaphora?.title_geez}
        showBack
        onBack={() => router.back()}
      />

      {/* Liturgical Info & Audio Trigger Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.anaphoraTitle, { color: colors.text }]}>
              {anaphora?.title_geez}
            </Text>
            <Text style={[styles.anaphoraMeta, { color: colors.primary }]}>
              ደራሲ: {anaphora?.author_father}
            </Text>
            {anaphora?.liturgical_season_used ? (
              <Text style={[styles.seasonMeta, { color: colors.textSecondary }]}>
                የሚቀደስበት ወቅት: {anaphora?.liturgical_season_used}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity style={[styles.playLiturgyBtn, { backgroundColor: colors.accent }]} onPress={handlePlayLiturgy}>
            <Ionicons name="play" size={24} color="#7B1113" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Font Scaling & Role Filter Toolbar */}
        <View style={[styles.toolbar, { borderTopColor: colors.border }]}>
          {/* Roles Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScrollView}>
            {roles.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.rolePill,
                  {
                    backgroundColor: selectedRole === r.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedRole(r.value)}
              >
                <Text
                  style={[
                    styles.roleText,
                    { color: selectedRole === r.value ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Font Controls */}
          <View style={styles.fontControls}>
            <TouchableOpacity onPress={() => setFontSize(Math.max(12, fontSize - 2))} style={styles.fontBtn}>
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(Math.min(26, fontSize + 2))} style={styles.fontBtn}>
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Liturgical Sections List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sectionsList}>
        {filteredSections.map((sec) => {
          const isPriest = sec.liturgical_role === 'PRIEST';
          const isDeacon = sec.liturgical_role === 'DEACON';
          const roleColor = isPriest ? '#7B1113' : isDeacon ? '#D4AF37' : '#2563EB';

          return (
            <View
              key={sec.id}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {/* Speaker Role Badge */}
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
                  <Text style={styles.roleBadgeText}>{sec.liturgical_role_display}</Text>
                </View>
                {sec.section_title ? (
                  <Text style={[styles.secTitle, { color: colors.textSecondary }]}>
                    {sec.section_title}
                  </Text>
                ) : null}
              </View>

              {/* Ge'ez Liturgical Text */}
              <Text style={[styles.geezText, { fontSize: fontSize + 1, color: colors.text }]}>
                {sec.text_geez}
              </Text>

              {/* Amharic Liturgical Translation */}
              <Text style={[styles.amharicText, { fontSize, color: isDark ? '#E2E8F0' : '#334155' }]}>
                {sec.text_amharic}
              </Text>

              {/* Liturgical Explanation */}
              {sec.explanation ? (
                <View style={[styles.explanationBox, { backgroundColor: isDark ? 'rgba(212,175,55,0.08)' : '#FFFBEB' }]}>
                  <Text style={[styles.explanationText, { color: isDark ? colors.accent : '#92400E' }]}>
                    {sec.explanation}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
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
  infoCard: {
    margin: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  anaphoraTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  anaphoraMeta: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  seasonMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  playLiturgyBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  roleScrollView: {
    flex: 1,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fontControls: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  fontBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
  },
  fontBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionsList: {
    paddingHorizontal: 16,
  },
  sectionCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  secTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  geezText: {
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 8,
  },
  amharicText: {
    lineHeight: 25,
    fontWeight: '500',
  },
  explanationBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
});
