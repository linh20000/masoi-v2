import React, { useState } from 'react';
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
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES, ROLE_CARD_IMAGES } from '../theme/images';

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

export default function HomeScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [roomCode, setRoomCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickMatch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (onNavigate) onNavigate('Lobby');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

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
            <Image
              source={{ uri: SEAT_AVATAR_IMAGES.VII }}
              style={styles.userAvatarImg}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: ROLE_CARD_IMAGES.seer }}
            style={styles.heroBannerBg}
            resizeMode="cover"
          />
          <View style={styles.heroGradientOverlay} />
          
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

        <View style={styles.section}>
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

          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('Lobby')}
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

            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('RoleCatalog')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.secondaryContainer }]}>
                  <Text>📚</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.secondary }]}>BÁCH KHOA VAI TRÒ</Text>
              <Text style={styles.subActionDesc}>32 Vai trò & Máy trạng thái</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Features Quick Grid */}
          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('WerewolfTurn')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.primaryContainer }]}>
                  <Text>🐺</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.primary }]}>PHE SÓI ĐÊM SẮN</Text>
              <Text style={styles.subActionDesc}>Màn họp cắn mồi nội bộ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('TimelineReplay')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.tertiaryContainer }]}>
                  <Text>📖</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.tertiary }]}>BIÊN NIÊN SỬ</Text>
              <Text style={styles.subActionDesc}>Xem lại Replay trận đấu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('RoleDetail')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.secondaryContainer }]}>
                  <Text>🃏</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.secondary }]}>THẺ BÀI TAROT</Text>
              <Text style={styles.subActionDesc}>Chi tiết bài & kỹ năng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('BloodMoonModifiers')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.primaryContainer }]}>
                  <Text>🌕</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.primary }]}>HUYẾT NGUYỆT</Text>
              <Text style={styles.subActionDesc}>Biến thể & Event Modifiers</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('GameHall')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.primaryContainer }]}>
                  <Text>🏰</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.primary }]}>SẢNH MA SÓI</Text>
              <Text style={styles.subActionDesc}>Ghép nhanh, phòng công khai</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('GameSelection')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.tertiaryContainer }]}>
                  <Text>🎮</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.tertiary }]}>KHO GAME</Text>
              <Text style={styles.subActionDesc}>Ma Sói, UNO, Mèo Nổ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subActionRow}>
            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('AudioConfig')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.secondaryContainer }]}>
                  <Text>🎙</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.secondary }]}>CẤU HÌNH ÂM THANH</Text>
              <Text style={styles.subActionDesc}>Micro, kênh thoại hai cõi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subActionBtn}
              onPress={() => onNavigate && onNavigate('NightQueueScheduler')}
              activeOpacity={0.8}
            >
              <View style={styles.subActionHeader}>
                <View style={[styles.subActionIcon, { backgroundColor: Colors.primaryContainer }]}>
                  <Text>📋</Text>
                </View>
                <Text style={styles.subActionArrow}>→</Text>
              </View>
              <Text style={[styles.subActionTitle, { color: Colors.primary }]}>HÀNG ĐỢI ĐÊM</Text>
              <Text style={styles.subActionDesc}>Lịch thức giấc ban đêm</Text>
            </TouchableOpacity>
          </View>

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
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => onNavigate && onNavigate('Lobby')}
            >
              <Text style={styles.joinBtnText}>Vào</Text>
            </TouchableOpacity>
          </View>
        </View>

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
                  onPress={() => onNavigate && onNavigate('Lobby')}
                >
                  <Text style={styles.joinModeBtnText}>Tham Gia ▶</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>🚪</Text>
              <Text style={styles.sectionTitle}>SẢNH CHỜ CÔNG KHAI</Text>
            </View>
          </View>

          {PUBLIC_ROOMS.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <View style={styles.roomCardTop}>
                <View style={styles.roomCardLeft}>
                  <Text style={styles.roomId}>{room.id}</Text>
                  <Text style={styles.roomName}>{room.name}</Text>
                </View>
              </View>
              <View style={styles.roomCardMid}>
                <Text style={styles.roomMeta}>👑 {room.host} • {room.scenario}</Text>
                <Text style={styles.roomCount}>👤 {room.current}/{room.max}</Text>
              </View>
              <TouchableOpacity
                style={styles.enterRoomBtn}
                onPress={() => onNavigate && onNavigate('Lobby')}
              >
                <Text style={styles.enterRoomText}>Vào Phòng</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { key: 'Home', icon: '🏰', label: 'TRANG CHỦ', active: true },
          { key: 'GameSelection', icon: '🎴', label: 'KHO GAME', active: false },
          { key: 'Lobby', icon: '👥', label: 'BẠN BÈ', active: false },
          { key: 'MasterUserFlowMap', icon: '🎖️', label: 'XẾP HẠNG', active: false },
          { key: 'AudioConfig', icon: '⚙️', label: 'CÀI ĐẶT', active: false },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navTab}
            onPress={() => onNavigate && onNavigate(tab.key)}
          >
            <Text style={[styles.navIcon, tab.active && styles.navIconActive]}>{tab.icon}</Text>
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
    height: 64,
    paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainer}E6`,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.outline}33`,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIcon: { fontSize: 18, color: Colors.primary },
  headerTitle: {
    color: Colors.primary,
    fontSize: FontSizes.headlineSm,
    fontWeight: '800',
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
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary, overflow: 'hidden', borderWidth: 1, borderColor: Colors.tertiary,
  },
  userAvatarImg: { width: '100%', height: '100%' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },

  heroBanner: {
    marginHorizontal: Spacing.marginMobile,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLowest,
    height: 180, position: 'relative',
  },
  heroBannerBg: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  heroGradientOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(17,19,23,0.65)',
  },
  heroBannerContent: {
    padding: Spacing.md, flex: 1, justifyContent: 'space-between', zIndex: 10,
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
    fontWeight: '700', letterSpacing: 1,
  },
  heroSubtitle: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, marginTop: 2 },
  heroBannerBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    backgroundColor: Colors.surfaceContainer, zIndex: 10,
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
    fontWeight: '700',
  },
  sectionCount: { color: Colors.outline, fontSize: FontSizes.labelSm },

  quickMatchBtn: {
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    backgroundColor: Colors.primaryContainer,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickMatchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  quickMatchIconBox: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  quickMatchIcon: { fontSize: 24 },
  quickMatchTitle: {
    color: Colors.onPrimaryContainer, fontSize: FontSizes.headlineSm,
    fontWeight: '700', letterSpacing: 1,
  },
  quickMatchSubtitle: { color: Colors.primary, fontSize: FontSizes.bodySm },
  playIcon: { color: Colors.onPrimaryContainer, fontSize: 22 },

  subActionRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  subActionBtn: {
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainer, gap: 8,
  },
  subActionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subActionIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  subActionArrow: { color: Colors.onSurfaceVariant, fontSize: 16 },
  subActionTitle: { fontSize: FontSizes.labelMd, fontWeight: '700' },
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
  joinBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
  },
  joinBtnText: { color: Colors.onSecondary, fontSize: FontSizes.labelSm, fontWeight: '700' },

  modeCard: {
    borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
    padding: Spacing.md, marginBottom: 8,
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
  joinModeBtnText: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700' },

  roomCard: {
    borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainer,
    padding: 12, marginBottom: 8, gap: 8,
  },
  roomCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomId: { color: Colors.tertiary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  roomName: { color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '600', flex: 1 },
  roomCardMid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomMeta: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },
  roomCount: { color: Colors.primary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  enterRoomBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6,
    backgroundColor: Colors.primaryContainer, alignItems: 'center',
  },
  enterRoomText: { color: Colors.onPrimaryContainer, fontSize: FontSizes.labelSm, fontWeight: '700' },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    height: 60, paddingHorizontal: Spacing.gutterMobile,
    backgroundColor: `${Colors.surfaceContainerLowest}F2`,
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  navTab: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 56 },
  navIcon: { fontSize: 18, color: Colors.onSurfaceVariant },
  navIconActive: { color: Colors.primary },
  navLabel: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 3 },
  navLabelActive: { color: Colors.primary, fontWeight: '800' },
});
