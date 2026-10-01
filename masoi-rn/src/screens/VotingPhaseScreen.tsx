import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';
import { mockServer } from '../engine/mockStepCallServer';

interface VotingCandidate {
  id: string;
  seatNum: string;
  name: string;
  votes: number;
  votedBy: string[];
  isUserSelected?: boolean;
  isSuspectNumberOne?: boolean;
  isAlive: boolean;
  isUser?: boolean;
}

const CANDIDATES: VotingCandidate[] = [
  { id: '1', seatNum: 'I', name: 'TrưởngLàng', votes: 1, votedBy: ['IV'], isAlive: true },
  { id: '2', seatNum: 'II', name: 'BảoKê', votes: 2, votedBy: ['III', 'IX'], isAlive: true },
  { id: '3', seatNum: 'III', name: 'ThuốcNam', votes: 0, votedBy: [], isAlive: true },
  { id: '4', seatNum: 'IV', name: 'ThợSăn', votes: 0, votedBy: [], isAlive: true },
  { id: '5', seatNum: 'V', name: 'BánhMì', votes: 0, votedBy: [], isAlive: false },
  { id: '6', seatNum: 'VI', name: 'ThầnĐạo', votes: 0, votedBy: [], isAlive: true },
  { id: '7', seatNum: 'VII', name: 'TiênTri (BẠN)', votes: 0, votedBy: [], isAlive: true, isUser: true },
  { id: '8', seatNum: 'VIII', name: 'HiệpSĩ', votes: 1, votedBy: ['XI'], isAlive: true },
  { id: '9', seatNum: 'IX', name: 'HọcGiả', votes: 0, votedBy: [], isAlive: true },
  { id: '10', seatNum: 'X', name: 'BáTước', votes: 5, votedBy: ['VII (BẠN)', 'VIII', 'I', 'II', 'VI'], isUserSelected: true, isSuspectNumberOne: true, isAlive: true },
  { id: '11', seatNum: 'XI', name: 'CôĐảo', votes: 0, votedBy: [], isAlive: true },
  { id: '12', seatNum: 'XII', name: 'NữTuSĩ', votes: 1, votedBy: ['X'], isAlive: true },
];

