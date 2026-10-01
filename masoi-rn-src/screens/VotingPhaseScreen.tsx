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
} from 'react-native';

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
  { id: '1', seatNum: 'I', name: 'Bác Thợ', votes: 1, votedBy: ['IV'], isAlive: true },
  { id: '2', seatNum: 'II', name: 'Hoa Tiêu', votes: 2, votedBy: ['III', 'IX'], isAlive: true },
  { id: '3', seatNum: 'III', name: 'Lão Bá', votes: 0, votedBy: [], isAlive: true },
  { id: '4', seatNum: 'IV', name: 'Bá Tước', votes: 0, votedBy: [], isAlive: true },
  { id: '5', seatNum: 'V', name: 'Bánh Mì', votes: 0, votedBy: [], isAlive: false },
  { id: '6', seatNum: 'VI', name: 'Mục Sư', votes: 0, votedBy: [], isAlive: true },
  { id: '7', seatNum: 'VII', name: 'Tiên Tri (BẠN)', votes: 0, votedBy: [], isAlive: true, isUser: true },
  { id: '8', seatNum: 'VIII', name: 'Thợ Săn', votes: 1, votedBy: ['XI'], isAlive: true },
  { id: '9', seatNum: 'IX', name: 'Thầy Thuốc', votes: 0, votedBy: [], isAlive: true },
  { id: '10', seatNum: 'X', name: 'DoThám', votes: 5, votedBy: ['VII (BẠN)', 'VIII', 'I', 'II', 'VI'], isUserSelected: true, isSuspectNumberOne: true, isAlive: true },
  { id: '11', seatNum: 'XI', name: 'Bảo Kê', votes: 0, votedBy: [], isAlive: true },
  { id: '12', seatNum: 'XII', name: 'Thợ Kim Hoàn', votes: 1, votedBy: ['X'], isAlive: true },
];

