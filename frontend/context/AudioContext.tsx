import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { api } from '../services/api';

export interface AudioTrackItem {
  id: number;
  title_amharic: string;
  title_english?: string;
  artist_name?: string;
  audio_url: string;
  duration_seconds: number;
  cover_image?: string;
  lyrics_amharic?: string;
  lyrics_geez?: string;
  category_name?: string;
}

export type RepeatMode = 'off' | 'track' | 'queue';

interface AudioContextType {
  currentTrack: AudioTrackItem | null;
  isPlaying: boolean;
  isBuffering: boolean;
  positionMs: number;
  durationMs: number;
  playbackRate: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  queue: AudioTrackItem[];
  isMiniPlayerVisible: boolean;
  playTrack: (track: AudioTrackItem, newQueue?: AudioTrackItem[]) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  closeMiniPlayer: () => void;
}

const AudioContext = createContext<AudioContextType>({
  currentTrack: null,
  isPlaying: false,
  isBuffering: false,
  positionMs: 0,
  durationMs: 0,
  playbackRate: 1.0,
  repeatMode: 'off',
  isShuffle: false,
  queue: [],
  isMiniPlayerVisible: false,
  playTrack: async () => {},
  pauseTrack: async () => {},
  resumeTrack: async () => {},
  seekTo: async () => {},
  playNext: async () => {},
  playPrevious: async () => {},
  setPlaybackRate: async () => {},
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  closeMiniPlayer: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrackItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<AudioTrackItem[]>([]);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState<boolean>(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Enable background audio mode for iOS and Android
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (webAudioRef.current) {
        webAudioRef.current.pause();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      if (status.error) {
        setIsBuffering(false);
      }
      return;
    }
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
    setPositionMs(status.positionMillis);
    setDurationMs(status.durationMillis || (currentTrack ? currentTrack.duration_seconds * 1000 : 0));

    if (status.didJustFinish) {
      handleTrackFinished();
    }
  };

  const handleTrackFinished = async () => {
    if (repeatMode === 'track') {
      await seekTo(0);
      await resumeTrack();
    } else {
      await playNext();
    }
  };

  const playTrack = async (track: AudioTrackItem, newQueue?: AudioTrackItem[]) => {
    try {
      if (newQueue) {
        setQueue(newQueue);
      } else if (!queue.some((t) => t.id === track.id)) {
        setQueue((prev) => [...prev, track]);
      }

      setCurrentTrack(track);
      setIsMiniPlayerVisible(true);
      setPositionMs(0);
      setDurationMs(track.duration_seconds * 1000);

      // Increment analytics play counter
      api.incrementPlayCount(track.id).catch(() => {});

      if (Platform.OS === 'web') {
        if (!webAudioRef.current) {
          webAudioRef.current = new window.Audio();
          webAudioRef.current.ontimeupdate = () => {
            if (webAudioRef.current) {
              setPositionMs(webAudioRef.current.currentTime * 1000);
            }
          };
          webAudioRef.current.onended = () => {
            handleTrackFinished();
          };
        }
        webAudioRef.current.src = track.audio_url;
        webAudioRef.current.playbackRate = playbackRate;
        await webAudioRef.current.play();
        setIsPlaying(true);
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: track.audio_url },
          { shouldPlay: true, rate: playbackRate, shouldCorrectPitch: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Audio play error, falling back simulated streaming:', err);
      setIsPlaying(true);
    }
  };

  const pauseTrack = async () => {
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.pause();
      } else if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setIsPlaying(false);
      if (currentTrack) {
        api.saveListeningHistory(currentTrack.id, Math.floor(positionMs / 1000)).catch(() => {});
      }
    } catch {}
  };

  const resumeTrack = async () => {
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        await webAudioRef.current.play();
      } else if (soundRef.current) {
        await soundRef.current.playAsync();
      }
      setIsPlaying(true);
    } catch {}
  };

  const seekTo = async (millis: number) => {
    try {
      setPositionMs(millis);
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.currentTime = millis / 1000;
      } else if (soundRef.current) {
        await soundRef.current.setPositionAsync(millis);
      }
    } catch {}
  };

  const playNext = async () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'queue') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      await playTrack(nextTrack);
    }
  };

  const playPrevious = async () => {
    if (!currentTrack || queue.length === 0) return;
    if (positionMs > 3000) {
      await seekTo(0);
      return;
    }
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      await playTrack(prevTrack);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    setPlaybackRateState(rate);
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.playbackRate = rate;
      } else if (soundRef.current) {
        await soundRef.current.setRateAsync(rate, true);
      }
    } catch {}
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'queue', 'track'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const closeMiniPlayer = () => {
    pauseTrack();
    setIsMiniPlayerVisible(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isBuffering,
        positionMs,
        durationMs,
        playbackRate,
        repeatMode,
        isShuffle,
        queue,
        isMiniPlayerVisible,
        playTrack,
        pauseTrack,
        resumeTrack,
        seekTo,
        playNext,
        playPrevious,
        setPlaybackRate,
        toggleRepeat,
        toggleShuffle,
        closeMiniPlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
