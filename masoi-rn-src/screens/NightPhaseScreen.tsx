import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const SEATS = [
  { id: 'I', name: 'TrưởngLàng', emoji: '👴', pos: { top: 0, left: '50%' }, translateX: -32 },
  { id: 'II', name: 'BảoKê', emoji: '🛡️', pos: { top: 32, right: 32 } },
  { id: 'III', name: 'ThuốcNam', emoji: '🧪', pos: { top: 112, right: -4 } },
  { id: 'IV', name: 'ThợSăn', emoji: '🏹', pos: { top: 208, right: -4 }, targeted: true },
  { id: 'V', name: 'BánhMì', emoji: '🥖', pos: { bottom: 96, right: 32 } },
  { id: 'VI', name: 'ThầnĐạo', emoji: '⛪', pos: { bottom: 24, right: 80 } },
  { id: 'VII', name: 'Tiên Tri', emoji: '🔮', pos: { bottom: 0, left: '50%' }, translateX: -32, isYou: true },
  { id: 'VIII', name: 'HiệpSĩ', emoji: '⚔️', pos: { bottom: 24, left: 80 } },
  { id: 'IX', name: 'HọcGiả', emoji: '📚', pos: { bottom: 96, left: 32 } },
  { id: 'X', name: 'BáTước', emoji: '🎩', pos: { top: 208, left: -4 } },
  { id: 'XI', name: 'CôĐảo', emoji: '🏝️', pos: { top: 112, left: -4 } },
  { id: 'XII', name: 'NữTuSĩ', emoji: '⛪', pos: { top: 32, left: 32 } },
];