export const VotingPhaseScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
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
      <StatusBar barStyle="light-content" backgroundColor="#111317" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.gavelIcon}>⚖️</Text>
          <View>
            <Text style={styles.headerTitle}>NGÀY 1 — TREO CỔ</Text>
            <Text style={styles.headerSubtitle}>Nghi Thức Hành Quyết</Text>
          </View>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerIcon}>⏳</Text>
          <Text style={styles.timerText}>00:{timeLeft.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* BANNER REQUIREMENT */}
        <View style={styles.ruleBanner}>
          <View style={styles.ruleLeft}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>
              Cần <Text style={styles.highlightGold}>6/11</Text> phiếu để hành quyết người bị tình nghi.
            </Text>
          </View>
          <Text style={styles.voteModeTag}>BỎ PHIẾU KÍN</Text>
        </View>

        {/* MARQUEE ANNOUNCEMENT */}
        <View style={styles.tickerBar}>
          <Text style={styles.tickerIcon}>📢</Text>
          <Text style={styles.tickerText} numberOfLines={1}>
            Trưởng Làng đã chuyển phiếu sang Ghế X • Thợ Săn dồn phiếu cho Ghế X...
          </Text>
        </View>

        {/* VOTING CANDIDATES GRID */}
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
                  <Text style={styles.avatarEmoji}>
                    {!candidate.isAlive ? '👻' : candidate.isUser ? '🔮' : '👤'}
                  </Text>
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

        {/* TARGET DETAIL CARD */}
        {selectedSeat && (
          <View style={styles.targetDetailCard}>
            <View style={styles.targetHeader}>
              <Text style={styles.targetTitle}>MụC TIÊU ĐANG CHỌN: GHẾ {selectedSeat}</Text>
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

      {/* BOTTOM CONTROL BAR */}
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

      {/* EXECUTION RESOLUTION MODAL */}
      <Modal visible={showExecutionModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.executionModalBox}>
            <Text style={styles.modalSkull}>🔥 ⚖️ 🔥</Text>
            <Text style={styles.executionTitle}>KẾT QUẢ NGHỊ ÁN DAY 1</Text>

            <View style={styles.executedPersonRow}>
              <Text style={styles.executedSeatText}>GHẾ X — DoThám</Text>
              <Text style={styles.executedVotesDetail}>5/11 Phiếu • Đã bị treo cổ</Text>
            </View>

            <Text style={styles.executionStory}>
              Dưới sự đồng thuận của Dân Làng, DoThám (Ghế X) bị giải lên giàn treo cổ tại quảng trường trung tâm. Ngọn lửa công lý được thắp lên...
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
                if (onNavigate) onNavigate('NightPhase');
              }}
            >
              <Text style={styles.modalContinueBtnText}>🌙 Bước Vào Đêm Tiếp Theo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(30, 32, 35, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 138, 137, 0.2)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gavelIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#e0bfbc',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0c0e11',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerIcon: {
    fontSize: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffb3ae',
    fontFamily: 'Courier',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  ruleBanner: {
    backgroundColor: '#1e2023',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  ruleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffb3ae',
  },
  ruleText: {
    fontSize: 11,
    color: '#e2e2e6',
  },
  highlightGold: {
    fontWeight: '700',
    color: '#f1be66',
  },
  voteModeTag: {
    fontSize: 9,
    color: '#a78a87',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tickerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0c0e11',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tickerIcon: {
    fontSize: 12,
  },
  tickerText: {
    fontSize: 11,
    color: '#f1be66',
    flex: 1,
  },
  candidatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  candidateCard: {
    width: '31%',
    backgroundColor: '#1e2023',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  suspectNumberOneCard: {
    backgroundColor: '#3f1014',
    borderColor: '#8a121a',
  },
  selectedCandidateCard: {
    borderColor: '#72d4ee',
    backgroundColor: '#282a2d',
  },
  deadCandidateCard: {
    opacity: 0.4,
    backgroundColor: '#111317',
  },
  topSuspectBadge: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    backgroundColor: '#8a121a',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    zIndex: 10,
  },
  topSuspectText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#ffb3ae',
  },
  cardHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e0bfbc',
  },
  seatLabelRed: {
    color: '#ffb3ae',
  },
  votePill: {
    backgroundColor: '#282a2d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  votePillHigh: {
    backgroundColor: '#8a121a',
  },
  votePillSelected: {
    backgroundColor: '#72d4ee',
  },
  votePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e2e2e6',
  },
  votePillTextSelected: {
    color: '#003641',
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333538',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  votersChips: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: '#5c3f00',
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  votersCount: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f1be66',
  },
  cardFooter: {
    alignItems: 'center',
  },
  candidateName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e2e6',
  },
  candidateNameRed: {
    color: '#ffb3ae',
    fontWeight: '700',
  },
  candidateNameDead: {
    textDecorationLine: 'line-through',
    color: '#a78a87',
  },
  userChoiceSub: {
    fontSize: 8,
    color: '#72d4ee',
    fontWeight: '700',
    marginTop: 2,
  },
  targetDetailCard: {
    backgroundColor: '#1a1c1f',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8a121a',
    marginTop: 6,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 0.5,
  },
  targetVotesCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1be66',
  },
  targetDesc: {
    fontSize: 11,
    color: '#e2e2e6',
    lineHeight: 16,
  },
  executeModalTrigger: {
    marginTop: 4,
    paddingVertical: 8,
    backgroundColor: '#282a2d',
    borderRadius: 8,
    alignItems: 'center',
  },
  executeModalTriggerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#72d4ee',
  },
  bottomBar: {
    height: 64,
    backgroundColor: '#181a1d',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 138, 137, 0.2)',
    gap: 12,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#282a2d',
  },
  skipBtnText: {
    fontSize: 11,
    color: '#e2e2e6',
    fontWeight: '600',
  },
  confirmVoteBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#8a121a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmVoteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  executionModalBox: {
    width: '100%',
    backgroundColor: '#1e2023',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#8a121a',
  },
  modalSkull: {
    fontSize: 32,
  },
  executionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 1,
  },
  executedPersonRow: {
    alignItems: 'center',
    backgroundColor: '#3f1014',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  executedSeatText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  executedVotesDetail: {
    fontSize: 11,
    color: '#ffb3ae',
    marginTop: 2,
  },
  executionStory: {
    fontSize: 12,
    color: '#e2e2e6',
    textAlign: 'center',
    lineHeight: 18,
  },
  roleRevealSnippet: {
    backgroundColor: '#0c0e11',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  roleRevealSnippetTitle: {
    fontSize: 10,
    color: '#a78a87',
  },
  roleRevealSnippetText: {
    fontSize: 12,
    color: '#e2e2e6',
    marginTop: 2,
  },
  werewolfText: {
    fontWeight: '700',
    color: '#ffb3ae',
  },
  modalContinueBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#5c3f00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  modalContinueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1be66',
  },
});

export default VotingPhaseScreen;
