import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';

interface PlayerSeat {
  id: string;
  seatNum: string;
  name: string;
  roleTitle?: string;
  isAlive: boolean;
  isSpeaking?: boolean;
  isUser?: boolean;
  isHost?: boolean;
  statusText: string;
}

const PLAYERS: PlayerSeat[] = [
  { id: '1', seatNum: 'I', name: 'TrưởngLàng', isAlive: true, isSpeaking: true, isHost: true, statusText: 'Đang nói...' },
  { id: '2', seatNum: 'II', name: 'BảoKê', isAlive: true, statusText: 'Im lặng' },
  { id: '3', seatNum: 'III', name: 'ThuốcNam', isAlive: true, statusText: 'Im lặng' },
  { id: '4', seatNum: 'IV', name: 'ThợSăn', isAlive: true, statusText: 'Im lặng' },
  { id: '5', seatNum: 'V', name: 'BánhMì', roleTitle: 'MộngDu', isAlive: false, statusText: 'Tử Nạn' },
  { id: '6', seatNum: 'VI', name: 'ThầnĐạo', isAlive: true, statusText: 'Im lặng' },
  { id: '7', seatNum: 'VII', name: 'TiênTri', roleTitle: 'Phe Dân Làng', isAlive: true, isUser: true, statusText: 'Bạn (Tiên Tri)' },
  { id: '8', seatNum: 'VIII', name: 'HiệpSĩ', isAlive: true, statusText: 'Im lặng' },
  { id: '9', seatNum: 'IX', name: 'HọcGiả', isAlive: true, statusText: 'Im lặng' },
  { id: '10', seatNum: 'X', name: 'BáTước', isAlive: true, statusText: 'Im lặng' },
  { id: '11', seatNum: 'XI', name: 'CôĐảo', isAlive: true, statusText: 'Im lặng' },
  { id: '12', seatNum: 'XII', name: 'NữTuSĩ', isAlive: true, statusText: 'Im lặng' },
];

