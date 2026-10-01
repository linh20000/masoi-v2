import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const PLAYERS = [
  { seat: 'I', name: 'HuânTướcBóngĐêm', level: 28, ready: true, mic: true, isHost: true, avatar: '🧛' },
  { seat: 'II', name: 'CôBéQuàngKhănĐỏ', level: 19, ready: true, mic: true, isHost: false, avatar: '🧙‍♀️' },
  { seat: 'III', name: 'ThầyPhùThủy', level: 22, ready: true, mic: false, isHost: false, avatar: '🧙‍♂️' },
  { seat: 'IV', name: 'ThợSănBạc', level: 31, ready: true, mic: true, isHost: false, avatar: '🏹' },
  { seat: 'V', name: 'KẻMộngDu', level: 16, ready: true, mic: false, isHost: false, avatar: '👻' },
  { seat: 'VI', name: 'ThámTửĐêm', level: 25, ready: true, mic: false, isHost: false, avatar: '🔍' },
  { seat: 'VII', name: 'Hiệp Sĩ Đêm', level: 14, ready: true, mic: true, isHost: false, avatar: '⚔️', isYou: true },
  { seat: 'VIII', name: 'NgườiChơiMới_99', level: 3, ready: false, mic: false, isHost: false, avatar: '👤' },
];

const EMPTY_SEATS = ['IX', 'X', 'XI', 'XII'];

