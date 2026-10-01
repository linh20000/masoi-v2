import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import { ROLE_CARD_IMAGES, SEAT_AVATAR_IMAGES } from '../theme/images';

export default function PrivateSeerResultScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.backBtnText}>‹ Màn Đêm</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👁️ KẾT QUẢ KHẢI HUYỀN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        {/* Tarot Result Card */}
        <View style={styles.resultCard}>
          <Image
            source={{ uri: ROLE_CARD_IMAGES.hunter }}
            style={styles.cardImg}
            resizeMode="contain"
          />
          <View style={styles.privacyTag}>
            <Text style={styles.privacyTagText}>🔒 MẮT THẦN CHỈ CHO BẠN THẤY</Text>
          </View>

          <Text style={styles.resultTitle}>THỦY TỔ KHẢI HUYỀN HOÀN TẤT</Text>
          <Text style={styles.targetName}>Ghế IV: Thợ Săn Bạc</Text>

          <View style={styles.factionBox}>
            <Text style={styles.factionLabel}>BẢN CHẤT LINH HỒN:</Text>
            <Text style={styles.factionName}>PHE DÂN LÀNG</Text>
          </View>

          <Text style={styles.resultDesc}>
            Mắt thần của bạn soi thấu tâm trí. Thợ Săn Bạc mang linh hồn thuần khiết, không có dấu vết ma thuật hắc ám hay vết cắn Ma Sói.
          </Text>
        </View>

        {/* Notebook Entry Confirmation */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>📖</Text>
          <Text style={styles.noteText}>
            Đã ghi nhận thông tin bí mật này vào Sổ Tay Tiên Tri cá nhân của bạn.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.closeBtnText}>✓ Đã Hiểu (Quay Về Màn Đêm)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 50, paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainer}E6`, borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  backBtn: {},
  backBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  headerTitle: { color: Colors.secondary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14, alignItems: 'center' },

  resultCard: {
    width: '100%', backgroundColor: Colors.surfaceContainerLow, borderRadius: 16,
    padding: 16, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: Colors.secondaryContainer,
  },
  cardImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Colors.secondary, marginBottom: 4 },
  privacyTag: { backgroundColor: `${Colors.secondaryContainer}40`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  privacyTagText: { color: Colors.secondary, fontSize: 9, fontWeight: '700' },

  resultTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  targetName: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },

  factionBox: {
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, alignItems: 'center', width: '100%',
  },
  factionLabel: { color: Colors.onSurfaceVariant, fontSize: 9, textTransform: 'uppercase' },
  factionName: { color: Colors.secondary, fontSize: 14, fontWeight: '700', marginTop: 2 },

  resultDesc: { color: Colors.onSurfaceVariant, fontSize: 11, textAlign: 'center', lineHeight: 16 },

  noteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%',
    backgroundColor: Colors.surfaceContainer, padding: 12, borderRadius: 10,
  },
  noteIcon: { fontSize: 16 },
  noteText: { color: Colors.tertiary, fontSize: 11, flex: 1 },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  closeBtn: {
    width: '100%', height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  closeBtnText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700' },
});