export default function VotingPhaseScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedSeat, setSelectedSeat] = useState<string>('X');
  const [votesMap, setVotesMap] = useState<VotingCandidate[]>(CANDIDATES);
  const [timeLeft, setTimeLeft] = useState(26);
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVote = (seatNum: string) => {
    setSelectedSeat(seatNum);
    setVotesMap((prev) =>
      prev.map((c) => {
        if (c.seatNum === seatNum) {
          return { ...c, votes: c.votes + 1, isUserSelected: true };
        }
        return { ...c, isUserSelected: false };
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.ruleBanner}>
          <View style={styles.ruleLeft}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>
              Cần <Text style={styles.highlightGold}>6/11</Text> phiếu để hành quyết người bị tình nghi.
            </Text>
          </View>
          <Text style={styles.voteModeTag}>BỎ PHIẾU KÍN</Text>
        </View>

        <View style={styles.tickerBar}>
          <Text style={styles.tickerIcon}>📢</Text>
          <Text style={styles.tickerText} numberOfLines={1}>
            Trưởng Làng đã chuyển phiếu sang Ghế X • Thợ Săn dồn phiếu cho Ghế X...
          </Text>
        </View>

        <View style={styles.candidatesGrid}>
          {votesMap.map((candidate) => {
            const isTarget = candidate.seatNum === selectedSeat;
            return (
              <TouchableOpacity
                key={candidate.id}
                disabled={!candidate.isAlive}
                style={[
                  styles.candidateCard,
                  candidate.isSuspectNumberOne && styles.suspectNumberOneCard,
                  isTarget && styles.selectedCandidateCard,
                  !candidate.isAlive && styles.deadCandidateCard,
                ]}
                onPress={() => handleVote(candidate.seatNum)}
                activeOpacity={0.85}
              >
                {candidate.isSuspectNumberOne && (
                  <View style={styles.topSuspectBadge}>
                    <Text style={styles.topSuspectText}>TÌNH NGHI SỐ 1</Text>
                  </View>
                )}

                <View style={styles.cardHeader}>
                  <Text style={[styles.seatLabel, candidate.isSuspectNumberOne && styles.seatLabelRed]}>
                    {candidate.seatNum}
                  </Text>
                  {candidate.isAlive ? (
                    <View
                      style={[
                        styles.votePill,
                        candidate.votes > 2 && styles.votePillHigh,
                        isTarget && styles.votePillSelected,
                      ]}
                    >
                      <Text style={[styles.votePillText, isTarget && styles.votePillTextSelected]}>
                        {candidate.votes}p
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.skullIcon}>💀</Text>
                  )}
                </View>

                <View style={styles.avatarWrap}>
                  <Image
                    source={{ uri: SEAT_AVATAR_IMAGES[candidate.seatNum] }}
                    style={[styles.avatarImg, !candidate.isAlive && styles.avatarImgDead]}
                    resizeMode="cover"
                  />
                  {candidate.votedBy.length > 0 && candidate.isAlive && (
                    <View style={styles.votersChips}>
                      <Text style={styles.votersCount}>+{candidate.votedBy.length}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text
                    style={[
                      styles.candidateName,
                      candidate.isSuspectNumberOne && styles.candidateNameRed,
                      !candidate.isAlive && styles.candidateNameDead,
                    ]}
                    numberOfLines={1}
                  >
                    {candidate.name}
                  </Text>
                  {isTarget && candidate.isAlive && (
                    <Text style={styles.userChoiceSub}>Đã Chọn</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedSeat && (
          <View style={styles.targetDetailCard}>
            <View style={styles.targetHeader}>
              <Text style={styles.targetTitle}>MỤC TIÊU ĐANG CHỌN: GHẾ {selectedSeat}</Text>
              <Text style={styles.targetVotesCount}>
                {votesMap.find((c) => c.seatNum === selectedSeat)?.votes || 0} Phiếu Thuận
              </Text>
            </View>

            <Text style={styles.targetDesc}>
              Ghế {selectedSeat} hiện đang là người bị nghi ngờ nhiều nhất trong phiên thảo luận bình minh. Nếu tổng số phiếu vượt quá 6, nghi thức hành quyết bằng giàn treo sẽ được tiến hành lập tức.
            </Text>

            <TouchableOpacity
              style={styles.executeModalTrigger}
              onPress={() => setShowExecutionModal(true)}
            >
              <Text style={styles.executeModalTriggerText}>⚖️ Xem Kết Quả Hành Quyết</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => Alert.alert('Bỏ qua', 'Bạn đã chọn bỏ phiếu trắng.')}
        >
          <Text style={styles.skipBtnText}>⚪ Bỏ Phiếu Trắng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmVoteBtn}
          onPress={() => setShowExecutionModal(true)}
        >
          <Text style={styles.confirmVoteBtnText}>🔥 Khóa Phiếu Ghế {selectedSeat}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showExecutionModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.executionModalBox}>
            <Text style={styles.modalSkull}>🔥 ⚖️ 🔥</Text>
            <Text style={styles.executionTitle}>KẾT QUẢ NGHỊ ÁN DAY 1</Text>

            <View style={styles.executedPersonRow}>
              <Text style={styles.executedSeatText}>GHẾ X — BáTước</Text>
              <Text style={styles.executedVotesDetail}>5/11 Phiếu • Đã bị treo cổ</Text>
            </View>

            <Text style={styles.executionStory}>
              Dưới sự đồng thuận của Dân Làng, BáTước (Ghế X) bị giải lên giàn treo cổ tại quảng trường trung tâm. Ngọn lửa công lý được thắp lên...
            </Text>

            <View style={styles.roleRevealSnippet}>
              <Text style={styles.roleRevealSnippetTitle}>Bản Án Khép Lại:</Text>
              <Text style={styles.roleRevealSnippetText}>
                Ghế X chính là: <Text style={styles.werewolfText}>Ma Sói Thường (Faction Werewolf)</Text>!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalContinueBtn}
              onPress={() => {
                setShowExecutionModal(false);
                mockServer.startNextNightPhase();
                if (onNavigate) onNavigate('NightPhase');
              }}
            >
              <Text style={styles.modalContinueBtnText}>🌙 QUẢN TRÒ: BẮT ĐẦU ĐÊM MỚI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalContinueBtn, { backgroundColor: '#282a2d', marginTop: 8 }]}
              onPress={() => {
                setShowExecutionModal(false);
                if (onNavigate) onNavigate('GameOver');
              }}
            >
              <Text style={[styles.modalContinueBtnText, { color: Colors.onSurfaceVariant }]}>🏆 KẾT THÚC VÁN ĐẤU (XEM KẾT QUẢ)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: `${Colors.surfaceContainer}E6`,
    borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gavelIcon: { fontSize: 22 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  headerSubtitle: { fontSize: 11, color: Colors.onSurfaceVariant },
  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  timerIcon: { fontSize: 12 },
  timerText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  scrollArea: { flex: 1 },
  scrollContent: { padding: 14, gap: 12 },
  ruleBanner: {
    backgroundColor: Colors.surfaceContainer, padding: 12, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ruleLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  ruleText: { fontSize: 11, color: Colors.onSurface },
  highlightGold: { fontWeight: '700', color: Colors.tertiary },
  voteModeTag: { fontSize: 9, color: Colors.outline, fontWeight: '700', letterSpacing: 0.5 },
  tickerBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
  },
  tickerIcon: { fontSize: 12 },
  tickerText: { fontSize: 11, color: Colors.tertiary, flex: 1 },
  candidatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  candidateCard: {
    width: '31%', backgroundColor: Colors.surfaceContainer, borderRadius: 10, padding: 8,
    alignItems: 'center', borderWidth: 1, borderColor: 'transparent', position: 'relative',
  },
  suspectNumberOneCard: { backgroundColor: Colors.primaryContainer, borderColor: Colors.primary },
  selectedCandidateCard: { borderColor: Colors.secondary, backgroundColor: Colors.surfaceContainerHigh },
  deadCandidateCard: { opacity: 0.4, backgroundColor: Colors.surfaceDim },
  topSuspectBadge: {
    position: 'absolute', top: -8, alignSelf: 'center', backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, zIndex: 10,
  },
  topSuspectText: { fontSize: 7, fontWeight: '700', color: Colors.onPrimaryContainer },
  cardHeader: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seatLabel: { fontSize: 11, fontWeight: '700', color: Colors.onSurfaceVariant },
  seatLabelRed: { color: Colors.primary },
  skullIcon: { fontSize: 14 },
  votePill: { backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  votePillHigh: { backgroundColor: Colors.primaryContainer },
  votePillSelected: { backgroundColor: Colors.secondary },
  votePillText: { fontSize: 10, fontWeight: '700', color: Colors.onSurface },
  votePillTextSelected: { color: Colors.onSecondary },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center', alignItems: 'center', marginVertical: 6, position: 'relative', overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 22 },
  avatarImgDead: { opacity: 0.4 },
  votersChips: { position: 'absolute', bottom: -2, right: -4, backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 4, borderRadius: 6, zIndex: 10 },
  votersCount: { fontSize: 9, fontWeight: '700', color: Colors.tertiary },
  cardFooter: { alignItems: 'center' },
  candidateName: { fontSize: 11, fontWeight: '600', color: Colors.onSurface },
  candidateNameRed: { color: Colors.primary, fontWeight: '700' },
  candidateNameDead: { textDecorationLine: 'line-through', color: Colors.outline },
  userChoiceSub: { fontSize: 8, color: Colors.secondary, fontWeight: '700', marginTop: 2 },
  targetDetailCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, gap: 8,
    borderWidth: 1, borderColor: Colors.primaryContainer, marginTop: 6,
  },
  targetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  targetTitle: { fontSize: 11, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 },
  targetVotesCount: { fontSize: 12, fontWeight: '700', color: Colors.tertiary },
  targetDesc: { fontSize: 11, color: Colors.onSurface, lineHeight: 16 },
  executeModalTrigger: {
    marginTop: 4, paddingVertical: 8, backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 8, alignItems: 'center',
  },
  executeModalTriggerText: { fontSize: 11, fontWeight: '700', color: Colors.secondary },
  bottomBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`, gap: 12,
  },
  skipBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh },
  skipBtnText: { fontSize: 11, color: Colors.onSurface, fontWeight: '600' },
  confirmVoteBtn: {
    flex: 1, height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  confirmVoteBtnText: { fontSize: 13, fontWeight: '700', color: Colors.onPrimaryContainer },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center',
    alignItems: 'center', padding: 20,
  },
  executionModalBox: {
    width: '100%', backgroundColor: Colors.surfaceContainer, borderRadius: 16,
    padding: 20, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.primaryContainer,
  },
  modalSkull: { fontSize: 32 },
  executionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  executedPersonRow: {
    alignItems: 'center', backgroundColor: Colors.primaryContainer, paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 10, width: '100%',
  },
  executedSeatText: { fontSize: 14, fontWeight: '700', color: Colors.onPrimaryContainer },
  executedVotesDetail: { fontSize: 11, color: Colors.primary, marginTop: 2 },
  executionStory: { fontSize: 12, color: Colors.onSurface, textAlign: 'center', lineHeight: 18 },
  roleRevealSnippet: { backgroundColor: Colors.surfaceContainerLowest, padding: 10, borderRadius: 8, width: '100%' },
  roleRevealSnippetTitle: { fontSize: 10, color: Colors.outline },
  roleRevealSnippetText: { fontSize: 12, color: Colors.onSurface, marginTop: 2 },
  werewolfText: { fontWeight: '700', color: Colors.primary },
  modalContinueBtn: {
    width: '100%', height: 44, backgroundColor: Colors.tertiaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 4,
  },
  modalContinueBtnText: { fontSize: 13, fontWeight: '700', color: Colors.tertiary },
});
