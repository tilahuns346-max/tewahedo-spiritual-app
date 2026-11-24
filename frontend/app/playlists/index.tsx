import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { activityAPI } from '../../services/api';

export default function PlaylistsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPlaylists();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await activityAPI.getPlaylists();
      setPlaylists(res.data.results || res.data || []);
    } catch (err) {
      console.log('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) return;
    try {
      setCreating(true);
      await activityAPI.createPlaylist({
        title: newPlaylistTitle.trim(),
        description: 'የግል መዝሙራትና ትምህርቶች ማጫወቻ ዝርዝር',
      });
      setNewPlaylistTitle('');
      setModalVisible(false);
      loadPlaylists();
    } catch (err) {
      console.log('Error creating playlist:', err);
      Alert.alert('ስህተት', 'ዝርዝሩን መፍጠር አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="የግል ማጫወቻ ዝርዝሮች"
        titleEnglish="My Playlists"
        subtitle="የተመረጡ መዝሙራትና ስብከቶች"
        showBack
        rightAction={
          isAuthenticated && (
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
              <Ionicons name="add-circle" size={28} color={colors.secondary} />
            </TouchableOpacity>
          )
        }
      />

      {!isAuthenticated ? (
        <View style={styles.centerNotice}>
          <Ionicons name="lock-closed-outline" size={56} color={colors.subtext} />
          <Text style={[styles.noticeTitle, { color: colors.text }]}>ይግቡ ወይም ይመዝገቡ</Text>
          <Text style={[styles.noticeSub, { color: colors.subtext }]}>
            የግል ማጫወቻ ዝርዝር ለማዘጋጀት እባክዎ ወደ መለያዎ ይግቡ።
          </Text>
          <TouchableOpacity
            style={[styles.authActionBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={styles.authActionText}>ይግቡ (Sign In)</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.centerNotice}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingLabel, { color: colors.subtext }]}>ዝርዝሮችን በማዘጋጀት ላይ...</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.playlistCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => {}}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="musical-notes" size={26} color={colors.primary} />
              </View>
              <View style={styles.playlistInfo}>
                <Text style={[styles.playlistTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.playlistSubtitle, { color: colors.subtext }]}>
                  {item.items_count || 0} ዝማሬዎች • {item.description || 'የግል ዝርዝር'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={50} color={colors.subtext} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>ምንም ማጫወቻ ዝርዝር አልተገኘም</Text>
              <Text style={[styles.emptySub, { color: colors.subtext }]}>
                ከላይ ያለውን + በመንካት አዲስ ማጫወቻ ዝርዝር ይፍጠሩ።
              </Text>
            </View>
          }
        />
      )}

      {/* Modal to create a playlist */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>አዲስ ማጫወቻ ዝርዝር</Text>
            <Text style={[styles.modalSub, { color: colors.subtext }]}>Create New Playlist</Text>

            <TextInput
              placeholder="የዝርዝሩ ስም (ለምሳሌ፡ የበዓለ ትንሣኤ መዝሙራት)"
              placeholderTextColor={colors.subtext}
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={newPlaylistTitle}
              onChangeText={setNewPlaylistTitle}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>ይቅር (Cancel)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreatePlaylist}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>ፍጠር (Create)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 90,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  centerNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
  },
  noticeSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  authActionBtn: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  authActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
