import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';

export default function DownloadsScreen() {
  const { colors } = useTheme();

  // Mock offline download items stored locally
  const [downloadedItems, setDownloadedItems] = useState([
    {
      id: 'd1',
      title: 'ውዳሴ ማርያም (ዘሰኑይ)',
      type: 'prayer',
      size: '240 KB',
      date: 'ኅዳር 15, 2017',
    },
    {
      id: 'd2',
      title: 'ሥርዓተ ቅዳሴ - ሠለስቱ ምዕት',
      type: 'kidase',
      size: '1.2 MB',
      date: 'ኅዳር 14, 2017',
    },
    {
      id: 'd3',
      title: 'ጸሎተ ሃይማኖት (የሃይማኖት ጸሎት)',
      type: 'book',
      size: '85 KB',
      date: 'ኅዳር 10, 2017',
    },
  ]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('ፋይል ሰርዝ', `"${title}" ከወረዱ ፋይሎች ውስጥ ይሰረዝ?`, [
      { text: 'ይቅር', style: 'cancel' },
      {
        text: 'ሰርዝ',
        style: 'destructive',
        onPress: () => {
          setDownloadedItems((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return 'musical-note';
      case 'prayer':
        return 'book-outline';
      case 'kidase':
        return 'flame';
      default:
        return 'document-text-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        titleAmharic="የወረዱ ፋይሎች"
        titleEnglish="Offline Downloads"
        subtitle="ያለ ኢንተርኔት ለማንበብና ለማዳመጥ የተዘጋጁ"
        showBack
      />

      <View style={styles.storageStatusBox}>
        <View style={styles.storageTextRow}>
          <Text style={[styles.storageTitle, { color: colors.text }]}>የስልኩ ማከማቻ (Storage Used)</Text>
          <Text style={[styles.storageUsed, { color: colors.secondary }]}>1.5 MB የወረደ</Text>
        </View>
        <View style={[styles.storageBarTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.storageBarFill, { backgroundColor: colors.primary, width: '8%' }]} />
        </View>
      </View>

      <FlatList
        data={downloadedItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name={getIcon(item.type) as any} size={22} color={colors.primary} />
            </View>

            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.itemMeta, { color: colors.subtext }]}>
                {item.size} • {item.date}
              </Text>
            </View>

            <TouchableOpacity onPress={() => handleDelete(item.id, item.title)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-download-outline" size={54} color={colors.subtext} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>የወረደ ፋይል የለም</Text>
            <Text style={[styles.emptySub, { color: colors.subtext }]}>
              ጸሎት ወይም መዝሙር በማውረድ ያለ ኢንተርኔት ይጠቀሙ።
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storageStatusBox: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  storageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  storageUsed: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  storageBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  storageBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 90,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
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
});