export default function DayPhaseScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.dayBanner}>
          <View style={styles.dayBannerLeft}>
            <View style={styles.sunBadge}>
              <Text style={styles.sunBadgeIcon}>🌅</Text>
            </View>
            <View>
              <Text style={styles.dayPhaseTitle}>NGÀY 1 — NGHỊ ÁN</Text>
              <Text style={styles.dayPhaseSubtitle}>Bình Minh Lạnh Giá • Thảo Luận</Text>
            </View>
          </View>

          <View style={styles.timerChip}>
            <Animated.Text style={[styles.timerIcon, { transform: [{ scale: pulseAnim }] }]}>
              ⏳
            </Animated.Text>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <View style={styles.deathCard}>
          <View style={styles.deathBorderLeft} />
          <View style={styles.deathCardInner}>
            <View style={styles.skullBadge}>
              <Text style={styles.skullIcon}>💀</Text>
            </View>
            <View style={styles.deathTextGroup}>
              <View style={styles.deathHeaderRow}>
                <Text style={styles.deathTitle}>ĐÊM QUA CÓ 1 NGƯỜI CHẾT</Text>
                <Text style={styles.deathSubTag}>ĐÊM 1 TÀN TỘI</Text>
              </View>
              <Text style={styles.deathDesc}>
                Ghế <Text style={styles.highlightSeat}>V</Text> — <Text style={styles.highlightName}>Bánh Mì</Text> (MộngDu) đã bị phanh thây trong sương đêm.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arenaContainer}>
          <View style={styles.arenaHeader}>
            <Text style={styles.arenaHeaderTitle}>👥 BÀN ĐÁ 12 CHIẾC GHẾ</Text>
            <View style={styles.seatStats}>
              <View style={[styles.dot, styles.dotGreen]} />
              <Text style={styles.statGreen}>11 Sống</Text>
              <Text style={styles.statDivider}>•</Text>
              <View style={[styles.dot, styles.dotRed]} />
              <Text style={styles.statRed}>1 Tử Nạn</Text>
            </View>
          </View>

          <View style={styles.seatsGrid}>
            {PLAYERS.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.seatTile,
                  player.isSpeaking && styles.seatTileSpeaking,
                  player.isUser && styles.seatTileUser,
                  !player.isAlive && styles.seatTileDead,
                ]}
                activeOpacity={0.8}
              >
                {player.isHost && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostBadgeText}>⭐ HOST</Text>
                  </View>
                )}
                {player.isUser && (
                  <View style={styles.userBadge}>
                    <Text style={styles.userBadgeText}>BẠN</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.avatarRing,
                    player.isSpeaking && styles.avatarRingSpeaking,
                    player.isUser && styles.avatarRingUser,
                    !player.isAlive && styles.avatarRingDead,
                  ]}
                >
                  <Image
                    source={{ uri: SEAT_AVATAR_IMAGES[player.seatNum] }}
                    style={[styles.avatarImg, !player.isAlive && styles.avatarImgDead]}
                    resizeMode="cover"
                  />

                  {player.isSpeaking && (
                    <View style={styles.speakingIndicator}>
                      <Text style={styles.speakingWaves}>📢</Text>
                    </View>
                  )}
                </View>

                <View style={styles.seatMeta}>
                  <Text style={[styles.seatNum, player.isUser && styles.seatNumUser]}>
                    {player.seatNum}.
                  </Text>
                  <Text
                    style={[
                      styles.playerName,
                      player.isUser && styles.playerNameUser,
                      !player.isAlive && styles.playerNameDead,
                    ]}
                    numberOfLines={1}
                  >
                    {player.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.seatStatusText,
                    player.isSpeaking && styles.statusSpeaking,
                    player.isUser && styles.statusUser,
                    !player.isAlive && styles.statusDead,
                  ]}
                >
                  {player.statusText}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.transcriptCard}>
          <View style={styles.transcriptHeader}>
            <Text style={styles.speakerTitle}>🗣️ TrưởngLàng (Ghế I) đang phát biểu:</Text>
            <View style={styles.audioWaveBox}>
              <Text style={styles.waveAnim}>📊 0:14s</Text>
            </View>
          </View>
          <Text style={styles.transcriptBody}>
            "Đêm qua Tiên Tri có soi được ai không? Bánh Mì chết có thể là điềm báo Sói đã nhắm tới nhóm lập luận. Tôi đề nghị mọi người tập trung soi dấu hiệu nghi vấn ở Ghế III và Ghế IX!"
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setIsMicOn(!isMicOn)}
        >
          <Text style={styles.actionBtnIcon}>{isMicOn ? '🎙️' : '🔇'}</Text>
          <Text style={[styles.actionBtnLabel, isMicOn && styles.actionBtnLabelActive]}>
            {isMicOn ? 'Bật Mic' : 'Tắt Mic'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setIsAudioOn(!isAudioOn)}
        >
          <Text style={styles.actionBtnIcon}>{isAudioOn ? '🔊' : '🔈'}</Text>
          <Text style={styles.actionBtnLabel}>
            {isAudioOn ? 'Bật Loa' : 'Tắt Loa'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, raisedHand && styles.actionBtnActive]}
          onPress={() => setRaisedHand(!raisedHand)}
        >
          <Text style={styles.actionBtnIcon}>✋</Text>
          <Text style={[styles.actionBtnLabel, raisedHand && styles.actionBtnLabelActive]}>
            {raisedHand ? 'Đã Giơ Tay' : 'Giơ Tay'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtnPrimary]}
          onPress={() => onNavigate && onNavigate('VotingPhase')}
        >
          <Text style={styles.actionBtnPrimaryText}>⚖️ Bỏ Phiếu</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showLogModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📜 Biên Niên Sử Trận Đấu</Text>
              <TouchableOpacity onPress={() => setShowLogModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.logItem}>
                <Text style={styles.logTime}>Đêm 1 - 00:00</Text>
                <Text style={styles.logText}>Bắt đầu trận đấu. 12 người chơi nhận vai trò bí mật.</Text>
              </View>
              <View style={styles.logItem}>
                <Text style={styles.logTime}>Đêm 1 - 00:30</Text>
                <Text style={styles.logText}>Tiên Tri đã thực hiện kiểm tra thân phận thành công.</Text>
              </View>
              <View style={styles.logItem}>
                <Text style={styles.logTime}>Bình Minh Day 1</Text>
                <Text style={styles.logText}>Dân làng phát hiện Bánh Mì (Ghế V) tử nạn.</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 56, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: `${Colors.surfaceContainer}E6`,
    borderBottomWidth: 1, borderBottomColor: `${Colors.outline}26`,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerSunIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryContainer,
    justifyContent: 'center', alignItems: 'center',
  },
  sunSymbol: { fontSize: 16 },
  arenaBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  arenaTitle: { fontSize: 11, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  roomCode: { fontSize: 11, color: Colors.tertiary, fontWeight: '700' },
  playerCount: { fontSize: 11, color: Colors.secondary },
  headerControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
  },
  iconButtonActive: { backgroundColor: Colors.primaryContainer },
  iconText: { fontSize: 16 },
  logButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: Colors.surfaceContainerHighest },
  logButtonText: { fontSize: 11, color: Colors.onSurface, fontWeight: '600' },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 12, gap: 12 },
  dayBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainerHigh}CC`, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
  },
  dayBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sunBadge: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.tertiaryContainer,
    justifyContent: 'center', alignItems: 'center',
  },
  sunBadgeIcon: { fontSize: 18 },
  dayPhaseTitle: { fontSize: 13, fontWeight: '700', color: Colors.tertiary, letterSpacing: 0.5 },
  dayPhaseSubtitle: { fontSize: 11, color: Colors.onSurfaceVariant },
  timerChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  timerIcon: { fontSize: 14 },
  timerText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  deathCard: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  deathBorderLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.primary },
  deathCardInner: { padding: 12, paddingLeft: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  skullBadge: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primaryContainer,
    justifyContent: 'center', alignItems: 'center',
  },
  skullIcon: { fontSize: 20 },
  deathTextGroup: { flex: 1 },
  deathHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deathTitle: { fontSize: 12, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 },
  deathSubTag: { fontSize: 9, color: Colors.outline, fontWeight: '600' },
  deathDesc: { fontSize: 12, color: Colors.onSurface, marginTop: 4, lineHeight: 16 },
  highlightSeat: { fontWeight: '700', color: Colors.primary },
  highlightName: { fontWeight: '600', color: Colors.onSurface },
  arenaContainer: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 12, gap: 10 },
  arenaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arenaHeaderTitle: { fontSize: 11, fontWeight: '700', color: Colors.onSurfaceVariant, letterSpacing: 1 },
  seatStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotGreen: { backgroundColor: Colors.secondary },
  dotRed: { backgroundColor: Colors.primary },
  statGreen: { fontSize: 10, color: Colors.secondary },
  statDivider: { fontSize: 10, color: Colors.outline },
  statRed: { fontSize: 10, color: Colors.primary },
  seatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  seatTile: {
    width: '31%', backgroundColor: Colors.surfaceContainer, borderRadius: 10, padding: 8,
    alignItems: 'center', position: 'relative', borderWidth: 1, borderColor: 'transparent',
  },
  seatTileSpeaking: { borderColor: Colors.secondary, backgroundColor: Colors.surfaceContainerHigh },
  seatTileUser: { borderColor: Colors.tertiary, backgroundColor: Colors.surfaceContainerHigh },
  seatTileDead: { opacity: 0.5, backgroundColor: Colors.surfaceDim },
  hostBadge: {
    position: 'absolute', top: 4, right: 4, backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, zIndex: 10,
  },
  hostBadgeText: { fontSize: 8, fontWeight: '700', color: Colors.tertiary },
  userBadge: {
    position: 'absolute', top: -6, alignSelf: 'center', backgroundColor: Colors.secondary,
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, zIndex: 10,
  },
  userBadgeText: { fontSize: 8, fontWeight: '700', color: Colors.onSecondary },
  avatarRing: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center', alignItems: 'center', marginVertical: 4, position: 'relative',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 20 },
  avatarImgDead: { opacity: 0.4 },
  avatarRingSpeaking: { borderWidth: 2, borderColor: Colors.secondary },
  avatarRingUser: { borderWidth: 2, borderColor: Colors.tertiary },
  avatarRingDead: { backgroundColor: Colors.primaryContainer },
  speakingIndicator: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.secondary,
    borderRadius: 8, padding: 2, zIndex: 10,
  },
  speakingWaves: { fontSize: 9 },
  seatMeta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seatNum: { fontSize: 10, fontWeight: '700', color: Colors.outline },
  seatNumUser: { color: Colors.secondary },
  playerName: { fontSize: 11, color: Colors.onSurface, fontWeight: '600' },
  playerNameUser: { color: Colors.secondary, fontWeight: '700' },
  playerNameDead: { textDecorationLine: 'line-through', color: Colors.primary },
  seatStatusText: { fontSize: 9, color: Colors.outline, marginTop: 2 },
  statusSpeaking: { color: Colors.secondary, fontWeight: '600' },
  statusUser: { color: Colors.tertiary },
  statusDead: { color: Colors.primary, fontWeight: '700' },
  transcriptCard: {
    backgroundColor: Colors.surfaceContainer, borderRadius: 12, padding: 12, gap: 8,
    borderWidth: 1, borderColor: `${Colors.secondary}33`,
  },
  transcriptHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  speakerTitle: { fontSize: 11, fontWeight: '700', color: Colors.secondary },
  audioWaveBox: { backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  waveAnim: { fontSize: 10, color: Colors.tertiary },
  transcriptBody: { fontSize: 12, color: Colors.onSurface, fontStyle: 'italic', lineHeight: 18 },
  actionBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`, gap: 10,
  },
  actionBtn: {
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh,
  },
  actionBtnActive: { backgroundColor: Colors.tertiaryContainer },
  actionBtnIcon: { fontSize: 18 },
  actionBtnLabel: { fontSize: 10, color: Colors.onSurfaceVariant, marginTop: 2 },
  actionBtnLabelActive: { color: Colors.tertiary, fontWeight: '700' },
  actionBtnPrimary: {
    flex: 1, height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  actionBtnPrimaryText: { fontSize: 13, fontWeight: '700', color: Colors.onPrimaryContainer },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surfaceContainer, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 16, maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  modalTitle: { fontSize: 14, fontWeight: '700', color: Colors.tertiary },
  closeBtnText: { fontSize: 18, color: Colors.onSurface, fontWeight: '700' },
  modalScroll: { marginTop: 12 },
  logItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  logTime: { fontSize: 10, color: Colors.secondary, fontWeight: '700' },
  logText: { fontSize: 12, color: Colors.onSurface, marginTop: 2 },
});
