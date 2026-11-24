import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ContentCard } from '../../components/ContentCard';
import { api } from '../../services/api';

export default function PrayersListScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [prayers, setPrayers] = useState<any[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const occasions = [
    { label: 'ሁሉም (All)', value: null },
    { label: 'የዘወትር (Daily)', value: 'ANYTIME' },
    { label: 'የማለዳ (Morning)', value: 'MORNING' },
    { label: 'የሠርክ (Evening)', value: 'EVENING' },
    { label: 'የሌሊት / ሰዓታት', value: 'NIGHT' },
  ];

  const loadData = async (occ?: string | null) => {
    try {
      const res = await api.getPrayerBooks({ occasion: occ || undefined });
      setPrayers(res?.results || []);
    } catch (err) {
      console.warn('Error loading prayers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(selectedOccasion);
  }, [selectedOccasion]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedOccasion);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="መጽሐፈ ጸሎት" subtitle="የዘወትርና የሰዓታት ጸሎታት" showBack onBack={() => router.back()} />

      {/* Occasions Filter */}
      <View style={styles.occasionsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.occasionsList}>
          {occasions.map((o, idx) => {
            const isSelected = selectedOccasion === o.value;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.occasionPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedOccasion(o.value)}
              >
                <Text
                  style={[
                    styles.occasionText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {o.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>ጸሎታት በመጫን ላይ...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.list}
        >
          {prayers.map((prayer) => (
            <ContentCard
              key={prayer.id}
              title={`${prayer.title_geez} (${prayer.title_amharic})`}
              subtitle={prayer.summary}
              categoryTag={prayer.occasion_time_display}
              duration={`${prayer.section_count || 0} ክፍሎች`}
              onPress={() => router.push(`/prayers/${prayer.id}` as any)}
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
  occasionsWrapper: {
    marginVertical: 8,
  },
  occasionsList: {
    paddingHorizontal: 16,
  },
  occasionPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  occasionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    paddingVertical: 6,
  },
});
