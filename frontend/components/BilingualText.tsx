import React from 'react';
import { Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BilingualTextProps {
  primary?: string;
  secondary?: string;
  amharic?: string;
  english?: string;
  primaryStyle?: TextStyle | TextStyle[];
  secondaryStyle?: TextStyle | TextStyle[];
  amharicStyle?: TextStyle | TextStyle[];
  englishStyle?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  primary,
  secondary,
  amharic,
  english,
  primaryStyle,
  secondaryStyle,
  amharicStyle,
  englishStyle,
  containerStyle,
}) => {
  const { colors } = useTheme();

  const textPrimary = amharic || primary || '';
  const textSecondary = english || secondary;
  const stylePrimary = amharicStyle || primaryStyle;
  const styleSecondary = englishStyle || secondaryStyle;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.primary, { color: colors.text }, stylePrimary]}>
        {textPrimary}
      </Text>
      {textSecondary ? (
        <Text style={[styles.secondary, { color: colors.textSecondary }, styleSecondary]}>
          {textSecondary}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  primary: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  secondary: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginTop: 2,
  },
});

export default BilingualText;
