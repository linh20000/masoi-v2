import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const GAME_MODES = [
  {
    id: 'classic',
    icon: '👥',
    name: 'Cổ Điển (Classic)',
    players: '8-12 Người',
    desc: 'Cân bằng kinh điển: Dân Làng, Sói, Tiên Tri, Thợ Săn, Bảo Vệ',
    rooms: 42,
    color: Colors.primaryContainer,
    textColor: Colors.onPrimaryContainer,
  },
  {
    id: 'bloodmoon',
    icon: '🩸',
    name: 'Rừng Huyết Nguyệt',
    players: '12-16 Người',
    desc: 'Thêm Phù Thủy, Cupid Tình Yêu, Kẻ Thổi Sáo, Kẻ Phản Bội',
    rooms: 28,
    color: Colors.errorContainer,
    textColor: Colors.onErrorContainer,
  },
];

const PUBLIC_ROOMS = [
  { id: '#8921', name: 'Sói Trăng Máu Đi Đêm', host: 'HuânTướcBóngĐêm', scenario: 'Cổ điển', current: 9, max: 12, voice: true },
  { id: '#4012', name: 'Làng Vui Vẻ - Bật Mic Nhé', host: 'CôBéQuàngKhănĐỏ', scenario: 'Tân thủ', current: 7, max: 8, voice: false, almostFull: true },
  { id: '#7734', name: 'Chỉ Pro - Phân Tích Logic', host: 'ThầyPhùThủy', scenario: 'Huyết Nguyệt', current: 11, max: 15, locked: true },
];

