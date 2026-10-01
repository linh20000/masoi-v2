import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';

const GAME_MODES = [
  {
    id: 'classic',
    icon: 'groups',
    name: 'Cổ Điển',
    badge: '8-12N',
    badgeColor: Colors.primaryContainer,
    badgeText: Colors.onPrimaryContainer,
    desc: 'Dân, Sói, Tiên Tri, Thợ Săn, Bảo Vệ',
    rooms: 42,
    roomsColor: Colors.secondary,
    borderColor: Colors.outlineVariant + '50',
    bg: Colors.surfaceContainer,
  },
  {
    id: 'bloodmoon',
    icon: 'vital_signs',
    name: 'Huyết Nguyệt',
    badge: '12-16N',
    badgeColor: Colors.errorContainer,
    badgeText: Colors.onErrorContainer,
    desc: 'Phù Thủy, Cupid, Kẻ Thổi Sáo',
    rooms: 28,
    roomsColor: Colors.error,
    borderColor: Colors.primaryContainer + '66',
    bg: Colors.surfaceContainerHigh,
  },
  {
    id: 'ranked',
    icon: 'workspace_premium',
    name: 'Đấu Hạng ELO',
    badge: 'Ranked',
    badgeColor: Colors.tertiary,
    badgeText: Colors.onTertiary,
    desc: 'Hạng Bạc II • Voice Mic',
    rooms: null,
    roomsColor: Colors.onSurfaceVariant,
    borderColor: Colors.outlineVariant + '50',
    bg: Colors.surfaceContainer,
  },
  {
    id: 'bot',
    icon: 'smart_toy',
    name: 'Tập Luyện & Bot',
    badge: 'Solo',
    badgeColor: Colors.surfaceBright,
    badgeText: Colors.onSurface,
    desc: 'Thử vai trò mới tự do',
    rooms: null,
    roomsColor: Colors.secondary,
    borderColor: Colors.outlineVariant + '50',
    bg: Colors.surfaceContainer,
  },
];

const PUBLIC_ROOMS = [
  { id: '#8921', name: 'Sói Trăng Máu Đi Đêm', host: 'HuânTướcBóngĐêm', scenario: 'Cổ điển', current: 9, max: 12, voice: true, fill: 0.75 },
  { id: '#4012', name: 'Làng Vui Vẻ - Bật Mic', host: 'CôBéQuàngKhănĐỏ', scenario: 'Tân thủ', current: 7, max: 8, almostFull: true, fill: 0.875 },
  { id: '#7734', name: 'Chỉ Pro - Phân Tích Logic', host: 'ThầyPhùThủy', scenario: 'Huyết Nguyệt', current: 11, max: 15, locked: true, fill: 0.73 },
];

const FilterPills = ['Tất cả (114)', '8 Người', '12 Người', '16 Người', 'Có Mật Khẩu'];

