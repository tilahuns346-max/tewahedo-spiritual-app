import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ContentCard } from '../../components/ContentCard';
import { api } from '../../services/api';

export default function KidaseListScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [anaphoras, setAnaphoras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getAnaphoras();
      setAnaphoras(res?.results || []);
    } catch (err) {
      console.warn('Error loading anaphoras:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="ሥርዓተ ቅዳሴ" subtitle="አኰቴተ ቍርባን (Anaphoras)" showBack onBack={() => router.back()} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>ቅዳሴያት በመጫን ላይ...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.list}
        >
          {anaphoras.map((anaphora) => (
            <ContentCard
              key={anaphora.id}
              title={`${anaphora.title_geez} (${anaphora.title_amharic})`}
              subtitle={`ደራሲ: ${anaphora.author_father} • ${anaphora.liturgical_season_used || ''}`}
              categoryTag="ቅዳሴ"
              duration={`${Math.floor(anaphora.audio_duration_seconds / 60)} ደቂቃ`}
              onPress={() => router.push(`/kidase/${anaphora.id}` as any)}
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
  list: {
    paddingVertical: 10,
  },
});
