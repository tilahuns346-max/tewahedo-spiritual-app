import React from 'react';
import { Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BilingualTextProps {
  primary: string;
  secondary?: string;
  primaryStyle?: TextStyle;
  secondaryStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  primary,
  secondary,
  primaryStyle,
  secondaryStyle,
  containerStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.primary, { color: colors.text }, primaryStyle]}>
        {primary}
      </Text>
      {secondary ? (
        <Text style={[styles.secondary, { color: colors.textSecondary }, secondaryStyle]}>
          {secondary}
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