export default function GameHallScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [roomCode, setRoomCode] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [isMatching, setIsMatching] = useState(false);

  const handleQuickMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      if (onNavigate) onNavigate('Lobby');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surfaceContainerLowest} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.logoText}>MA SÓI ONLINE</Text>
          <View style={styles.serverBadge}>
            <View style={styles.serverDot} />
            <Text style={styles.serverText}>Hà Nội (24ms)</Text>
          </View>
        </View>
        <View style={styles.topBarRight}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelName}>Hiệp Sĩ Đêm</Text>
            <Text style={styles.levelNum}>Lv.14</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloodmoon Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerGradient} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerTopRow}>
              <View style={styles.seasonBadge}>
                <Text style={styles.seasonIcon}>✨</Text>
                <Text style={styles.seasonText}>MÙA 4: BẢN GIAO HƯỞNG HUYẾT NGUYỆT</Text>
              </View>
              <View style={styles.dpBadge}>
                <Text style={styles.dpText}>🏆 1,850 DP</Text>
              </View>
            </View>
            <View>
              <Text style={styles.bannerTitle}>Đêm Định Mệnh</Text>
              <View style={styles.bannerBottom}>
                <Text style={styles.bannerWarning}>⚠ Trăng máu đạt đỉnh: </Text>
                <Text style={styles.bannerTimer}>03:14:20</Text>
                <View style={styles.onlinePing} />
                <Text style={styles.onlineCount}>4,812</Text>
                <Text style={styles.onlineLabel}> online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Match */}
        <TouchableOpacity
          style={styles.quickMatchBtn}
          onPress={handleQuickMatch}
          activeOpacity={0.88}
        >
          <View style={styles.qmIconWrap}>
            <Text style={styles.qmIcon}>⚡</Text>
          </View>
          <View style={styles.qmText}>
            <Text style={styles.qmTitle}>{isMatching ? 'ĐANG TÌM PHÒNG...' : 'Vào Trận Nhanh'}</Text>
            <Text style={styles.qmSub}>Ghép tự động vào phòng phù hợp nhất</Text>
          </View>
          <Text style={styles.qmArrow}>▶</Text>
        </TouchableOpacity>

        {/* Sub Actions */}
        <View style={styles.subActionsRow}>
          <TouchableOpacity style={styles.subActionBtn} onPress={() => onNavigate?.('Lobby')}>
            <View style={[styles.subActionIcon, { backgroundColor: Colors.tertiaryContainer + 'AA' }]}>
              <Text style={styles.subActionIconText}>🛡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subActionTitle, { color: Colors.tertiary }]} numberOfLines={1}>TẠO PHÒNG</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subActionBtn}>
            <View style={[styles.subActionIcon, { backgroundColor: Colors.secondaryContainer + 'AA' }]}>
              <Text style={styles.subActionIconText}>📲</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subActionTitle, { color: Colors.secondary }]} numberOfLines={1}>NHẬP MÃ / QR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Room Code Input */}
        <View style={styles.codeInputRow}>
          <Text style={styles.codeHash}>#</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="Nhập mã phòng trực tiếp..."
            placeholderTextColor={Colors.outline}
            value={roomCode}
            onChangeText={setRoomCode}
            maxLength={6}
            keyboardType="number-pad"
            returnKeyType="go"
          />
          <TouchableOpacity style={styles.qrBtn}>
            <Text style={styles.qrBtnIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => roomCode.length >= 4 && onNavigate?.('Lobby')}
          >
            <Text style={styles.joinBtnText}>Vào</Text>
          </TouchableOpacity>
        </View>

        {/* Game Modes Carousel */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.sectionHeaderIcon}>🃏</Text>
            <Text style={styles.sectionHeaderTitle}>Chế Độ Chơi Thần Bí</Text>
          </View>
          <Text style={styles.sectionHeaderHint}>VUỐT NGANG (4)</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modesCarousel}
          decelerationRate="fast"
          snapToInterval={242}
        >
          {GAME_MODES.map((mode) => (
            <View
              key={mode.id}
              style={[styles.modeCard, { backgroundColor: mode.bg, borderColor: mode.borderColor }]}
            >
              <View style={styles.modeCardTop}>
                <View style={[styles.modeIconWrap, { backgroundColor: Colors.surfaceContainerHigh }]}>
                  <Text style={styles.modeIcon}>
                    {mode.id === 'classic' ? '👥' : mode.id === 'bloodmoon' ? '🩸' : mode.id === 'ranked' ? '🏆' : '🤖'}
                  </Text>
                </View>
                <View style={styles.modeInfo}>
                  <View style={styles.modeTitleRow}>
                    <Text style={styles.modeName}>{mode.name}</Text>
                    <Text style={[styles.modeBadge, { backgroundColor: mode.badgeColor, color: mode.badgeText }]}>
                      {mode.badge}
                    </Text>
                  </View>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </View>
              </View>
              <View style={styles.modeCardBottom}>
                {mode.rooms !== null ? (
                  <Text style={[styles.modeRooms, { color: mode.roomsColor }]}>
                    ● {mode.rooms} phòng
                  </Text>
                ) : (
                  <Text style={[styles.modeRooms, { color: mode.roomsColor }]}>
                    {mode.id === 'ranked' ? 'Phạt AFK cao' : 'Miễn phí'}
                  </Text>
                )}
                <TouchableOpacity
                  style={[styles.modeJoinBtn, { backgroundColor: Colors.surfaceContainerHighest }]}
                  onPress={() => onNavigate?.('Lobby')}
                >
                  <Text style={[styles.modeJoinBtnText, { color: Colors.primary }]}>
                    {mode.id === 'bot' ? 'Luyện ▶' : 'Tham Gia ▶'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Public Rooms */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.sectionHeaderIcon}>🚪</Text>
            <Text style={styles.sectionHeaderTitle}>Sảnh Chờ Công Khai</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.refreshBtn}>🔄 Làm mới</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FilterPills.map((pill, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.filterPill, activeFilter === i && styles.filterPillActive]}
              onPress={() => setActiveFilter(i)}
            >
              <Text style={[styles.filterPillText, activeFilter === i && styles.filterPillTextActive]}>
                {pill}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Room Cards */}
        <View style={styles.roomsList}>
          {PUBLIC_ROOMS.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <View style={styles.roomTopRow}>
                <View style={styles.roomTitleRow}>
                  <Text style={styles.roomId}>{room.id}</Text>
                  <Text style={styles.roomName}>{room.name}</Text>
                </View>
                <View style={[styles.roomStatusBadge, {
                  backgroundColor: Colors.surfaceContainerLowest,
                }]}>
                  {room.voice && <Text style={[styles.roomStatusText, { color: Colors.secondary }]}>🎤 Voice</Text>}
                  {room.almostFull && <Text style={[styles.roomStatusText, { color: Colors.error }]}>Sắp Đầy</Text>}
                  {room.locked && <Text style={[styles.roomStatusText, { color: Colors.outline }]}>🔒 Khóa</Text>}
                  {!room.voice && !room.almostFull && !room.locked && <Text style={styles.roomStatusText}></Text>}
                </View>
              </View>
              <View style={styles.roomMidRow}>
                <Text style={styles.roomHost}>👑 {room.host} • {room.scenario}</Text>
                <Text style={[styles.roomCount, {
                  color: room.almostFull ? Colors.error : room.locked ? Colors.secondary : Colors.primary,
                }]}>
                  👤 {room.current}/{room.max}
                </Text>
              </View>
              <View style={styles.roomBottomRow}>
                <View style={styles.roomProgressBg}>
                  <View style={[styles.roomProgressFill, {
                    width: `${room.fill * 100}%` as any,
                    backgroundColor: room.almostFull ? Colors.error : room.locked ? Colors.secondary : Colors.primary,
                  }]} />
                </View>
                <TouchableOpacity
                  style={[styles.roomJoinBtn, {
                    backgroundColor: room.locked ? Colors.surfaceContainerHighest : Colors.primaryContainer,
                  }]}
                  onPress={() => onNavigate?.('Lobby')}
                >
                  <Text style={[styles.roomJoinBtnText, {
                    color: room.locked ? Colors.onSurface : Colors.onPrimaryContainer,
                  }]}>
                    {room.locked ? 'Mở Khóa' : 'Vào Phòng'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Utilities */}
        <View style={styles.utilsRow}>
          <TouchableOpacity style={styles.utilBtn} onPress={() => onNavigate?.('RoleCatalog')}>
            <Text style={styles.utilIcon}>📖</Text>
            <View>
              <Text style={styles.utilTitle}>Sách Phép & Luật</Text>
              <Text style={styles.utilSub}>Cốt lõi vai trò</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilBtn} onPress={() => onNavigate?.('AudioConfig')}>
            <Text style={styles.utilIcon}>🎙</Text>
            <View>
              <Text style={styles.utilTitle}>Kiểm Tra Mic</Text>
              <Text style={styles.utilSub}>Micro & Loa đàm thoại</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏰', label: 'Sảnh', active: true, screen: 'GameHall' },
          { icon: '🃏', label: 'Thẻ Bài', screen: 'RoleCatalog' },
          { icon: '📜', label: 'Lịch Sử', screen: 'TimelineReplay' },
          { icon: '🏆', label: 'Xếp Hạng', screen: null },
          { icon: '⚙️', label: 'Cài Đặt', screen: 'AudioConfig' },
        ].map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navTab}
            onPress={() => tab.screen && onNavigate?.(tab.screen)}
          >
            <Text style={styles.navTabIcon}>{tab.icon}</Text>
            <Text style={[styles.navTabLabel, tab.active && styles.navTabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const Colors2 = {
  outlineVariant: '#59413f',
  surfaceBright: '#37393d',
  onTertiary: '#422c00',
  surfaceContainerHighest: '#333538',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  topBar: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest + 'E6',
    borderBottomWidth: 0.5,
    borderBottomColor: '#59413f50',
  },
  topBarLeft: {
    flexDirection: 'column',
    gap: 2,
  },
  logoText: {
    fontFamily: 'Cinzel-SemiBold',
    fontSize: 13,
    letterSpacing: 2,
    color: Colors.primary,
    textTransform: 'uppercase',
    textShadowColor: Colors.primary + '50',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  serverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serverDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  serverText: {
    fontSize: 11,
    color: Colors.secondary,
    fontFamily: 'Inter-Regular',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelName: {
    fontSize: 11,
    color: Colors.tertiary,
    fontFamily: 'Cinzel-SemiBold',
  },
  levelNum: {
    fontSize: 9,
    color: Colors.tertiary,
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    fontFamily: 'Cinzel-Bold',
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 16,
    color: Colors.onPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },

  // Banner
  bannerCard: {
    marginHorizontal: 12,
    height: 154,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 0.5,
    borderColor: '#59413f50',
  },
  bannerGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.primaryContainer + '30',
  },
  bannerContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryContainer + 'E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primary + '30',
  },
  seasonIcon: { fontSize: 12 },
  seasonText: {
    fontSize: 9,
    fontFamily: 'Cinzel-SemiBold',
    color: Colors.onPrimaryContainer,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh + 'D8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.tertiary + '30',
  },
  dpText: {
    fontSize: 10,
    color: Colors.tertiary,
    fontFamily: 'Cinzel-SemiBold',
  },
  bannerTitle: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 22,
    color: Colors.onSurface,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bannerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bannerWarning: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  bannerTimer: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700',
  },
  onlinePing: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
    marginLeft: 12,
    marginRight: 4,
  },
  onlineCount: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700',
  },
  onlineLabel: {
    fontSize: 10,
    color: Colors.outline,
    fontFamily: 'Inter-Regular',
  },

  // Quick Match
  quickMatchBtn: {
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: Colors.primary + '30',
  },
  qmIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLowest + '66',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.primary + '30',
  },
  qmIcon: { fontSize: 22 },
  qmText: { flex: 1 },
  qmTitle: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 13,
    color: Colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  qmSub: {
    fontSize: 11,
    color: Colors.primaryFixedDim,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  qmArrow: {
    fontSize: 22,
    color: Colors.primaryFixed,
  },

  // Sub Actions
  subActionsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 8,
  },
  subActionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 0.5,
    borderColor: '#59413f30',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subActionIconText: { fontSize: 16 },
  subActionTitle: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subActionDesc: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },

  // Code Input
  codeInputRow: {
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderColor: '#59413f30',
  },
  codeHash: {
    fontSize: 13,
    color: Colors.outlineVariant,
    fontFamily: 'Cinzel-SemiBold',
    paddingLeft: 4,
  },
  codeInput: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.surfaceContainerLowest,
    color: Colors.onSurface,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    letterSpacing: 3,
    fontFamily: 'JetBrainsMono-Bold',
  },
  qrBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtnIcon: { fontSize: 18 },
  joinBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 11,
    color: Colors.onSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderIcon: { fontSize: 16 },
  sectionHeaderTitle: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 12,
    color: Colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeaderHint: {
    fontSize: 10,
    color: Colors.outline,
    fontFamily: 'Cinzel-SemiBold',
    letterSpacing: 0.5,
  },
  refreshBtn: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },

  // Modes Carousel
  modesCarousel: {
    paddingHorizontal: 12,
    gap: 10,
  },
  modeCard: {
    width: 230,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    justifyContent: 'space-between',
  },
  modeCardTop: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  modeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIcon: { fontSize: 18 },
  modeInfo: { flex: 1 },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  modeName: {
    fontFamily: 'Cinzel-Bold',
    fontSize: 12,
    color: Colors.onSurface,
  },
  modeBadge: {
    fontSize: 9,
    fontFamily: 'Cinzel-Bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    overflow: 'hidden',
  },
  modeDesc: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  modeCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#59413f30',
  },
  modeRooms: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  modeJoinBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modeJoinBtnText: {
    fontSize: 10,
    fontFamily: 'Cinzel-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Filter Pills
  filterRow: {
    paddingHorizontal: 12,
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.surfaceContainer,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 10,
    fontFamily: 'Cinzel-Bold',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filterPillTextActive: {
    color: Colors.onPrimary,
  },

  // Room Cards
  roomsList: {
    marginHorizontal: 12,
    gap: 6,
  },
  roomCard: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 0.5,
    borderColor: '#59413f30',
    gap: 6,
  },
  roomTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  roomId: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 12,
    color: Colors.tertiary,
  },
  roomName: {
    fontFamily: 'Cinzel-SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    flex: 1,
  },
  roomStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roomStatusText: {
    fontSize: 9,
    fontFamily: 'Cinzel-SemiBold',
    letterSpacing: 0.3,
  },
  roomMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomHost: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  roomCount: {
    fontSize: 12,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700',
  },
  roomBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomProgressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceContainerLowest,
    overflow: 'hidden',
  },
  roomProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  roomJoinBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roomJoinBtnText: {
    fontSize: 10,
    fontFamily: 'Cinzel-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Utilities
  utilsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 8,
    marginTop: 4,
  },
  utilBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer + 'B3',
    borderWidth: 0.5,
    borderColor: '#59413f20',
  },
  utilIcon: { fontSize: 20 },
  utilTitle: {
    fontFamily: 'Cinzel-SemiBold',
    fontSize: 11,
    color: Colors.onSurface,
  },
  utilSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: Colors.surfaceContainerLowest + 'F2',
    borderTopWidth: 0.5,
    borderTopColor: '#59413f50',
    paddingHorizontal: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navTabIcon: { fontSize: 20 },
  navTabLabel: {
    fontSize: 10,
    fontFamily: 'Cinzel-SemiBold',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  navTabLabelActive: {
    color: Colors.primary,
  },
});
