import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AudioProvider } from '../context/AudioContext';
import { MiniPlayer } from '../components/MiniPlayer';
import { AppFooter } from '../components/AppFooter';
import { View, StyleSheet } from 'react-native';

function RootLayoutNav() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="player"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen name="kidase/index" options={{ headerShown: false }} />
        <Stack.Screen name="kidase/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="wudase/index" options={{ headerShown: false }} />
        <Stack.Screen name="wudase/[day]" options={{ headerShown: false }} />
        <Stack.Screen name="prayers/index" options={{ headerShown: false }} />
        <Stack.Screen name="prayers/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="sermons/index" options={{ headerShown: false }} />
        <Stack.Screen name="sermons/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="videos/index" options={{ headerShown: false }} />
        <Stack.Screen name="videos/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="calendar/index" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="playlists/index" options={{ headerShown: false }} />
        <Stack.Screen name="downloads/index" options={{ headerShown: false }} />
      </Stack>

      {/* Global Persistent Mini-player */}
      <MiniPlayer />

      {/* Global Footer on every page */}
      <AppFooter />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AudioProvider>
            <RootLayoutNav />
          </AudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