export default function NightPhaseScreen({ navigation }: Props) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>('IV');
  const [selectedName, setSelectedName] = useState('Thợ Săn Bạc');
  const [micOn, setMicOn] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [timer, setTimer] = useState(19);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 0) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerStr = `00:${String(timer).padStart(2, '0')}`;
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.wifiIcon}>📡</Text>
          <Text style={styles.latency}>24ms</Text>
          <Text style={styles.roomCode}>#8921</Text>
        </View>
        <View style={styles.headerCenter}>
          <View style={styles.phaseRow}>
            <Text style={styles.phaseIcon}>🌙</Text>
            <Text style={styles.phaseLabel}>NIGHT PHASE</Text>
          </View>
          <View style={styles.timerRow}>
            <Text style={styles.timerIcon}>⏳</Text>
            <Text style={styles.timerText}>{timerStr}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setMicOn(!micOn)}>
            <Text style={{ fontSize: 18 }}>{micOn ? '🎙' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={{ fontSize: 18 }}>📖</Text>
          </TouchableOpacity>
          <View style={styles.userAvatar}>
            <Text style={{ fontSize: 14 }}>👤</Text>
          </View>
        </View>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <View style={styles.subHeaderLeft}>
          <View style={styles.nightBadge}>
            <Animated.View style={[styles.nightDot, { opacity: pulseOpacity }]} />
            <Text style={styles.nightTitle}>ĐÊM 1</Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>#8921</Text>
            </View>
          </View>
          <View style={styles.roleRow}>
            <Text style={styles.roleIcon}>👁</Text>
            <Text style={styles.roleLabel}>Tiên Tri Khởi Thần</Text>
          </View>
        </View>
        <View style={styles.timerBadge}>
          <Animated.Text style={[styles.timerBadgeText, { opacity: pulseOpacity }]}>{timerStr}</Animated.Text>
        </View>
        <View style={styles.controlBtns}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setMicOn(!micOn)}>
            <Text style={{ fontSize: 15 }}>{micOn ? '🎙' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={{ fontSize: 15 }}>🔊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Text style={{ fontSize: 15 }}>📜</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Arena - Oval seat layout */}
      <View style={styles.arenaWrapper}>
        {/* Center mystic ring */}
        <View style={styles.centerRing}>
          <Svg width={144} height={144} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="46" stroke={Colors.secondary} strokeWidth="1.5" strokeDasharray="2 4" fill="none" opacity={0.2} />
            <Circle cx="50" cy="50" r="34" stroke={Colors.secondary} strokeWidth="0.8" fill="none" opacity={0.2} />
            <Polygon points="50,18 56,44 82,50 56,56 50,82 44,56 18,50 44,44" stroke={Colors.secondary} strokeWidth="0.8" fill="none" opacity={0.2} />
            <Circle cx="50" cy="50" r="6" fill={Colors.secondary} opacity={0.2} />
          </Svg>
          <View style={styles.centerText}>
            <Text style={styles.centerLabel}>Trận Ma Quái</Text>
            <Text style={styles.centerSub}>Chạm ghế để soi căn cước</Text>
          </View>
        </View>

        {/* Seats container */}
        <View style={styles.seatsContainer}>
          {SEATS.map((seat) => {
            const isSelected = selectedSeat === seat.id;
            const isYou = seat.isYou;
            const isTargeted = seat.targeted;

            return (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seatBtn,
                  seat.pos,
                  seat.translateX ? { marginLeft: seat.translateX } : {},
                  isYou && styles.seatBtnYou,
                  isSelected && !isYou && styles.seatBtnSelected,
                ]}
                onPress={() => {
                  if (!isYou) {
                    setSelectedSeat(seat.id);
                    setSelectedName(seat.name);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.seatAvatarWrap,
                  isYou && styles.seatAvatarWrapYou,
                  isSelected && !isYou && styles.seatAvatarWrapSelected,
                ]}>
                  <Text style={styles.seatEmoji}>{seat.emoji}</Text>
                  {isYou && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>✦ Bạn</Text>
                    </View>
                  )}
                  {isSelected && !isYou && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>👁</Text>
                    </View>
                  )}
                  <View style={[styles.seatIdBadge, isYou ? styles.seatIdBadgeYou : isSelected ? styles.seatIdBadgeSelected : {}]}>
                    <Text style={styles.seatIdText}>{seat.id}</Text>
                  </View>
                </View>
                <Text style={[styles.seatName, isYou && styles.seatNameYou, isSelected && !isYou && styles.seatNameSelected]} numberOfLines={1}>
                  {seat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating buttons */}
      <View style={styles.floatingBtns}>
        <TouchableOpacity style={styles.floatingBtn}>
          <Text style={{ fontSize: 18 }}>💬</Text>
          <View style={styles.floatingDot} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floatingBtn, { backgroundColor: `${Colors.tertiaryContainer}E6` }]}>
          <Text style={{ fontSize: 18 }}>❓</Text>
        </TouchableOpacity>
      </View>

      {/* Action Sheet */}
      <View style={styles.actionSheet}>
        <View style={styles.actionSheetInner}>
          <View style={styles.actionSheetHeader}>
            <View style={styles.targetInfo}>
              <View style={styles.targetIconBox}>
                <Text style={{ fontSize: 18 }}>👁</Text>
              </View>
              <View>
                <Text style={styles.targetLabel}>MỤC TIÊU ĐƯỢC CHỌN</Text>
                <Text style={styles.targetName}>Ghế {selectedSeat}: {selectedName}</Text>
              </View>
            </View>
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyText}>🔒 Chỉ bạn thấy kết quả</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowResult(true)}>
            <Text style={styles.confirmBtnIcon}>💾</Text>
            <Text style={styles.confirmBtnText}>SOI LINH HỒN (XÁC NHẬN)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setDrawerExpanded(!drawerExpanded)}
          >
            <Text style={styles.expandBtnText}>Chi tiết quyền năng {drawerExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {drawerExpanded && (
            <View style={styles.roleDesc}>
              <Text style={styles.roleDescIcon}>✨</Text>
              <Text style={styles.roleDescText}>
                Mỗi đêm, Tiên Tri thức giấc và chỉ định một người chơi để biết người đó thuộc phe Dân Làng hay phe Ma Sói.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🛡️', label: 'Arena', active: true },
          { icon: '💬', label: 'Whispers', active: false },
          { icon: '⚔️', label: 'Action', active: false, center: true },
          { icon: '💀', label: 'Graves', active: false },
          { icon: '⚙️', label: 'Sanctum', active: false },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.navTab, tab.center && styles.navTabCenter]}
          >
            <Text style={{ fontSize: tab.center ? 24 : 20 }}>{tab.icon}</Text>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={{ fontSize: 36 }}>✨</Text>
            </View>
            <Text style={styles.modalLabel}>KHẢI HUYỀN HOÀN TẤT</Text>
            <Text style={styles.modalTitle}>Thợ Săn Bạc (Ghế {selectedSeat})</Text>
            <Text style={styles.modalDesc}>
              Linh hồn thuần khiết, thuộc{' '}
              <Text style={styles.modalHighlight}>PHE DÂN LÀNG</Text>
              . Không có dấu vết hắc ám của Ma Sói.
            </Text>
            <View style={styles.modalNote}>
              <Text style={styles.modalNoteText}>🔒 Đã ghi vào sổ tay cá nhân của bạn</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
              setShowResult(false);
              navigation.navigate('DayPhase');
            }}>
              <Text style={styles.modalCloseBtnText}>ĐÓNG KHẢI HUYỀN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 72, paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surface}D9`,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wifiIcon: { fontSize: 14 },
  latency: { color: Colors.secondary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700' },
  roomCode: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 4 },
  headerCenter: { alignItems: 'center' },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  phaseIcon: { fontSize: 16 },
  phaseLabel: { color: Colors.primary, fontSize: FontSizes.labelMd, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerIcon: { fontSize: 12 },
  timerText: { color: Colors.tertiary, fontSize: FontSizes.timerDisplay, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.surfaceContainerHigh}CC`, alignItems: 'center', justifyContent: 'center',
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: 16, marginLeft: 4,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },

  subHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.marginMobile, marginBottom: 4,
    backgroundColor: `${Colors.surfaceContainer}E6`,
    borderRadius: BorderRadius.lg, padding: Spacing.sm,
  },
  subHeaderLeft: {},
  nightBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nightDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  nightTitle: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '700', letterSpacing: 1 },
  roomBadge: {
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2,
  },
  roomBadgeText: { color: Colors.primary, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 2 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  roleIcon: { fontSize: 12, color: Colors.secondary },
  roleLabel: { color: Colors.secondary, fontSize: FontSizes.labelSm, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  timerBadge: {
    backgroundColor: `${Colors.surfaceContainerLowest}E6`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.md,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  timerBadgeText: { color: Colors.primary, fontSize: FontSizes.timerDisplayMobile, fontWeight: '700', letterSpacing: 0 },
  controlBtns: { flexDirection: 'row', gap: 4 },
  controlBtn: {
    width: 32, height: 32, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
  },

  arenaWrapper: {
    flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative',
    paddingHorizontal: Spacing.marginMobile,
  },
  centerRing: {
    position: 'absolute',
    width: 144, height: 144,
    alignItems: 'center', justifyContent: 'center',
  },
  centerText: { position: 'absolute', alignItems: 'center' },
  centerLabel: { color: Colors.secondary, fontSize: FontSizes.labelSm, fontWeight: '700', textTransform: 'uppercase' },
  centerSub: { color: Colors.onSurfaceVariant, fontSize: 10, textAlign: 'center' },
  seatsContainer: {
    width: '100%', maxWidth: 360, height: 440, position: 'relative',
  },
  seatBtn: {
    position: 'absolute', flexDirection: 'column', alignItems: 'center',
  },
  seatBtnYou: {},
  seatBtnSelected: {},
  seatAvatarWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    borderWidth: 2, borderColor: Colors.surfaceContainerHighest,
  },
  seatAvatarWrapYou: {
    borderColor: Colors.tertiary,
    shadowColor: Colors.tertiary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 8,
  },
  seatAvatarWrapSelected: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8,
  },
  seatEmoji: { fontSize: 22 },
  youBadge: {
    position: 'absolute', top: -10, left: '50%', marginLeft: -20,
    backgroundColor: Colors.tertiary, paddingHorizontal: 4, paddingVertical: 1, borderRadius: BorderRadius.full,
  },
  youBadgeText: { color: Colors.onTertiary, fontSize: 8, fontWeight: '700' },
  selectedBadge: {
    position: 'absolute', top: -8, right: -4,
    backgroundColor: Colors.secondary, width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  selectedBadgeText: { fontSize: 10 },
  seatIdBadge: {
    position: 'absolute', bottom: -5,
    backgroundColor: Colors.surfaceDim, paddingHorizontal: 4, paddingVertical: 1, borderRadius: BorderRadius.full,
  },
  seatIdBadgeYou: { backgroundColor: Colors.tertiary },
  seatIdBadgeSelected: { backgroundColor: Colors.secondary },
  seatIdText: { color: Colors.onSurface, fontSize: 9, fontWeight: '700' },
  seatName: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 8, maxWidth: 60, textAlign: 'center' },
  seatNameYou: { color: Colors.tertiary, fontWeight: '700' },
  seatNameSelected: { color: Colors.secondary, fontWeight: '700' },

  floatingBtns: {
    position: 'absolute', right: 12, bottom: 200,
    flexDirection: 'column', gap: 8,
  },
  floatingBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: `${Colors.surfaceContainerHigh}E6`,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  floatingDot: {
    position: 'absolute', top: 0, right: 0,
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.secondary,
  },

  actionSheet: {
    paddingHorizontal: Spacing.marginMobile, paddingBottom: 8,
  },
  actionSheetInner: {
    backgroundColor: `${Colors.surfaceContainerLow}F2`,
    borderRadius: 16, padding: Spacing.md, gap: Spacing.sm,
  },
  actionSheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 },
  targetInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  targetIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.secondaryContainer, alignItems: 'center', justifyContent: 'center',
  },
  targetLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', letterSpacing: 1.5 },
  targetName: { color: Colors.secondary, fontSize: FontSizes.headlineSm, fontWeight: '700' },
  privacyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  privacyText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  confirmBtnIcon: { fontSize: 18 },
  confirmBtnText: {
    color: Colors.onPrimary, fontSize: FontSizes.headlineSm,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
  },
  expandBtn: { alignItems: 'center', paddingTop: 4 },
  expandBtnText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, textTransform: 'uppercase', letterSpacing: 1.5 },
  roleDesc: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: `${Colors.surfaceContainer}B3`, borderRadius: BorderRadius.md, padding: 10,
  },
  roleDescIcon: { fontSize: 18 },
  roleDescText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, flex: 1, lineHeight: 18 },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    height: 72, paddingHorizontal: Spacing.gutterMobile,
    backgroundColor: `${Colors.surfaceDim}E6`,
    borderTopWidth: 1, borderTopColor: Colors.outlineVariant,
  },
  navTab: { flexDirection: 'column', alignItems: 'center', minWidth: 48, height: 48, justifyContent: 'center' },
  navTabCenter: {
    width: 56, height: 56, borderRadius: BorderRadius.lg, marginTop: -16,
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.primaryContainer, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8,
  },
  navLabel: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm, marginTop: 2 },
  navLabelActive: { color: Colors.primary, fontWeight: '700' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, padding: Spacing.lg,
    alignItems: 'center', width: '100%', maxWidth: 320, gap: 12,
  },
  modalIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.secondaryContainer, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12,
  },
  modalLabel: { color: Colors.secondary, fontSize: FontSizes.labelMd, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  modalTitle: { color: Colors.onSurface, fontSize: FontSizes.headlineSm, fontWeight: '700', textAlign: 'center' },
  modalDesc: { color: Colors.onSurfaceVariant, fontSize: FontSizes.bodySm, textAlign: 'center', lineHeight: 18 },
  modalHighlight: { color: Colors.secondary, fontWeight: '700' },
  modalNote: {
    backgroundColor: Colors.surfaceContainer, padding: 10, borderRadius: BorderRadius.md,
    width: '100%', alignItems: 'center',
  },
  modalNoteText: { color: Colors.onSurfaceVariant, fontSize: FontSizes.labelSm },
  modalCloseBtn: {
    width: '100%', paddingVertical: 10, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center',
  },
  modalCloseBtnText: { color: Colors.onSurface, fontSize: FontSizes.labelMd, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
});
