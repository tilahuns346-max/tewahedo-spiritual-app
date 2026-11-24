import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ContentCard } from '../../components/ContentCard';
import { api } from '../../services/api';

export default function WudaseListScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWudaseDays()
      .then((res) => setDays(res || []))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReadToday = async () => {
    try {
      const today = await api.getTodayWudase();
      if (today?.day_code) {
        router.push(`/wudase/${today.day_code}` as any);
      }
    } catch {
      router.push('/wudase/monday' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="ውዳሴ ማርያም" subtitle="የሰባቱ ቀናት ምስጋና" showBack onBack={() => router.back()} />

      {/* Today's Praise Shortcut Banner */}
      <TouchableOpacity
        style={[styles.todayBanner, { backgroundColor: isDark ? colors.surface : colors.primary }]}
        activeOpacity={0.88}
        onPress={handleReadToday}
      >
        <View style={styles.todayBannerLeft}>
          <Ionicons name="sparkles" size={24} color={colors.accent} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.todayBannerTitle}>የዕለቱን ውዳሴ ማርያም አንብብ</Text>
            <Text style={styles.todayBannerSubtitle}>የዛሬውን ጸሎት በቀጥታ ይጀምሩ</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-circle" size={32} color={colors.accent} />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>ውዳሴ ማርያም በመጫን ላይ...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {days.map((d) => (
            <ContentCard
              key={d.id}
              title={`${d.name_geez} (${d.name_amharic})`}
              subtitle={d.theme_summary}
              categoryTag="ውዳሴ ማርያም"
              duration={`${d.stanza_count || 0} አንቀጾች`}
              onPress={() => router.push(`/wudase/${d.day_code}` as any)}
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
  todayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
  },
  todayBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todayBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  todayBannerSubtitle: {
    fontSize: 12,
    color: '#F3E5AB',
    marginTop: 2,
  },
  list: {
    paddingBottom: 20,
  },
});
