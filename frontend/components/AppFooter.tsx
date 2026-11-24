import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const AppFooter: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={styles.badgeRow}>
        <Ionicons name="code-slash" size={14} color={colors.secondary} />
        <Text style={[styles.developerText, { color: colors.text }]}>
          Developed by <Text style={[styles.highlightText, { color: colors.primary }]}>Diakon Solomon Tilahun</Text>
        </Text>
      </View>
      <Text style={[styles.titleSub, { color: colors.subtext }]}>
        Software Engineering Student • ተዋሕዶ ሚዲያ
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    zIndex: 99,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  developerText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  highlightText: {
    fontWeight: 'bold',
  },
  titleSub: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default AppFooter;