export default function LobbyScreen({ navigation }: Props) {
  const [isReady, setIsReady] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [scenarioExpanded, setScenarioExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerLabel}>Ritual Assembly</Text>
            <Text style={styles.headerTitle}>Lobby Gathering</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerMicBtn, micOn && styles.headerMicBtnActive]}
            onPress={() => setMicOn(!micOn)}
          >
            <Text style={styles.headerMicIcon}>{micOn ? '🎙' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerVolumeBtn}>
            <Text style={styles.headerVolumeIcon}>🔊</Text>
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Room info */}
        <View style={styles.roomInfoSection}>
          <View style={styles.roomInfoRow}>
            <View>
              <View style={styles.roomBadgeRow}>
                <View style={styles.roomCodeBadge}>
                  <Text style={styles.roomCodeText}>#8921</Text>
                </View>
                <View style={styles.pingBadge}>
                  <View style={styles.pingDot} />
                  <Text style={styles.pingText}>24ms</Text>
                </View>
              </View>
              <Text style={styles.roomName}>SÓI TRĂNG MÁU ĐI ĐÊM</Text>
            </View>
            <View style={styles.roomActions}>
              <TouchableOpacity style={styles.copyBtn}>
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qrBtn}>
                <Text style={styles.qrIcon}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.roomMeta}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>🔥 Chủ Phòng: HuânTướcBóngĐêm</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: Colors.surfaceContainer }]}>
              <Text style={styles.metaPillText2}>📣 Mic Tự Do</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: Colors.surfaceContainer }]}>
              <Text style={styles.metaPillText2}>🌙 60s Đêm / 90s Ngày</Text>
            </View>
          </View>
        </View>

        {/* Scenario card */}
        <View style={styles.scenarioCard}>
          <View style={styles.scenarioRow}>
            <View style={styles.scenarioLeft}>
              <View style={styles.scenarioIcon}>
                <Text style={{ fontSize: 22 }}>📖</Text>
              </View>
              <View>
                <View style={styles.scenarioNameRow}>
                  <Text style={styles.scenarioName}>Cổ Điển Mở Rộng</Text>
                  <View style={styles.scenarioBadge}>
                    <Text style={styles.scenarioBadgeText}>12 Lá Bài</Text>
                  </View>
                </View>
                <Text style={styles.scenarioDesc} numberOfLines={1}>3 Sói tàn độc rình rập, hội Thánh bảo hộ dân gian.</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.scenarioDetailBtn}
              onPress={() => setScenarioExpanded(!scenarioExpanded)}
            >
              <Text style={styles.scenarioDetailText}>Chi tiết {scenarioExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          </View>
          {scenarioExpanded && (
            <View style={styles.deckBreakdown}>
              {[
                { count: 3, label: 'Phe Sói', color: Colors.primary },
                { count: 4, label: 'Thần Thánh', color: Colors.secondary },
                { count: 5, label: 'Dân Làng', color: Colors.onSurface },
              ].map((item) => (
                <View key={item.label} style={styles.deckItem}>
                  <Text style={[styles.deckCount, { color: item.color }]}>{item.count}</Text>
                  <Text style={styles.deckLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Players status */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionIcon}>👥</Text>
              <Text style={styles.sectionTitle}>HIỆP ƯỚC LINH HỒN</Text>
              <Text style={styles.sectionCount}>(8/12)</Text>
            </View>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>🛡️ Đã Sẵn Sàng: 7/8</Text>
            </View>
          </View>

          <View style={styles.playerGrid}>
            {PLAYERS.map((player) => (
              <View
                key={player.seat}
                style={[
                  styles.playerCard,
                  player.isYou && styles.playerCardYou,
                  !player.ready && styles.playerCardNotReady,
                ]}
              >
                {player.isYou && <View style={styles.youIndicator} />}
                <View style={styles.playerCardTop}>
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatText}>{player.seat}</Text>
                  </View>
                  {player.isHost && <Text style={styles.hostStar}>👑</Text>}
                  <View style={[styles.micIndicator, !player.mic && styles.micIndicatorOff]}>
                    <Text style={styles.micIndicatorText}>{player.mic ? '🎙' : '🔇'}</Text>
                  </View>
                </View>
                <View style={styles.playerMid}>
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerAvatarText}>{player.avatar}</Text>
                    <View style={[styles.levelChip, player.isYou && styles.levelChipYou]}>
                      <Text style={styles.levelChipText}>{player.level}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.playerName, player.isYou && styles.playerNameYou]} numberOfLines={1}>
                      {player.name}
                    </Text>
                    {player.isHost && <Text style={styles.hostLabel}>CHỦ TỌA</Text>}
                  </View>
                </View>
                <View style={[styles.readyStatus, player.ready ? styles.readyStatusOn : styles.readyStatusOff]}>
                  <Text style={styles.readyStatusText}>
                    {player.ready ? '✓ SẴN SÀNG' : '⌛ ĐANG CHỜ...'}
                  </Text>
                </View>
              </View>
            ))}

            {/* Empty seats */}
            {EMPTY_SEATS.map((seat) => (
              <TouchableOpacity key={seat} style={styles.emptySeat}>
                <View style={styles.emptySeatIcon}>
                  <Text style={styles.emptySeatIconText}>👤+</Text>
                </View>
                <Text style={styles.emptySeatLabel}>Ghế {seat}</Text>
                <Text style={styles.emptySeatSubtitle}>+ Mời Bạn Bè</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat preview */}
        <View style={styles.chatPreview}>
          <Text style={styles.chatIcon}>💬</Text>
          <View style={styles.chatContent}>
            <Text style={styles.chatSender}>ThợSănBạc: </Text>
            <Text style={styles.chatMsg} numberOfLines={1}>Trận này ai làm sói nhớ cắn nhẹ tay nhé anh em...</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.chatOpenBtn}>Mở ›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Fixed bottom dock */}
      <View style={styles.bottomDock}>
        <TouchableOpacity style={styles.leaveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.leaveBtnIcon}>🚪</Text>
          <Text style={styles.leaveBtnText}>RỜI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockMicBtn, !micOn && styles.dockMicBtnOff]}
          onPress={() => setMicOn(!micOn)}
        >
          <Text style={styles.dockMicIcon}>{micOn ? '🎙' : '🔇'}</Text>
          <Text style={styles.dockMicText}>MIC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.masterActionBtn, !isReady && styles.masterActionBtnOff]}
          onPress={() => {
            if (isReady) {
              // Host can start - navigate to game
              navigation.navigate('NightPhase');
            } else {
              setIsReady(true);
            }
          }}
        >
          <Text style={styles.masterActionIcon}>{isReady ? '⚠️' : '✓'}</Text>
          <Text style={styles.masterActionText}>{isReady ? 'HỦY SẴN SÀNG' : 'SẴN SÀNG'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 64, paddingHorizontal: Spacing.gutterMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surface}D9`,
    borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: Colors.onSurfaceVariant, fontSize: 28, fontWeight: '300' },
  headerLabel: { color: Colors.outline, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  headerTitle: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerMicBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.surfaceContainerHigh}99`,
    alignItems: 'center', justifyContent: 'center',
  },
  headerMicBtnActive: { backgroundColor: `${Colors.secondaryContainer}66` },
  headerMicIcon: { fontSize: 18 },
  headerVolumeBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.surfaceContainerHigh}99`,
    alignItems: 'center', justifyContent: 'center',
  },
  headerVolumeIcon: { fontSize: 18 },
  headerAvatar: {
    width: 32, height: 32, borderRadius: 16, marginLeft: 4,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 16 },

  scroll: { flex: 1 },

  roomInfoSection: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: Spacing.gutterMobile,
    paddingVertical: Spacing.sm,
  },
  roomInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  roomCodeBadge: {
    backgroundColor: Colors.primaryContainer, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  roomCodeText: { color: Colors.onPrimaryContainer, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },
  pingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  pingText: { color: Colors.secondary, fontSize: FontSizes.bodySm },
  roomName: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600', letterSpacing: 0.5 },
  roomActions: { flexDirection: 'row', gap: 4 },
  copyBtn: {
    height: 36, paddingHorizontal: 10, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  copyIcon: { fontSize: 16 },
  qrBtn: {
    width: 36, height: 36, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  qrIcon: { fontSize: 16 },
  roomMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: Spacing.sm },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: BorderRadius.full, backgroundColor: `${Colors.tertiaryContainer}66`,
  },
  metaPillText: { color: Colors.tertiary, fontSize: FontSizes.labelSm },
  metaPillText2: { color: Colors.secondary, fontSize: FontSizes.bodySm },

  scenarioCard: {
    marginHorizontal: Spacing.gutterMobile, marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: BorderRadius.lg, padding: Spacing.sm,
  },
  scenarioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scenarioLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  scenarioIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  scenarioNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scenarioName: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '600' },
  scenarioBadge: {
    backgroundColor: Colors.surfaceContainerHighest, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 2,
  },
  scenarioBadgeText: { color: Colors.tertiary, fontSize: FontSizes.labelSm, fontWeight: '700' },
  scenarioDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm },
  scenarioDetailBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  scenarioDetailText: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700' },
  deckBreakdown: { flexDirection: 'row', marginTop: Spacing.sm, gap: Spacing.xs },
  deckItem: {
    flex: 1, alignItems: 'center', padding: 8, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  deckCount: { fontSize: FontSizes.headlineSm, fontWeight: '700' },
  deckLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', marginTop: 2 },

  section: { paddingHorizontal: Spacing.gutterMobile, marginTop: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  sectionCount: { color: Colors.secondary, fontSize: FontSizes.bodySm, fontWeight: '700' },
  readyBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceContainerHigh,
  },
  readyBadgeText: { color: Colors.tertiary, fontSize: FontSizes.bodySm },

  playerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  playerCard: {
    width: '48%', borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceContainerLow,
    padding: 10, marginBottom: 4,
    overflow: 'hidden',
  },
  playerCardYou: {
    backgroundColor: Colors.surfaceContainer,
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 2,
  },
  playerCardNotReady: { opacity: 0.9 },
  youIndicator: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    backgroundColor: Colors.secondary,
  },
  playerCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  seatBadge: {
    width: 20, height: 20, borderRadius: 4,
    backgroundColor: Colors.surfaceContainerHighest, alignItems: 'center', justifyContent: 'center',
  },
  seatText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, fontWeight: '700' },
  hostStar: { fontSize: 14 },
  micIndicator: {
    paddingHorizontal: 4, paddingVertical: 2, borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.secondaryContainer}66`,
  },
  micIndicatorOff: { backgroundColor: Colors.surfaceContainerHighest },
  micIndicatorText: { fontSize: 12 },
  playerMid: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  playerAvatar: { position: 'relative' },
  playerAvatarText: { fontSize: 36 },
  levelChip: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: Colors.surfaceContainerHighest, paddingHorizontal: 3, borderRadius: 2,
  },
  levelChipYou: { backgroundColor: Colors.secondary },
  levelChipText: { color: Colors.onSurface, fontSize: 9, fontWeight: '700' },
  playerName: { color: Colors.onSurface, fontSize: 13, fontWeight: '500' },
  playerNameYou: { color: Colors.secondary },
  hostLabel: { color: Colors.tertiary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  readyStatus: {
    paddingVertical: 4, borderRadius: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceContainer,
  },
  readyStatusOn: { backgroundColor: Colors.surfaceContainer },
  readyStatusOff: { backgroundColor: Colors.surfaceContainerHighest },
  readyStatusText: { color: Colors.secondary, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  emptySeat: {
    width: '48%', borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.surfaceContainerLowest}99`,
    padding: 10, alignItems: 'center', justifyContent: 'center', minHeight: 110, marginBottom: 4,
  },
  emptySeatIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptySeatIconText: { fontSize: 16 },
  emptySeatLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', fontWeight: '700' },
  emptySeatSubtitle: { color: Colors.outline, fontSize: FontSizes.bodySm },

  chatPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: Spacing.gutterMobile, marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm, paddingVertical: 8,
  },
  chatIcon: { fontSize: 18, color: Colors.outline },
  chatContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chatSender: { color: Colors.tertiary, fontSize: FontSizes.bodySm, fontWeight: '600' },
  chatMsg: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, flex: 1 },
  chatOpenBtn: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700' },

  bottomDock: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.gutterMobile, paddingVertical: Spacing.sm,
    backgroundColor: `${Colors.surface}F2`,
    borderTopWidth: 1, borderTopColor: Colors.outlineVariant,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6, shadowRadius: 12,
  },
  leaveBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },
  leaveBtnIcon: { fontSize: 18 },
  leaveBtnText: { color: Colors.onSurfaceVariant, fontSize: 9, fontWeight: '700' },
  dockMicBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  dockMicBtnOff: { backgroundColor: Colors.surfaceContainerHighest },
  dockMicIcon: { fontSize: 18 },
  dockMicText: { color: Colors.onSecondary, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  masterActionBtn: {
    flex: 1, height: 48, borderRadius: BorderRadius.md, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 12,
  },
  masterActionBtnOff: { backgroundColor: Colors.secondaryContainer },
  masterActionIcon: { fontSize: 20 },
  masterActionText: {
    color: Colors.onPrimaryContainer, fontSize: FontSizes.headlineSm,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5,
  },
});
