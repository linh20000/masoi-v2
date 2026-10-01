import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';

const GAMES = [
  {
    id: 'masoi',
    title: 'MA SÓI ONLINE',
    subtitle: 'The Werewolves of Miller\'s Hollow',
    badge: 'Đang Hot Nhất • 3,240 Chơi',
    badgePulse: true,
    badgeBg: Colors.primaryContainer,
    badgeText: Colors.onPrimaryContainer,
    desc: 'Trận chiến sống còn giữa dân làng và bầy sói khát máu. Hệ thống 43+ vai trò, kênh thoại hai cõi âm thanh kép độc quyền.',
    icon: '🌙',
    iconColor: Colors.primary,
    accent: Colors.primaryContainer,
    modes: [
      { icon: '⚡', label: 'Ghép Nhanh', id: 'quick', screen: 'GameHall' },
      { icon: '👥', label: 'Bàn 12 Người', id: 'table12', screen: 'GameHall' },
      { icon: '🏆', label: 'Đấu Hạng Elo', id: 'ranked', screen: 'GameHall' },
    ],
    enterLabel: 'Vào Sảnh Ma Sói',
    enterScreen: 'GameHall',
    enterBg: Colors.primaryContainer,
    enterText: Colors.onPrimaryContainer,
  },
  {
    id: 'uno',
    title: 'UNO PARTY',
    subtitle: 'Đại Chiến 4 Màu Tốc Độ',
    badge: 'Vui Nhộn • 980 Chơi',
    badgePulse: false,
    badgeBg: Colors.secondaryContainer + '50',
    badgeText: Colors.secondary,
    desc: 'Đấu bài tốc độ cao, chặt bài liên hoàn, luật xếp chồng +4 tàn khốc và voice chat cà khịa cực vui cùng bạn bè.',
    icon: '🃏',
    iconColor: Colors.secondary,
    accent: Colors.secondaryContainer,
    modes: [
      { icon: '4️⃣', label: 'Bàn 4 Người', id: '4p', screen: null },
      { icon: '🤝', label: 'Đấu Cặp 2v2', id: '2v2', screen: null },
      { icon: '🌀', label: 'Chặt Đè Bão', id: 'chaotic', screen: null },
    ],
    enterLabel: 'Vào Sảnh Uno',
    enterScreen: null,
    enterBg: Colors.surfaceBright,
    enterText: Colors.onSurface,
  },
  {
    id: 'kittens',
    title: 'MÈO NỔ CẢM TỬ',
    subtitle: 'Exploding Kittens • Sinh Tử May Rủi',
    badge: 'Hồi Hộp • 620 Chơi',
    badgePulse: false,
    badgeBg: Colors.tertiaryContainer,
    badgeText: Colors.onTertiaryContainer,
    desc: 'Russian Roulette phiên bản mèo ôm bom! Rút bài thử vận may, gài bẫy bạn bè và tìm cách sống sót đến lá cuối cùng.',
    icon: '🐱',
    iconColor: Colors.tertiary,
    accent: Colors.tertiaryContainer,
    modes: [
      { icon: '🐾', label: 'Cổ Điển 5P', id: '5p', screen: null },
      { icon: '💀', label: 'Bản Ma Mèo', id: 'ghost', screen: null },
      { icon: '💣', label: 'Huyết Chiến', id: 'bloodbath', screen: null },
    ],
    enterLabel: 'Vào Sảnh Mèo Nổ',
    enterScreen: null,
    enterBg: Colors.surfaceBright,
    enterText: Colors.onSurface,
  },
];

