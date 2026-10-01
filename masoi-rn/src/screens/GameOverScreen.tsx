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
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';

export default function GameOverScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => onNavigate && onNavigate('Home')}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.roomCodeText}>ROOM #8921</Text>
          <Text style={styles.headerTitleText}>VERDICT SUMMARY</Text>
        </View>

        <View style={styles.avatarIcon}>
          <Image
            source={{ uri: SEAT_AVATAR_IMAGES.VII }}
            style={styles.avatarIconImg}
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.victoryCard}>
          <View style={styles.shieldGlowBadge}>
            <Text style={styles.shieldIconText}>🛡️</Text>
          </View>

          <View style={styles.subSubtitleRow}>
            <View style={styles.goldLine} />
            <Text style={styles.victoryTag}>THÁI BÌNH TRỞ LẠI</Text>
            <View style={styles.goldLine} />
          </View>

          <Text style={styles.victoryTitle}>DÂN LÀNG TOÀN THẮNG</Text>
          <Text style={styles.victorySubtitle}>VILLAGE VICTORY • KHÚC CA BÌNH MINH</Text>

          <View style={styles.loreBox}>
            <Text style={styles.loreText}>
              "Tất cả Ma Sói đã bị thanh trừng khỏi Làng Cổ Oakvale. Màn sương máu dần tan biến, trật tự bình minh và ngọn đuốc thiêng đã trở lại."
            </Text>
          </View>
        </View>

        <View style={styles.mvpCard}>
          <View style={styles.mvpCardHeader}>
            <View style={styles.mvpTitleGroup}>
              <Text style={styles.militaryIcon}>🎖️</Text>
              <Text style={styles.mvpLabel}>MVP TRẬN ĐẤU</Text>
            </View>
            <View style={styles.mvpHonorBadge}>
              <Text style={styles.mvpHonorText}>VINH DANH NHẤT TRẬN</Text>
            </View>
          </View>

          <View style={styles.mvpPlayerRow}>
            <View style={styles.mvpAvatarBox}>
              <Image
                source={{ uri: SEAT_AVATAR_IMAGES.VII }}
                style={styles.mvpAvatarImg}
                resizeMode="cover"
              />
              <View style={styles.seatBadge}>
                <Text style={styles.seatBadgeText}>VII</Text>
              </View>
            </View>

            <View style={styles.mvpInfo}>
              <View style={styles.mvpNameRow}>
                <Text style={styles.mvpName}>Ghế VII • Bạn</Text>
                <View style={styles.roleChip}>
                  <Text style={styles.roleChipText}>TIÊN TRI</Text>
                </View>
              </View>
              <Text style={styles.mvpTitleDesc}>BẬC THẦY SOI LINH HỒN</Text>
              <Text style={styles.mvpAchievements}>Vạch mặt 2 Ma Sói • Sống sót tới bình minh</Text>
            </View>
          </View>

          <View style={styles.mvpStatsGrid}>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>👁️</Text>
              <View>
                <Text style={styles.statLabel}>Soi Trúng Sói</Text>
                <Text style={styles.statValue}>2 / 2</Text>
              </View>
            </View>

            <View style={styles.statPill}>
              <Text style={styles.statIcon}>❤️</Text>
              <View>
                <Text style={styles.statLabel}>Trạng Thái Cuối</Text>
                <Text style={styles.statValueGood}>Sống Sót</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.matchStatsCard}>
          <View style={styles.matchStatsHeader}>
            <Text style={styles.matchStatsTitle}>THÔNG SỐ TRẬN CHIẾN</Text>
            <Text style={styles.matchCode}>#OAK-8921</Text>
          </View>

          <View style={styles.matchStatsGrid}>
            <View style={styles.matchStatBox}>
              <Text style={styles.matchStatIcon}>⏳</Text>
              <Text style={styles.matchStatVal}>3 Đêm 3 Ngày</Text>
              <Text style={styles.matchStatSub}>Số Vòng Đấu</Text>
            </View>

            <View style={styles.matchStatBox}>
              <Text style={styles.matchStatIcon}>👥</Text>
              <Text style={[styles.matchStatVal, { color: Colors.secondary }]}>5 / 12</Text>
              <Text style={styles.matchStatSub}>Linh Hồn Sống</Text>
            </View>

            <View style={styles.matchStatBox}>
              <Text style={styles.matchStatIcon}>⏱️</Text>
              <Text style={[styles.matchStatVal, { color: Colors.tertiary }]}>18:42</Text>
              <Text style={styles.matchStatSub}>Thời Lượng</Text>
            </View>
          </View>
        </View>

        <View style={styles.survivorsCard}>
          <View style={styles.survivorsHeader}>
            <View style={styles.survivorsLeft}>
              <Text style={styles.survivorHeaderIcon}>🏆</Text>
              <Text style={styles.survivorHeaderTitle}>HỘI ĐỒNG DÂN LÀNG SỐNG SÓT</Text>
            </View>
            <Text style={styles.survivorCountTag}>4 Hộ Vệ</Text>
          </View>

          <View style={styles.survivorGrid}>
            {[
              { seat: 'I', name: 'Ghế I • Trưởng Làng', desc: '2 Phiếu Quyết Định' },
              { seat: 'IV', name: 'Ghế IV • Thợ Săn', desc: 'Đạn Bạc Sẵn Sàng' },
              { seat: 'VII', name: 'Ghế VII • Bạn', desc: 'Tiên Tri Trác Tuyệt', isUser: true },
              { seat: 'VIII', name: 'Ghế VIII • Bảo Kê', desc: 'Hộ Thân Thành Công' },
            ].map((survivor) => (
              <View
                key={survivor.seat}
                style={[styles.survivorTile, survivor.isUser && styles.survivorUserTile]}
              >
                <View style={styles.survivorAvatarBox}>
                  <Image
                    source={{ uri: SEAT_AVATAR_IMAGES[survivor.seat] }}
                    style={styles.survivorAvatarImg}
                    resizeMode="cover"
                  />
                  <Text style={[styles.survivorSeatNum, survivor.isUser && { backgroundColor: Colors.primaryContainer }]}>
                    {survivor.seat}
                  </Text>
                </View>
                <View style={styles.survivorTextGroup}>
                  <Text style={[styles.survivorName, survivor.isUser && { color: Colors.primary }]}>
                    {survivor.name}
                  </Text>
                  <Text style={styles.survivorDesc}>{survivor.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={styles.revealAllBtn}
            onPress={() => onNavigate && onNavigate('RoleReveal')}
          >
            <Text style={styles.btnEyeIcon}>👁️</Text>
            <Text style={styles.revealAllBtnText}>LẬT BÀI TOÀN BỘ VAI TRÒ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timelineBtn}
            onPress={() => onNavigate && onNavigate('RoleCatalog')}
          >
            <Text style={styles.timelineIcon}>📚</Text>
            <Text style={styles.timelineBtnText}>XEM BÁCH KHOA VAI TRÒ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => onNavigate && onNavigate('Home')}
          >
            <Text style={styles.backHomeBtnText}>🏠 TRỞ VỀ MÀN HÌNH CHÍNH</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: `${Colors.surfaceContainer}D9`,
    borderBottomWidth: 1, borderBottomColor: `${Colors.outline}26`,
  },
  closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 20, color: Colors.onSurface },
  headerTitleBox: { alignItems: 'center' },
  roomCodeText: { fontSize: 9, fontWeight: '700', color: Colors.tertiary, letterSpacing: 1.5 },
  headerTitleText: { fontSize: 13, fontWeight: '700', color: Colors.onSurface, letterSpacing: 1 },
  avatarIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryContainer,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.tertiary,
  },
  avatarIconImg: { width: '100%', height: '100%' },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 14, gap: 12 },
  victoryCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.tertiary,
  },
  shieldGlowBadge: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.tertiaryContainer,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.tertiary,
    marginBottom: 8,
  },
  shieldIconText: { fontSize: 24 },
  subSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  goldLine: { width: 20, height: 1, backgroundColor: Colors.tertiary },
  victoryTag: { fontSize: 10, fontWeight: '700', color: Colors.tertiary, letterSpacing: 1 },
  victoryTitle: { fontSize: 22, fontWeight: '700', color: Colors.onSurface, letterSpacing: 1.5 },
  victorySubtitle: { fontSize: 10, fontWeight: '700', color: Colors.primary, letterSpacing: 1, marginTop: 2 },
  loreBox: { backgroundColor: Colors.surfaceContainer, padding: 10, borderRadius: 8, marginTop: 10, width: '100%' },
  loreText: { fontSize: 11, color: Colors.onSurfaceVariant, fontStyle: 'italic', textAlign: 'center', lineHeight: 16 },
  mvpCard: {
    backgroundColor: Colors.surfaceContainer, borderRadius: 14, padding: 14, gap: 12,
    borderWidth: 1, borderColor: `${Colors.tertiary}4D`,
  },
  mvpCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mvpTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  militaryIcon: { fontSize: 16 },
  mvpLabel: { fontSize: 11, fontWeight: '700', color: Colors.tertiary, letterSpacing: 1 },
  mvpHonorBadge: { backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  mvpHonorText: { fontSize: 9, fontWeight: '700', color: Colors.tertiary },
  mvpPlayerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mvpAvatarBox: {
    width: 52, height: 52, borderRadius: 12, backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden',
  },
  mvpAvatarImg: { width: '100%', height: '100%', borderRadius: 12 },
  seatBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 4, borderRadius: 4, zIndex: 10,
  },
  seatBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.onPrimaryContainer },
  mvpInfo: { flex: 1 },
  mvpNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mvpName: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  roleChip: { backgroundColor: `${Colors.secondaryContainer}4D`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  roleChipText: { fontSize: 9, fontWeight: '700', color: Colors.secondary },
  mvpTitleDesc: { fontSize: 11, fontWeight: '700', color: Colors.tertiary, marginTop: 2 },
  mvpAchievements: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 1 },
  mvpStatsGrid: { flexDirection: 'row', gap: 8 },
  statPill: {
    flex: 1, backgroundColor: Colors.surfaceContainerLowest, padding: 8, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  statIcon: { fontSize: 16 },
  statLabel: { fontSize: 9, color: Colors.outline },
  statValue: { fontSize: 12, fontWeight: '700', color: Colors.onSurface },
  statValueGood: { fontSize: 12, fontWeight: '700', color: Colors.secondary },
  matchStatsCard: { backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 12, gap: 10 },
  matchStatsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchStatsTitle: { fontSize: 11, fontWeight: '700', color: Colors.onSurfaceVariant, letterSpacing: 1 },
  matchCode: { fontSize: 11, fontWeight: '700', color: Colors.tertiary },
  matchStatsGrid: { flexDirection: 'row', gap: 8 },
  matchStatBox: { flex: 1, backgroundColor: Colors.surfaceContainerLow, padding: 10, borderRadius: 8, alignItems: 'center' },
  matchStatIcon: { fontSize: 16 },
  matchStatVal: { fontSize: 13, fontWeight: '700', color: Colors.onSurface, marginTop: 2 },
  matchStatSub: { fontSize: 9, color: Colors.outline, marginTop: 2 },
  survivorsCard: { backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 12, gap: 10 },
  survivorsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  survivorsLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  survivorHeaderIcon: { fontSize: 14 },
  survivorHeaderTitle: { fontSize: 11, fontWeight: '700', color: Colors.onSurface, letterSpacing: 0.5 },
  survivorCountTag: { fontSize: 10, fontWeight: '700', color: Colors.secondary },
  survivorGrid: { gap: 6 },
  survivorTile: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainerHigh, padding: 8, borderRadius: 8,
  },
  survivorUserTile: { backgroundColor: Colors.primaryContainer, borderWidth: 1, borderColor: Colors.primary },
  survivorAvatarBox: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden',
  },
  survivorAvatarImg: { width: '100%', height: '100%', borderRadius: 18 },
  survivorSeatNum: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.surfaceDim,
    fontSize: 8, fontWeight: '700', color: Colors.onSurface, paddingHorizontal: 3, borderRadius: 2, zIndex: 10,
  },
  survivorTextGroup: { flex: 1 },
  survivorName: { fontSize: 12, fontWeight: '600', color: Colors.onSurface },
  survivorDesc: { fontSize: 10, color: Colors.outline },
  actionGroup: { gap: 8, marginTop: 4 },
  revealAllBtn: {
    height: 46, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnEyeIcon: { fontSize: 16 },
  revealAllBtnText: { fontSize: 13, fontWeight: '700', color: Colors.onPrimaryContainer, letterSpacing: 1 },
  timelineBtn: {
    height: 44, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  timelineIcon: { fontSize: 16 },
  timelineBtnText: { fontSize: 12, fontWeight: '700', color: Colors.tertiary, letterSpacing: 0.5 },
  backHomeBtn: { height: 44, backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  backHomeBtnText: { fontSize: 12, fontWeight: '700', color: Colors.onSurface },
});
