import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { BilingualText } from '../../components/BilingualText';
import { useTheme } from '../../context/ThemeContext';
import { dailyAPI, saintsAPI } from '../../services/api';

const ETHIOPIAN_MONTHS = [
  { id: 1, name_amharic: 'መስከረም', name_english: 'Meskerem', days: 30 },
  { id: 2, name_amharic: 'ጥቅምት', name_english: 'Tikimt', days: 30 },
  { id: 3, name_amharic: 'ኅዳር', name_english: 'Hidar', days: 30 },
  { id: 4, name_amharic: 'ታኅሣሥ', name_english: 'Tahsas', days: 30 },
  { id: 5, name_amharic: 'ጥር', name_english: 'Tir', days: 30 },
  { id: 6, name_amharic: 'የካቲት', name_english: 'Yekatit', days: 30 },
  { id: 7, name_amharic: 'መጋቢት', name_english: 'Megabit', days: 30 },
  { id: 8, name_amharic: 'ሚያዝያ', name_english: 'Miyazya', days: 30 },
  { id: 9, name_amharic: 'ግንቦት', name_english: 'Ginbot', days: 30 },
  { id: 10, name_amharic: 'ሰኔ', name_english: 'Sene', days: 30 },
  { id: 11, name_amharic: 'ሐምሌ', name_english: 'Hamle', days: 30 },
  { id: 12, name_amharic: 'ነሐሴ', name_english: 'Nehase', days: 30 },
  { id: 13, name_amharic: 'ጳጉሜን', name_english: 'Pagumen', days: 5 },
];

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // default Hidar
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [todayData, setTodayData] = useState<any>(null);
  const [fastingSeasons, setFastingSeasons] = useState<any[]>([]);
  const [daySaints, setDaySaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
  }, []);

  useEffect(() => {
    loadDayDetails(currentMonthIndex + 1, selectedDay);
  }, [currentMonthIndex, selectedDay]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const [todayRes, fastRes] = await Promise.all([
        dailyAPI.getToday(),
        dailyAPI.getFastingSeasons(),
      ]);
      setTodayData(todayRes.data);
      setFastingSeasons(fastRes.data.results || fastRes.data || []);
      if (todayRes.data?.ethiopian_date) {
        const m = todayRes.data.ethiopian_date.month - 1;
        const d = todayRes.data.ethiopian_date.day;
        if (m >= 0 && m < 13) setCurrentMonthIndex(m);
        if (d >= 1 && d <= 30) setSelectedDay(d);
      }
    } catch (err) {
      console.log('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDayDetails = async (month: number, day: number) => {
    try {
      const res = await saintsAPI.getSaints({
        ethiopian_month: month,
        ethiopian_day: day,
      });
      setDaySaints(res.data.results || res.data || []);
    } catch (err) {
      console.log('Error loading day saints:', err);
    }
  };

  const currentMonth = ETHIOPIAN_MONTHS[currentMonthIndex];
  const daysArray = Array.from({ length: currentMonth.days }, (_, i) => i + 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ የቀን መቁጠሪያ"
        titleEnglish="Ethiopian Liturgical Calendar"
        subtitle="የዕለቱ ቅዱሳን፣ በዓላትና አጽዋማት"
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Month Selector Carousel */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 12))}
            style={[styles.arrowButton, { borderColor: colors.border }]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.monthTitleBox}>
            <Text style={[styles.monthNameAm, { color: colors.primary }]}>{currentMonth.name_amharic}</Text>
            <Text style={[styles.monthNameEn, { color: colors.subtext }]}>{currentMonth.name_english}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setCurrentMonthIndex((prev) => (prev < 12 ? prev + 1 : 0))}
            style={[styles.arrowButton, { borderColor: colors.border }]}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Days Grid */}
        <View style={[styles.calendarGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {daysArray.map((day) => {
            const isSelected = selectedDay === day;
            const isToday =
              todayData?.ethiopian_date?.month === currentMonth.id &&
              todayData?.ethiopian_date?.day === day;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.dayCell,
                  isSelected && { backgroundColor: colors.primary },
                  isToday && !isSelected && { borderWidth: 2, borderColor: colors.secondary },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                    isToday && !isSelected && { color: colors.secondary, fontWeight: 'bold' },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Day Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="calendar-outline" size={24} color={colors.secondary} />
            <Text style={[styles.infoDateTitle, { color: colors.text }]}>
              {currentMonth.name_amharic} {selectedDay} ቀን
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.primary }]}>የዕለቱ ቅዱሳንና መታሰቢያዎች (Saints & Feasts)</Text>

          {daySaints.length > 0 ? (
            daySaints.map((saint) => (
              <View key={saint.id} style={styles.saintItem}>
                <Ionicons name="ribbon-outline" size={18} color={colors.secondary} />
                <View style={styles.saintTextWrap}>
                  <Text style={[styles.saintAm, { color: colors.text }]}>{saint.name_amharic}</Text>
                  {saint.name_geez ? (
                    <Text style={[styles.saintGeez, { color: colors.secondary }]}>{saint.name_geez}</Text>
                  ) : null}
                  {saint.feast_title ? (
                    <Text style={[styles.saintFeast, { color: colors.subtext }]}>{saint.feast_title}</Text>
                  ) : null}
                  {saint.biography ? (
                    <Text style={[styles.saintBio, { color: colors.text }]}>{saint.biography}</Text>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyDayNotice, { color: colors.subtext }]}>
              ለዚህ ዕለት የተመዘገበ ዝርዝር የስንክሳር ንባብ አልተገኘም።
            </Text>
          )}
        </View>

        {/* Fasting Seasons Section */}
        <View style={styles.fastingContainer}>
          <Text style={[styles.fastingTitle, { color: colors.text }]}>
            የአጽዋማት መመሪያ (Fasting Seasons)
          </Text>
          {fastingSeasons.map((fast) => (
            <View
              key={fast.id}
              style={[styles.fastCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.fastHeader}>
                <Ionicons name="flame" size={18} color={colors.primary} />
                <Text style={[styles.fastNameAm, { color: colors.text }]}>{fast.name_amharic}</Text>
                {fast.is_major && (
                  <View style={[styles.majorBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.majorBadgeText}>ዐቢይ ጾም</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.fastNameEn, { color: colors.subtext }]}>{fast.name_english}</Text>
              <Text style={[styles.fastDesc, { color: colors.subtext }]}>
                {fast.description || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቀኖናዊ ጾም።'}
              </Text>
              <View style={styles.fastDuration}>
                <Ionicons name="time-outline" size={14} color={colors.secondary} />
                <Text style={[styles.durationLabel, { color: colors.secondary }]}>
                  የጾም ዘመን፡ {fast.duration_days} ቀናት
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitleBox: {
    alignItems: 'center',
  },
  monthNameAm: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthNameEn: {
    fontSize: 13,
    marginTop: 2,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  dayCell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  saintItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  saintTextWrap: {
    flex: 1,
  },
  saintAm: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  saintGeez: {
    fontSize: 13,
    marginTop: 2,
  },
  saintFeast: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  saintBio: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  emptyDayNotice: {
    fontSize: 13,
    paddingVertical: 10,
  },
  fastingContainer: {
    gap: 12,
  },
  fastingTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fastCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  fastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fastNameAm: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  majorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  majorBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fastNameEn: {
    fontSize: 12,
    marginTop: 2,
  },
  fastDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  fastDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