export default function GameSelectionScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [roomCode, setRoomCode] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surfaceContainerLowest} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={[styles.pingBadge]}>
            <View style={styles.pingDot} />
            <Text style={styles.pingText}>28ms</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Trang Chủ</Text>
        <View style={styles.headerRight}>
          <View style={[styles.coinBadge]}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.coinText}>1.4k</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome + Stats */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeTopRow}>
            <View style={styles.onlinePingRow}>
              <View style={styles.pingPulse} />
              <Text style={[styles.seasonLabel, { color: Colors.secondary }]}>Huyết Nguyệt Đang Rực Cháy</Text>
            </View>
            <View style={styles.onlineCountBadge}>
              <Text style={styles.onlineCountIcon}>📡</Text>
              <Text style={styles.onlineCountText}>4,812</Text>
              <Text style={styles.onlineCountLabel}> online</Text>
            </View>
          </View>
          <View style={styles.welcomeRow}>
            <Text style={styles.welcomeText}>
              Chào buổi tối, <Text style={[styles.welcomeAccent, { color: Colors.primary }]}>Hiệp Sĩ Đêm!</Text>
            </Text>
            <View style={[styles.lvBadge]}>
              <Text style={styles.lvText}>LV.14</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✅</Text>
              <View>
                <Text style={styles.statLabel}>Điểm Uy Tín</Text>
                <Text style={[styles.statValue, { color: Colors.secondary }]}>1,850 DP</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🪙</Text>
              <View>
                <Text style={styles.statLabel}>Kho Báu Vàng</Text>
                <Text style={[styles.statValue, { color: Colors.tertiary }]}>12,480</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Season Progress */}
        <View style={styles.seasonCard}>
          <View style={styles.seasonCardHeader}>
            <View style={styles.seasonBadge}>
              <Text style={styles.seasonBadgeIcon}>🏅</Text>
              <Text style={styles.seasonBadgeText}>Mùa Giải Thứ 4</Text>
            </View>
            <Text style={[styles.seasonCountdown, { color: Colors.error }]}>Còn 12 ngày</Text>
          </View>
          <Text style={styles.seasonTitle}>Bản Giao Hưởng Huyết Nguyệt</Text>
          <Text style={styles.seasonDesc}>
            Tham gia Đua Top Xếp Hạng ngay hôm nay để vĩnh viễn sở hữu thẻ quyền năng Thần Sói Trắng và huy hiệu Dạ Nguyệt.
          </Text>
          <View style={styles.seasonProgressRow}>
            <View style={styles.seasonProgressBg}>
              <View style={[styles.seasonProgressFill, { width: '68%' }]} />
            </View>
            <Text style={[styles.seasonProgressPct, { color: Colors.primary }]}>68%</Text>
          </View>
        </View>

        {/* Room Code Join */}
        <View style={styles.joinCodeCard}>
          <View style={styles.joinCodeHeader}>
            <Text style={styles.joinCodeLabel}>🚪 Vào Bàn Bằng Mã Phòng</Text>
            <Text style={styles.joinCodeSub}>Phòng Riêng Tư</Text>
          </View>
          <View style={styles.joinCodeRow}>
            <View style={styles.joinCodeInputWrap}>
              <Text style={styles.joinCodePlaceholder}>Nhập mã 4-6 số...</Text>
              <Text style={styles.joinCodeKeyIcon}>🔑</Text>
            </View>
            <TouchableOpacity style={styles.joinBtn} onPress={() => onNavigate?.('GameHall')}>
              <Text style={styles.joinBtnText}>Tham Gia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} onPress={() => onNavigate?.('Lobby')}>
              <Text style={styles.createBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Đấu Trường Header */}
        <View style={styles.arenaHeader}>
          <Text style={styles.arenaTitle}>⚔️ Đấu Trường Hắc Ám</Text>
          <Text style={styles.arenaCount}>3 Tựa Game</Text>
        </View>

        {/* Game Cards */}
        {GAMES.map((game) => (
          <View key={game.id} style={styles.gameCard}>
            {/* Fog overlay effect */}
            <View style={[styles.gameCardFog, { backgroundColor: Colors.surfaceContainer + 'E6' }]} />

            {/* Content */}
            <View style={styles.gameCardContent}>
              {/* Badge Row */}
              <View style={styles.gameBadgeRow}>
                <View style={[styles.gameBadge, { backgroundColor: game.badgeBg }]}>
                  {game.badgePulse && <View style={styles.badgePulse} />}
                  <Text style={[styles.gameBadgeText, { color: game.badgeText }]}>{game.badge}</Text>
                </View>
                <View style={[styles.gameIconCircle, { backgroundColor: Colors.surfaceContainerHigh + 'E6' }]}>
                  <Text style={styles.gameIconEmoji}>{game.icon}</Text>
                </View>
              </View>

              {/* Title */}
              <View style={styles.gameTitleRow}>
                <Text style={styles.gameTitle}>{game.title}</Text>
              </View>
              <Text style={[styles.gameSubtitle, { color: game.iconColor }]}>{game.subtitle}</Text>
              <Text style={styles.gameDesc}>{game.desc}</Text>

              {/* Mode Buttons */}
              <View style={styles.modeGrid}>
                {game.modes.map((mode) => (
                  <TouchableOpacity
                    key={mode.id}
                    style={styles.modeBtn}
                    onPress={() => mode.screen && onNavigate?.(mode.screen)}
                  >
                    <Text style={styles.modeBtnIcon}>{mode.icon}</Text>
                    <Text style={styles.modeBtnLabel}>{mode.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Enter Button */}
              <TouchableOpacity
                style={[styles.enterBtn, { backgroundColor: game.enterBg }]}
                onPress={() => game.enterScreen && onNavigate?.(game.enterScreen)}
              >
                <Text style={styles.enterBtnIcon}>🚪</Text>
                <Text style={[styles.enterBtnText, { color: game.enterText }]}>{game.enterLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Support Row */}
        <View style={styles.supportRow}>
          <Text style={styles.supportIcon}>🎧</Text>
          <Text style={styles.supportText}>Hỗ trợ kỹ thuật & Báo cáo gian lận 24/7</Text>
          <TouchableOpacity>
            <Text style={[styles.supportAction, { color: Colors.secondary }]}>Gửi Hỗ Trợ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏰', label: 'Trang Chủ', screen: 'GameSelection', active: true },
          { icon: '🃏', label: 'Kho Game', screen: 'RoleCatalog' },
          { icon: '👥', label: 'Bạn Bè', screen: null },
          { icon: '🏆', label: 'Xếp Hạng', screen: null },
          { icon: '⚙️', label: 'Cài Đặt', screen: 'AudioConfig' },
        ].map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navTab}
            onPress={() => tab.screen && onNavigate?.(tab.screen)}
          >
            <Text style={[styles.navTabIcon, tab.active && styles.navTabIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navTabLabel, tab.active && styles.navTabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Add missing color references
const surfaceBright = '#37393d';
const onTertiaryContainer = '#dbaa54';
// Augment Colors type reference
declare module '../theme/colors' {
  interface ColorsType {
    surfaceBright: string;
    onTertiaryContainer: string;
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest + 'CC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#59413f50',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatarCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  avatarIcon: { fontSize: 16 },
  onlineDot: {
    position: 'absolute', bottom: -1, right: -1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 1.5, borderColor: Colors.surfaceContainerLowest,
  },
  pingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerHigh + 'CC',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20,
  },
  pingDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary,
  },
  pingText: { fontSize: 11, color: Colors.secondary, fontFamily: 'JetBrainsMono-Bold' },
  headerTitle: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 16,
    color: Colors.onSurface, textTransform: 'uppercase', letterSpacing: 1,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  coinBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.surfaceContainerHigh + 'CC',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20,
  },
  coinIcon: { fontSize: 13 },
  coinText: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 12,
    color: Colors.tertiary, fontWeight: '700',
  },
  notifBtn: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifIcon: { fontSize: 20 },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1, borderColor: Colors.surfaceContainerLowest,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 12, gap: 12, paddingBottom: 24 },

  // Welcome
  welcomeSection: { gap: 8 },
  welcomeTopRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  onlinePingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pingPulse: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary,
  },
  seasonLabel: {
    fontFamily: 'Cinzel-Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  onlineCountBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  onlineCountIcon: { fontSize: 12 },
  onlineCountText: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 12,
    color: Colors.secondary, fontWeight: '700',
  },
  onlineCountLabel: {
    fontSize: 11, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular',
  },
  welcomeRow: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
  },
  welcomeText: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 22,
    color: Colors.onSurface, letterSpacing: 0.5,
  },
  welcomeAccent: { fontFamily: 'Cinzel-Bold', fontWeight: '700' },
  lvBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  lvText: {
    fontFamily: 'Cinzel-Bold', fontSize: 10,
    color: Colors.onPrimaryContainer, letterSpacing: 0.5,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8, borderRadius: 10,
  },
  statIcon: { fontSize: 20 },
  statLabel: { fontSize: 10, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular' },
  statValue: { fontFamily: 'JetBrainsMono-Bold', fontSize: 13, fontWeight: '700', marginTop: 1 },

  // Season Card
  seasonCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 12, padding: 12, gap: 6,
    borderWidth: 0.5, borderColor: '#59413f30',
    position: 'relative', overflow: 'hidden',
  },
  seasonCardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  seasonBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.tertiaryContainer + '66',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  seasonBadgeIcon: { fontSize: 13 },
  seasonBadgeText: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 11,
    color: Colors.tertiary, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  seasonCountdown: { fontFamily: 'JetBrainsMono-Bold', fontSize: 12, fontWeight: '700' },
  seasonTitle: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 16,
    color: Colors.onSurface, letterSpacing: 0.5,
  },
  seasonDesc: {
    fontSize: 12, color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular', lineHeight: 18,
  },
  seasonProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  seasonProgressBg: {
    flex: 1, height: 6, borderRadius: 3,
    backgroundColor: Colors.surfaceContainerHighest, overflow: 'hidden',
  },
  seasonProgressFill: {
    height: '100%', borderRadius: 3, backgroundColor: Colors.primary,
  },
  seasonProgressPct: { fontFamily: 'JetBrainsMono-Bold', fontSize: 12, fontWeight: '700' },

  // Join Code Card
  joinCodeCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, padding: 12, gap: 10,
    borderWidth: 0.5, borderColor: '#59413f30',
  },
  joinCodeHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  joinCodeLabel: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 12,
    color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  joinCodeSub: { fontSize: 11, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular' },
  joinCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  joinCodeInputWrap: {
    flex: 1, height: 44,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 10, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  joinCodePlaceholder: {
    fontSize: 13, color: Colors.outline, fontFamily: 'Inter-Regular',
  },
  joinCodeKeyIcon: { fontSize: 16 },
  joinBtn: {
    height: 44, paddingHorizontal: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  joinBtnText: {
    fontFamily: 'Cinzel-Bold', fontSize: 11,
    color: Colors.onSurface, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  createBtn: {
    width: 44, height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  createBtnText: {
    fontFamily: 'Cinzel-Bold', fontSize: 22, color: Colors.onPrimary,
  },

  // Arena Header
  arenaHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  arenaTitle: {
    fontFamily: 'Cinzel-Bold', fontSize: 16,
    color: Colors.onSurface, textTransform: 'uppercase', letterSpacing: 1,
  },
  arenaCount: {
    fontSize: 12, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular',
  },

  // Game Card
  gameCard: {
    borderRadius: 12, overflow: 'hidden',
    backgroundColor: Colors.surfaceContainer,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#59413f30',
  },
  gameCardFog: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
  },
  gameCardContent: {
    padding: 16, gap: 10, position: 'relative', zIndex: 1,
  },
  gameBadgeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  gameBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  badgePulse: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary,
  },
  gameBadgeText: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  gameIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  gameIconEmoji: { fontSize: 18 },
  gameTitleRow: { marginTop: 2 },
  gameTitle: {
    fontFamily: 'Cinzel-Bold', fontSize: 24,
    color: Colors.onSurface, letterSpacing: 1, textTransform: 'uppercase',
  },
  gameSubtitle: {
    fontFamily: 'Cinzel-Bold', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  gameDesc: {
    fontSize: 12, color: Colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular', lineHeight: 18,
  },

  // Mode Grid
  modeGrid: { flexDirection: 'row', gap: 6 },
  modeBtn: {
    flex: 1, padding: 8, borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHigh + 'CC',
    alignItems: 'center', gap: 4,
  },
  modeBtnIcon: { fontSize: 18 },
  modeBtnLabel: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 9,
    color: Colors.onSurface, textTransform: 'uppercase',
    letterSpacing: 0.3, textAlign: 'center',
  },

  // Enter Button
  enterBtn: {
    height: 48, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 2,
  },
  enterBtnIcon: { fontSize: 18 },
  enterBtnText: {
    fontFamily: 'Cinzel-Bold', fontSize: 14,
    textTransform: 'uppercase', letterSpacing: 1,
  },

  // Support
  supportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 12, borderRadius: 12,
  },
  supportIcon: { fontSize: 18 },
  supportText: {
    flex: 1, fontSize: 12, color: Colors.onSurfaceVariant, fontFamily: 'Inter-Regular',
  },
  supportAction: {
    fontFamily: 'Cinzel-SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', height: 60,
    backgroundColor: Colors.surfaceContainerLowest + 'F2',
    borderTopWidth: 0.5, borderTopColor: '#59413f50',
    paddingHorizontal: 4,
  },
  navTab: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 6,
  },
  navTabIcon: { fontSize: 20 },
  navTabIconActive: {},
  navTabLabel: {
    fontSize: 9, fontFamily: 'Cinzel-SemiBold',
    color: Colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.3,
  },
  navTabLabelActive: { color: Colors.primary },
});