export default function HomeScreen({ navigation }: Props) {
  const [roomCode, setRoomCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickMatch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      navigation.navigate('Lobby');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerIcon}>🌙</Text>
            <Text style={styles.headerTitle}>MA SÓI ONLINE</Text>
          </View>
          <View style={styles.serverRow}>
            <View style={styles.serverDot} />
            <Text style={styles.serverText}>Máy chủ: Hà Nội (24ms)</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>Hiệp Sĩ Đêm</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv.14</Text>
              </View>
            </View>
            <Text style={styles.userRole}>🛡️ Dân Làng</Text>
          </View>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroGradient} />
          <View style={styles.heroBannerContent}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>✨ MÙA 4: BẢN GIAO HƯỞNG HUYẾT NGUYỆT</Text>
              </View>
              <View style={styles.dpBadge}>
                <Text style={styles.dpText}>🏆 1,850 DP</Text>
              </View>
            </View>
            <View>
              <Text style={styles.heroTitle}>Đêm Định Mệnh</Text>
              <Text style={styles.heroSubtitle}>⚠️ Lời nguyền rừng thẳm trỗi dậy - Trăng máu đạt đỉnh sau 03:14:20</Text>
            </View>
          </View>
          <View style={styles.heroBannerBottom}>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineLabel}>SỐ NGƯỜI TRỰC TUYẾN:</Text>
              <Text style={styles.onlineCount}>4,812</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.detailBtn}>Chi Tiết Mùa ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          {/* Quick Match */}
          <TouchableOpacity
            style={styles.quickMatchBtn}
            onPress={handleQuickMatch}
            activeOpacity={0.85}
          >
            <View style={styles.quickMatchLeft}>
              <View style={styles.quickMatchIconBox}>
                <Text style={styles.quickMatchIcon}>⚡</Text>
              </View>
              <View>
                <Text style={styles.quickMatchTitle}>
                  {isSearching ? 'ĐANG TÌM PHÒNG...' : 'Vào Trận Nhanh'}
                </Text>
                <Text style={styles.quickMatchSubtitle}>Ghép ngẫu nhiên vào phòng chờ phù hợp nhất</Text>
              </View>
            </View>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>

          {/* Sub action row */}
          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => navigation.navigate('Lobby')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.tertiaryContainer }]}>
                  <Text>🛡️+</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.tertiary }]}>TẠO PHÒNG TÙY CHỈNH</Text>
              <Text style={styles.subActionDesc}>Kịch bản 6-20 người, vai trò riêng</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.subActionBtn} activeOpacity={0.8}>
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.secondaryContainer }]}>
                  <Text>🔢</Text>
                </View>
                <Text style={styles.subActionArrow}>📷</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.secondary }]}>NHẬP MÃ PHÒNG</Text>
              <Text style={styles.subActionDesc}>Mã 4-6 ký tự hoặc quét QR</Text>
            </TouchableOpacity>
          </View>

          {/* Code input bar */}
          <View style={styles.codeInputBar}>
            <View style={styles.codeInputWrapper}>
              <Text style={styles.hashTag}>#</Text>
              <TextInput
                style={styles.codeInput}
                placeholder="Nhập mã phòng (VD: 8921)"
                placeholderTextColor={Colors.outlineVariant}
                value={roomCode}
                onChangeText={setRoomCode}
                maxLength={6}
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity style={styles.qrBtn}>
              <Text>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => roomCode.length >= 4 && navigation.navigate('Lobby')}
            >
              <Text style={styles.joinBtnText}>Vào</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Modes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>🃏</Text>
              <Text style={styles.sectionTitle}>CHẾ ĐỘ CHƠI THẦN BÍ</Text>
            </View>
            <Text style={styles.sectionCount}>4 KỊCH BẢN</Text>
          </View>

          {GAME_MODES.map((mode) => (
            <TouchableOpacity key={mode.id} style={styles.modeCard} activeOpacity={0.85}>
              <View style={styles.modeCardTop}>
                <View style={styles.modeCardLeft}>
                  <View style={[styles.modeIcon, { backgroundColor: mode.color }]}>
                    <Text style={{ fontSize: 22 }}>{mode.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.modeNameRow}>
                      <Text style={styles.modeName}>{mode.name}</Text>
                      <View style={[styles.modePlayerBadge, { backgroundColor: mode.color }]}>
                        <Text style={[styles.modePlayerText, { color: mode.textColor }]}>{mode.players}</Text>
                      </View>
                    </View>
                    <Text style={styles.modeDesc} numberOfLines={2}>{mode.desc}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.modeCardBottom}>
                <View style={styles.modeRoomRow}>
                  <View style={[styles.modeRoomDot, { backgroundColor: mode.id === 'bloodmoon' ? Colors.error : Colors.secondary }]} />
                  <Text style={styles.modeRoomCount}>{mode.rooms} phòng đang mở</Text>
                </View>
                <TouchableOpacity
                  style={styles.joinModeBtn}
                  onPress={() => navigation.navigate('Lobby')}
                >
                  <Text style={styles.joinModeBtnText}>Tham Gia ▶</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {/* Mini mode grid - Ranked & Training */}
          <View style={styles.miniModeGrid}>
            <TouchableOpacity style={styles.miniModeCard}>
              <View style={styles.miniModeHeader}>
                <View style={[styles.miniModeIcon, { backgroundColor: Colors.tertiaryContainer }]}>
                  <Text style={{ fontSize: 16 }}>🏆</Text>
                </View>
                <View style={[styles.miniModeBadge, { backgroundColor: Colors.tertiary }]}>
                  <Text style={styles.miniModeBadgeText}>Ranked</Text>
                </View>
              </View>
              <Text style={styles.miniModeTitle}>Đấu Hạng ELO</Text>
              <Text style={styles.miniModeDesc} numberOfLines={2}>Bắt buộc Voice Mic. Xử phạt AFK nghiêm ngặt.</Text>
              <View style={styles.miniModeBottom}>
                <Text style={[styles.miniModeStat, { color: Colors.tertiary }]}>Tier: Bạc II</Text>
                <Text style={styles.miniModeArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.miniModeCard}>
              <View style={styles.miniModeHeader}>
                <View style={[styles.miniModeIcon, { backgroundColor: Colors.surfaceContainerHighest }]}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                </View>
                <View style={[styles.miniModeBadge, { backgroundColor: Colors.surfaceBright }]}>
                  <Text style={styles.miniModeBadgeText}>AI/Solo</Text>
                </View>
              </View>
              <Text style={styles.miniModeTitle}>Tập Luyện & Bot</Text>
              <Text style={styles.miniModeDesc} numberOfLines={2}>Tập đọc suy luận, thử nghiệm toàn bộ vai trò mới.</Text>
              <View style={styles.miniModeBottom}>
                <Text style={[styles.miniModeStat, { color: Colors.secondary }]}>Miễn phí</Text>
                <Text style={styles.miniModeArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Public Rooms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>🚪</Text>
              <Text style={styles.sectionTitle}>SẢNH CHỜ CÔNG KHAI</Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn}>
              <Text style={styles.refreshBtnText}>↻ Làm mới</Text>
            </TouchableOpacity>
          </View>

          {/* Filter pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['Tất cả (114)', '8 Người', '12 Người', '16 Người', '🔒 Có Mật Khẩu'].map((label, i) => (
              <TouchableOpacity
                key={label}
                style={[styles.filterPill, i === 0 && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, i === 0 && styles.filterPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rooms */}
          {PUBLIC_ROOMS.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <View style={styles.roomCardTop}>
                <View style={styles.roomCardLeft}>
                  <Text style={styles.roomId}>{room.id}</Text>
                  <Text style={styles.roomName}>{room.name}</Text>
                </View>
                {room.voice && (
                  <View style={styles.voiceBadge}>
                    <Text style={styles.voiceBadgeText}>🎙 Voice Bật</Text>
                  </View>
                )}
                {room.almostFull && (
                  <View style={styles.almostFullBadge}>
                    <Text style={styles.almostFullText}>Sắp Đầy</Text>
                  </View>
                )}
                {room.locked && (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedText}>🔒 Mật Khẩu</Text>
                  </View>
                )}
              </View>
              <View style={styles.roomCardMid}>
                <Text style={styles.roomMeta}>👑 {room.host} • {room.scenario}</Text>
                <Text style={[styles.roomCount, { color: room.almostFull ? Colors.error : Colors.primary }]}>
                  👤 {room.current}/{room.max}
                </Text>
              </View>
              <View style={styles.roomCardBottom}>
                <View style={styles.roomProgressTrack}>
                  <View
                    style={[
                      styles.roomProgressFill,
                      {
                        width: `${(room.current / room.max) * 100}%`,
                        backgroundColor: room.almostFull ? Colors.error : Colors.primary,
                      }
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.enterRoomBtn}
                  onPress={() => navigation.navigate('Lobby')}
                >
                  <Text style={styles.enterRoomText}>{room.locked ? 'Mở Khóa' : 'Vào Phòng'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Utilities */}
        <View style={styles.utilitiesGrid}>
          <TouchableOpacity style={styles.utilBtn}>
            <Text style={styles.utilIcon}>📖</Text>
            <View>
              <Text style={styles.utilTitle}>Luật Chơi & Sách Phép</Text>
              <Text style={styles.utilDesc}>5 Câu hỏi cốt lõi</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilBtn}>
            <Text style={styles.utilIcon}>🎙</Text>
            <View>
              <Text style={styles.utilTitle}>Cấu Hình Âm Thanh</Text>
              <Text style={styles.utilDesc}>Kiểm tra Micro & Loa</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏰', label: 'Sảnh', active: true },
          { icon: '🃏', label: 'Thẻ Bài', active: false },
          { icon: '📜', label: 'Lịch Sử', active: false },
          { icon: '🏆', label: 'Xếp Hạng', active: false },
          { icon: '⚙️', label: 'Cài Đặt', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navTab}>
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 72,
    paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.surface}E6`,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIcon: { fontSize: 18, color: Colors.primary },
  headerTitle: {
    color: Colors.primary,
    fontSize: FontSizes.headlineSm,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  serverRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  serverDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary },
  serverText: { color: Colors.secondary, fontSize: FontSizes.bodySm },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userInfo: { alignItems: 'flex-end' },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { color: Colors.tertiary, fontSize: FontSizes.labelMd, fontWeight: '600' },
  levelBadge: { backgroundColor: Colors.tertiaryContainer, borderRadius: 2, paddingHorizontal: 4 },
  levelText: { color: Colors.tertiary, fontSize: FontSizes.labelSm, fontWeight: '700' },
  userRole: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm },
  userAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  userAvatarText: { fontSize: 16 },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },

  heroBanner: {
    marginHorizontal: Spacing.marginMobile,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  heroGradient: {
    height: 180,
    backgroundColor: `${Colors.primaryContainer}40`,
  },
  heroBannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    height: 180,
    justifyContent: 'space-between',
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBadge: {
    backgroundColor: `${Colors.primaryContainer}E6`,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2,
  },
  heroBadgeText: { color: Colors.onPrimaryContainer, fontSize: 10, fontWeight: '700' },
  dpBadge: { backgroundColor: `${Colors.surfaceContainerHigh}CC`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  dpText: { color: Colors.tertiary, fontSize: FontSizes.labelSm },
  heroTitle: {
    color: Colors.onSurface, fontSize: FontSizes.headlineLgMobile,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
  },
  heroSubtitle: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, marginTop: 2 },
  heroBannerBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    backgroundColor: Colors.surfaceContainer,
  },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  onlineLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm },
  onlineCount: { color: Colors.primary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  detailBtn: { color: Colors.secondary, fontSize: FontSizes.labelSm },

  section: { paddingHorizontal: Spacing.marginMobile, marginTop: Spacing.md },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    color: Colors.onSurface, fontSize: FontSizes.headlineSm,
    fontWeight: '700', textTransform: 'uppercase',
  },
  sectionCount: { color: Colors.outline, fontSize: FontSizes.labelSm },

  quickMatchBtn: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  quickMatchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  quickMatchIconBox: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.surfaceContainerLowest}66`,
    alignItems: 'center', justifyContent: 'center',
  },
  quickMatchIcon: { fontSize: 24 },
  quickMatchTitle: {
    color: Colors.onPrimary, fontSize: FontSizes.headlineSm,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
  },
  quickMatchSubtitle: { color: Colors.primaryFixedDim, fontSize: FontSizes.bodySm },
  playIcon: { color: Colors.primaryFixed, fontSize: 22 },

  subActionRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  subActionBtn: {
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainer,
    gap: 8,
  },
  subActionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subActionIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  subActionArrow: { color: Colors.onSurfaceVariant, fontSize: 16 },
  subActionTitle: { fontSize: FontSizes.labelMd, fontWeight: '700', textTransform: 'uppercase' },
  subActionDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },

  codeInputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 8, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerLow,
  },
  codeInputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
  },
  hashTag: { color: Colors.outlineVariant, fontSize: FontSizes.labelMd, fontWeight: '600' },
  codeInput: {
    flex: 1, paddingVertical: 8, paddingLeft: 4,
    color: Colors.onSurface, fontSize: FontSizes.timerDisplayMobile,
    fontWeight: '700', letterSpacing: 4,
  },
  qrBtn: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  joinBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
  },
  joinBtnText: { color: Colors.onSecondary, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },

  modeCard: {
    borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
    padding: Spacing.md, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  modeCardTop: { marginBottom: 12 },
  modeCardLeft: { flexDirection: 'row', gap: 12 },
  modeIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  modeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  modeName: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600' },
  modePlayerBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 2 },
  modePlayerText: { fontSize: FontSizes.labelSm, fontWeight: '700' },
  modeDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, marginTop: 2 },
  modeCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modeRoomRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeRoomDot: { width: 8, height: 8, borderRadius: 4 },
  modeRoomCount: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },
  joinModeBtn: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 2,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  joinModeBtnText: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },

  miniModeGrid: { flexDirection: 'row', gap: 8, marginTop: 4 },
  miniModeCard: {
    flex: 1, borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
    padding: 12, gap: 6,
  },
  miniModeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniModeIcon: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  miniModeBadge: { paddingHorizontal: 4, borderRadius: 2 },
  miniModeBadgeText: { color: Colors.onSurface, fontSize: FontSizes.labelSm, fontWeight: '700' },
  miniModeTitle: { color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '600' },
  miniModeDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm - 1 },
  miniModeBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniModeStat: { fontSize: FontSizes.bodySm },
  miniModeArrow: { color: Colors.outlineVariant, fontSize: 16 },

  filterScroll: { marginBottom: Spacing.sm },
  filterPill: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 2,
    backgroundColor: Colors.surfaceContainer, marginRight: 6,
  },
  filterPillActive: { backgroundColor: Colors.primary },
  filterPillText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, fontWeight: '700' },
  filterPillTextActive: { color: Colors.onPrimary },

  roomCard: {
    borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
    padding: 12, marginBottom: 8, gap: 8,
  },
  roomCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomId: { color: Colors.tertiary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  roomName: { color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '600', flex: 1 },
  voiceBadge: {
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2,
  },
  voiceBadgeText: { color: Colors.secondary, fontSize: FontSizes.labelSm },
  almostFullBadge: {
    backgroundColor: Colors.errorContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2,
  },
  almostFullText: { color: Colors.onErrorContainer, fontSize: FontSizes.labelSm },
  lockedBadge: {
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2,
  },
  lockedText: { color: Colors.outline, fontSize: FontSizes.labelSm },
  roomCardMid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomMeta: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },
  roomCount: { fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  roomCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomProgressTrack: {
    flex: 1, height: 6, borderRadius: 3,
    backgroundColor: Colors.surfaceContainerLowest, overflow: 'hidden', marginRight: 12,
  },
  roomProgressFill: { height: '100%', borderRadius: 3 },
  enterRoomBtn: {
    paddingHorizontal: 14, paddingVertical: 4, borderRadius: 2,
    backgroundColor: Colors.primaryContainer,
  },
  enterRoomText: { color: Colors.onPrimaryContainer, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },

  utilitiesGrid: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: Spacing.marginMobile, marginTop: Spacing.sm, marginBottom: Spacing.md,
  },
  utilBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
  },
  utilIcon: { fontSize: 20 },
  utilTitle: { color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '600' },
  utilDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    height: 64, paddingHorizontal: Spacing.gutterMobile,
    backgroundColor: `${Colors.surfaceContainerLowest}F2`,
    borderTopWidth: 1, borderTopColor: Colors.outlineVariant,
  },
  navTab: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 56, minHeight: 44 },
  navIcon: { fontSize: 22 },
  navLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, marginTop: 2 },
  navLabelActive: { color: Colors.primary, fontWeight: '700' },
});
