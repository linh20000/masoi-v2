import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

export const GameOverScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111317" />

      {/* HEADER */}
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
          <Text style={styles.avatarIconText}>👤</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* VICTORY BANNER */}
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

        {/* MVP SHOWCASE */}
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
              <Text style={styles.mvpAvatarEmoji}>🔮</Text>
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

          {/* MVP STATS */}
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

        {/* MATCH STATS */}
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
              <Text style={[styles.matchStatVal, { color: '#72d4ee' }]}>5 / 12</Text>
              <Text style={styles.matchStatSub}>Linh Hồn Sống</Text>
            </View>

            <View style={styles.matchStatBox}>
              <Text style={styles.matchStatIcon}>⏱️</Text>
              <Text style={[styles.matchStatVal, { color: '#f1be66' }]}>18:42</Text>
              <Text style={styles.matchStatSub}>Thời Lượng</Text>
            </View>
          </View>
        </View>

        {/* SURVIVORS HALL */}
        <View style={styles.survivorsCard}>
          <View style={styles.survivorsHeader}>
            <View style={styles.survivorsLeft}>
              <Text style={styles.survivorHeaderIcon}>🏆</Text>
              <Text style={styles.survivorHeaderTitle}>HỘI ĐỒNG DÂN LÀNG SỐNG SÓT</Text>
            </View>
            <Text style={styles.survivorCountTag}>4 Hộ Vệ</Text>
          </View>

          <View style={styles.survivorGrid}>
            <View style={styles.survivorTile}>
              <View style={styles.survivorAvatarBox}>
                <Text style={styles.survivorAvatarEmoji}>👑</Text>
                <Text style={styles.survivorSeatNum}>I</Text>
              </View>
              <View style={styles.survivorTextGroup}>
                <Text style={styles.survivorName}>Ghế I • Trưởng Làng</Text>
                <Text style={styles.survivorDesc}>2 Phiếu Quyết Định</Text>
              </View>
            </View>

            <View style={styles.survivorTile}>
              <View style={styles.survivorAvatarBox}>
                <Text style={styles.survivorAvatarEmoji}>🏹</Text>
                <Text style={styles.survivorSeatNum}>IV</Text>
              </View>
              <View style={styles.survivorTextGroup}>
                <Text style={styles.survivorName}>Ghế IV • Thợ Săn</Text>
                <Text style={styles.survivorDesc}>Đạn Bạc Sẵn Sàng</Text>
              </View>
            </View>

            <View style={[styles.survivorTile, styles.survivorUserTile]}>
              <View style={styles.survivorAvatarBox}>
                <Text style={styles.survivorAvatarEmoji}>🔮</Text>
                <Text style={[styles.survivorSeatNum, { backgroundColor: '#8a121a' }]}>VII</Text>
              </View>
              <View style={styles.survivorTextGroup}>
                <Text style={[styles.survivorName, { color: '#ffb3ae' }]}>Ghế VII • Bạn</Text>
                <Text style={styles.survivorDesc}>Tiên Tri Trác Tuyệt</Text>
              </View>
            </View>

            <View style={styles.survivorTile}>
              <View style={styles.survivorAvatarBox}>
                <Text style={styles.survivorAvatarEmoji}>🛡️</Text>
                <Text style={styles.survivorSeatNum}>VIII</Text>
              </View>
              <View style={styles.survivorTextGroup}>
                <Text style={styles.survivorName}>Ghế VIII • Bảo Kê</Text>
                <Text style={styles.survivorDesc}>Hộ Thân Thành Công</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 32, 35, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 138, 137, 0.15)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    color: '#e2e2e6',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  roomCodeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f1be66',
    letterSpacing: 1.5,
  },
  headerTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  avatarIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8a121a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIconText: {
    fontSize: 16,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  victoryCard: {
    backgroundColor: '#0c0e11',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1be66',
  },
  shieldGlowBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5c3f00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1be66',
    marginBottom: 8,
  },
  shieldIconText: {
    fontSize: 24,
  },
  subSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  goldLine: {
    width: 20,
    height: 1,
    backgroundColor: '#f1be66',
  },
  victoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f1be66',
    letterSpacing: 1,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  victorySubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 1,
    marginTop: 2,
  },
  loreBox: {
    backgroundColor: '#1e2023',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  loreText: {
    fontSize: 11,
    color: '#e0bfbc',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  mvpCard: {
    backgroundColor: '#1e2023',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(241, 190, 102, 0.3)',
  },
  mvpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mvpTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  militaryIcon: {
    fontSize: 16,
  },
  mvpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f1be66',
    letterSpacing: 1,
  },
  mvpHonorBadge: {
    backgroundColor: '#5c3f00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  mvpHonorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f1be66',
  },
  mvpPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mvpAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#333538',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mvpAvatarEmoji: {
    fontSize: 26,
  },
  seatBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#8a121a',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  seatBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  mvpInfo: {
    flex: 1,
  },
  mvpNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mvpName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  roleChip: {
    backgroundColor: 'rgba(50, 157, 182, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#72d4ee',
  },
  mvpTitleDesc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f1be66',
    marginTop: 2,
  },
  mvpAchievements: {
    fontSize: 11,
    color: '#e0bfbc',
    marginTop: 1,
  },
  mvpStatsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#111317',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 9,
    color: '#a78a87',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  statValueGood: {
    fontSize: 12,
    fontWeight: '700',
    color: '#72d4ee',
  },
  matchStatsCard: {
    backgroundColor: '#1e2023',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  matchStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchStatsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e0bfbc',
    letterSpacing: 1,
  },
  matchCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f1be66',
  },
  matchStatsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  matchStatBox: {
    flex: 1,
    backgroundColor: '#1a1c1f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  matchStatIcon: {
    fontSize: 16,
  },
  matchStatVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  matchStatSub: {
    fontSize: 9,
    color: '#a78a87',
    marginTop: 2,
  },
  survivorsCard: {
    backgroundColor: '#1e2023',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  survivorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  survivorsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  survivorHeaderIcon: {
    fontSize: 14,
  },
  survivorHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  survivorCountTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#72d4ee',
  },
  survivorGrid: {
    gap: 6,
  },
  survivorTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#282a2d',
    padding: 8,
    borderRadius: 8,
  },
  survivorUserTile: {
    backgroundColor: '#3f1014',
    borderWidth: 1,
    borderColor: '#8a121a',
  },
  survivorAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#333538',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  survivorAvatarEmoji: {
    fontSize: 16,
  },
  survivorSeatNum: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#111317',
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  survivorTextGroup: {
    flex: 1,
  },
  survivorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  survivorDesc: {
    fontSize: 10,
    color: '#a78a87',
  },
  actionGroup: {
    gap: 8,
    marginTop: 4,
  },
  revealAllBtn: {
    height: 46,
    backgroundColor: '#8a121a',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnEyeIcon: {
    fontSize: 16,
  },
  revealAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  timelineBtn: {
    height: 44,
    backgroundColor: '#282a2d',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1be66',
    letterSpacing: 0.5,
  },
  backHomeBtn: {
    height: 44,
    backgroundColor: '#1a1c1f',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backHomeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e2e6',
  },
});

export default GameOverScreen;
