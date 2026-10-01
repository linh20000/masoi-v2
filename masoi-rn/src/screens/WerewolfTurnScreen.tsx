import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES, ROLE_CARD_IMAGES } from '../theme/images';

interface SeatTarget {
  id: string;
  name: string;
  votesCount: number;
  votedBy: string[];
}

const TARGET_LIST: SeatTarget[] = [
  { id: 'I', name: 'TrưởngLàng', votesCount: 2, votedBy: ['Bạn', 'Sói Con'] },
  { id: 'II', name: 'BảoKê', votesCount: 0, votedBy: [] },
  { id: 'III', name: 'ThuốcNam', votesCount: 1, votedBy: ['Sói Tuyết'] },
  { id: 'IV', name: 'ThợSăn', votesCount: 0, votedBy: [] },
  { id: 'V', name: 'BánhMì', votesCount: 0, votedBy: [] },
  { id: 'VI', name: 'ThầnĐạo', votesCount: 0, votedBy: [] },
  { id: 'VIII', name: 'HiệpSĩ', votesCount: 0, votedBy: [] },
  { id: 'IX', name: 'HọcGiả', votesCount: 0, votedBy: [] },
  { id: 'X', name: 'BáTước', votesCount: 0, votedBy: [] },
  { id: 'XI', name: 'CôĐảo', votesCount: 0, votedBy: [] },
  { id: 'XII', name: 'NữTuSĩ', votesCount: 0, votedBy: [] },
];

