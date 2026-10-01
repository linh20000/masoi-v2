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
import { SEAT_AVATAR_IMAGES, ROLE_CARD_IMAGES } from '../theme/images';

interface RevealedRole {
  seatNum: string;
  playerName: string;
  roleName: string;
  faction: 'Dân Làng' | 'Ma Sói';
  isAlive: boolean;
  cardKey: keyof typeof ROLE_CARD_IMAGES;
}

const REVEALED_ROLES: RevealedRole[] = [
  { seatNum: 'I', playerName: 'TrưởngLàng', roleName: 'Dân Làng Cổ Điển', faction: 'Dân Làng', isAlive: true, cardKey: 'villager' },
  { seatNum: 'II', playerName: 'BảoKê', roleName: 'Bảo Vệ Đêm', faction: 'Dân Làng', isAlive: true, cardKey: 'defender' },
  { seatNum: 'III', playerName: 'ThuốcNam', roleName: 'Phù Thủy', faction: 'Dân Làng', isAlive: true, cardKey: 'witch' },
  { seatNum: 'IV', playerName: 'ThợSăn', roleName: 'Thợ Săn Bạc', faction: 'Dân Làng', isAlive: true, cardKey: 'hunter' },
  { seatNum: 'V', playerName: 'BánhMì', roleName: 'Mộng Du', faction: 'Dân Làng', isAlive: false, cardKey: 'villager' },
  { seatNum: 'VI', playerName: 'ThầnĐạo', roleName: 'Sói Con', faction: 'Ma Sói', isAlive: true, cardKey: 'werewolf' },
  { seatNum: 'VII', playerName: 'TiênTri (Bạn)', roleName: 'Tiên Tri Khởi Thần', faction: 'Dân Làng', isAlive: true, cardKey: 'seer' },
  { seatNum: 'VIII', playerName: 'HiệpSĩ', roleName: 'Hiệp Sĩ Kiếm Gỉ', faction: 'Dân Làng', isAlive: true, cardKey: 'villager' },
  { seatNum: 'IX', playerName: 'HọcGiả', roleName: 'Sói Tuyết', faction: 'Ma Sói', isAlive: true, cardKey: 'werewolf' },
  { seatNum: 'X', playerName: 'BáTước', roleName: 'Ma Sói Thường', faction: 'Ma Sói', isAlive: false, cardKey: 'werewolf' },
  { seatNum: 'XI', playerName: 'CôĐảo', roleName: 'Dân Làng', faction: 'Dân Làng', isAlive: true, cardKey: 'villager' },
  { seatNum: 'XII', playerName: 'NữTuSĩ', roleName: 'Dân Làng', faction: 'Dân Làng', isAlive: true, cardKey: 'villager' },
];

export default function FinalRoleRevealScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🃏 BẢNG LẬT VAI TOÀN BỘ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>BÍ MẬT ĐƯỢC GIẢI MÃ</Text>
          <Text style={styles.bannerTitle}>Danh Sách Vai Trò 12 Người Chơi</Text>
          <Text style={styles.bannerSub}>Toàn bộ danh tính bí mật và phe phái được bạch hóa sau khi trận đấu khép lại.</Text>
        </View>

        <View style={styles.grid}>
          {REVEALED_ROLES.map((item) => (
            <View key={item.seatNum} style={[styles.roleCard, item.faction === 'Ma Sói' && styles.roleCardWolf]}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: SEAT_AVATAR_IMAGES[item.seatNum] }} style={styles.avatar} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.seatId}>Ghế {item.seatNum}</Text>
                  <Text style={styles.playerName} numberOfLines={1}>{item.playerName}</Text>
                </View>
                {!item.isAlive && <Text style={{ fontSize: 16 }}>💀</Text>}
              </View>

              <View style={styles.cardFooter}>
                <Text style={[styles.roleName, item.faction === 'Ma Sói' && styles.roleNameWolf]}>{item.roleName}</Text>
                <View style={[styles.factionTag, item.faction === 'Ma Sói' && styles.factionTagWolf]}>
                  <Text style={styles.factionTagText}>{item.faction}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Bar */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.doneBtn} onPress={() => onNavigate && onNavigate('GameOver')}>
          <Text style={styles.doneBtnText}>🏆 Quay Về Màn GameOver</Text>
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
  headerTitle: { color: Colors.tertiary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14 },

  banner: {
    backgroundColor: `${Colors.tertiaryContainer}30`, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: `${Colors.tertiary}40`, gap: 4,
  },
  bannerTag: { color: Colors.tertiary, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  roleCard: {
    width: '48%', backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 10, gap: 8,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  roleCardWolf: { borderColor: Colors.primaryContainer, backgroundColor: Colors.surfaceContainer },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  seatId: { color: Colors.outline, fontSize: 9, fontWeight: '700' },
  playerName: { color: Colors.onSurface, fontSize: 11, fontWeight: '700' },

  cardFooter: { gap: 4 },
  roleName: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },
  roleNameWolf: { color: Colors.primary },
  factionTag: { backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  factionTagWolf: { backgroundColor: Colors.primaryContainer },
  factionTagText: { color: Colors.onSurface, fontSize: 8, fontWeight: '700' },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  doneBtn: {
    width: '100%', height: 44, backgroundColor: Colors.tertiaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  doneBtnText: { color: Colors.tertiary, fontSize: 13, fontWeight: '700' },
});