export default function WerewolfTurnScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedTarget, setSelectedTarget] = useState<string>('I');
  const [timer, setTimer] = useState(25);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [wolfChatText, setWolfChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sói Tuyết (Ghế II)', text: 'Thịt Trưởng Làng đêm nay đi anh em!', isMe: false },
    { sender: 'Sói Con (Ghế VI)', text: 'Em theo số đông nhé!', isMe: false },
    { sender: 'Bạn (Sói Thường)', text: 'Chốt Ghế I Trưởng Làng!', isMe: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = () => {
    if (!wolfChatText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'Bạn (Sói Thường)', text: wolfChatText.trim(), isMe: true },
    ]);
    setWolfChatText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Crimson Werewolf Glow */}
      <View style={styles.crimsonGlow} pointerEvents="none" />

      {/* HUD Bar */}
      <View style={styles.hudBar}>
        <View style={styles.hudLeft}>
          <View style={styles.wolfIconBox}>
            <Text style={{ fontSize: 16 }}>🐺</Text>
          </View>
          <View>
            <Text style={styles.hudTitle}>PHE MA SÓI HỘI Ý</Text>
            <Text style={styles.hudSub}>Đêm 1 • Chọn con mồi đêm nay</Text>
          </View>
        </View>

        <View style={styles.timerBadge}>
          <Text style={styles.timerIcon}>⏳</Text>
          <Text style={styles.timerText}>00:{String(timer).padStart(2, '0')}</Text>
        </View>
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        {/* Pack Members Banner */}
        <View style={styles.packBanner}>
          <Text style={styles.packBannerTitle}>🐺 ĐỒNG BANH PHE SÓI (3 THÀNH VIÊN)</Text>
          <View style={styles.packRow}>
            <View style={[styles.packChip, styles.packChipActive]}>
              <Text style={styles.packChipText}>Ghế VII: Bạn (Sói Thường)</Text>
            </View>
            <View style={styles.packChip}>
              <Text style={styles.packChipText}>Ghế II: Sói Tuyết</Text>
            </View>
            <View style={styles.packChip}>
              <Text style={styles.packChipText}>Ghế VI: Sói Con</Text>
            </View>
          </View>
        </View>

        {/* Target Selection Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 CHỌN MỤC TIÊU CẮT CỔ ĐÊM NAY</Text>
          <Text style={styles.sectionSub}>Chạm vào người chơi để đồng thuận chọn mồi</Text>
        </View>

        {/* Targets Grid */}
        <View style={styles.targetsGrid}>
          {TARGET_LIST.map((target) => {
            const isSelected = selectedTarget === target.id;
            return (
              <TouchableOpacity
                key={target.id}
                style={[
                  styles.targetCard,
                  isSelected && styles.targetCardSelected,
                ]}
                onPress={() => setSelectedTarget(target.id)}
                activeOpacity={0.85}
              >
                <View style={styles.targetAvatarWrap}>
                  <Image
                    source={{ uri: SEAT_AVATAR_IMAGES[target.id] }}
                    style={styles.targetAvatarImg}
                    resizeMode="cover"
                  />
                  {target.votesCount > 0 && (
                    <View style={styles.voteBadge}>
                      <Text style={styles.voteBadgeText}>🐺 {target.votesCount}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.targetSeatId}>Ghế {target.id}</Text>
                <Text style={[styles.targetName, isSelected && styles.targetNameSelected]} numberOfLines={1}>
                  {target.name}
                </Text>

                {isSelected && (
                  <View style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>MỤC TIÊU</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Internal Pack Chat Stream */}
        <View style={styles.chatSection}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>💬 KÊNH CHAT NỘI BỘ PHE SÓI</Text>
            <Text style={styles.chatHeaderTag}>BẢO MẬT KÍN</Text>
          </View>

          <View style={styles.chatBox}>
            {chatMessages.map((msg, idx) => (
              <View key={idx} style={[styles.msgRow, msg.isMe && styles.msgRowMe]}>
                <Text style={[styles.msgSender, msg.isMe && styles.msgSenderMe]}>{msg.sender}:</Text>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Footer Bar */}
      <View style={styles.footerBar}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTargetLabel}>Mục tiêu thống nhất:</Text>
          <Text style={styles.footerTargetVal}>Ghế {selectedTarget}: TrưởngLàng</Text>
        </View>

        <TouchableOpacity
          style={styles.biteBtn}
          onPress={() => setShowConfirmModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.biteBtnIcon}>🗡️</Text>
          <Text style={styles.biteBtnText}>XÁC NHẬN CẮN</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: ROLE_CARD_IMAGES.werewolf }}
              style={styles.modalCardImg}
              resizeMode="cover"
            />
            <Text style={styles.modalTitle}>HỘI Ý MA SÓI HOÀN TẤT</Text>
            <Text style={styles.modalDesc}>
              Phe Ma Sói đã thống nhất nhắm vào <Text style={styles.modalHighlight}>Ghế {selectedTarget}: TrưởngLàng</Text>.
              Mục tiêu sẽ bị phanh thây khi bình minh hé rạng.
            </Text>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setShowConfirmModal(false);
                if (onNavigate) onNavigate('DayPhase');
              }}
            >
              <Text style={styles.modalCloseBtnText}>CHỜ BÌNH MINH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  crimsonGlow: {
    position: 'absolute', top: -50, right: -50, width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(138,18,26,0.3)',
  },
  hudBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile, paddingVertical: 10,
    backgroundColor: `${Colors.surfaceContainer}E6`, borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  hudLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wolfIconBox: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  hudTitle: { color: Colors.primary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  hudSub: { color: Colors.onSurfaceVariant, fontSize: 10 },
  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerLowest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  timerIcon: { fontSize: 12 },
  timerText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14 },

  packBanner: {
    backgroundColor: `${Colors.primaryContainer}40`, borderRadius: 12, padding: 12, gap: 8,
    borderWidth: 1, borderColor: `${Colors.primary}40`,
  },
  packBannerTitle: { color: Colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  packRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  packChip: {
    backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  packChipActive: { backgroundColor: Colors.primaryContainer },
  packChipText: { color: Colors.onSurface, fontSize: 10, fontWeight: '600' },

  sectionHeader: {},
  sectionTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sectionSub: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },

  targetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  targetCard: {
    width: '31%', backgroundColor: Colors.surfaceContainer, borderRadius: 10, padding: 8,
    alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent', position: 'relative',
  },
  targetCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.surfaceContainerHigh },
  targetAvatarWrap: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', position: 'relative', marginBottom: 4 },
  targetAvatarImg: { width: '100%', height: '100%' },
  voteBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 4, borderRadius: 6,
  },
  voteBadgeText: { color: Colors.onPrimaryContainer, fontSize: 9, fontWeight: '700' },
  targetSeatId: { color: Colors.outline, fontSize: 9, fontWeight: '700' },
  targetName: { color: Colors.onSurface, fontSize: 11, fontWeight: '600' },
  targetNameSelected: { color: Colors.primary, fontWeight: '700' },
  selectedTag: {
    backgroundColor: Colors.primary, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, marginTop: 4,
  },
  selectedTagText: { color: Colors.onPrimary, fontSize: 7, fontWeight: '700' },

  chatSection: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 12, gap: 8 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatHeaderTitle: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },
  chatHeaderTag: { color: Colors.outline, fontSize: 9, fontWeight: '700' },
  chatBox: { gap: 6 },
  msgRow: { flexDirection: 'row', gap: 4 },
  msgRowMe: {},
  msgSender: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },
  msgSenderMe: { color: Colors.tertiary },
  msgText: { color: Colors.onSurface, fontSize: 11, flex: 1 },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  footerInfo: { flex: 1 },
  footerTargetLabel: { color: Colors.onSurfaceVariant, fontSize: 10 },
  footerTargetVal: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  biteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryContainer, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10,
  },
  biteBtnIcon: { fontSize: 16 },
  biteBtnText: { color: Colors.onPrimaryContainer, fontSize: 12, fontWeight: '700', letterSpacing: 1 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, padding: Spacing.lg,
    alignItems: 'center', width: '100%', maxWidth: 320, gap: 12,
  },
  modalCardImg: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: Colors.primary },
  modalTitle: { color: Colors.primary, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  modalDesc: { color: Colors.onSurfaceVariant, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  modalHighlight: { color: Colors.primary, fontWeight: '700' },
  modalCloseBtn: {
    width: '100%', paddingVertical: 12, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryContainer, alignItems: 'center', marginTop: 4,
  },
  modalCloseBtnText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
});
