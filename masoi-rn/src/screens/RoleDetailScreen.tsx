import React, { useState } from 'react';
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
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { ROLE_CARD_IMAGES } from '../theme/images';

export interface RoleSpec {
  id: string;
  name: string;
  englishName: string;
  title: string;
  faction: 'Dân Làng' | 'Ma Sói' | 'Phe Thứ Ba';
  difficulty: 'Dễ' | 'Trung Bình' | 'Khó';
  turnOrder: string;
  lifecycle: string;
  actionCode: string;
  imageKey: string;
  dayAbility: string;
  nightAbility: string;
  winCondition: string;
  synergy: string;
  lore: string;
}

export const ROLES_SPEC: RoleSpec[] = [
  {
    id: 'seer',
    name: 'Tiên Tri',
    englishName: 'Seer',
    title: 'Mắt Thần Khai Huyền',
    faction: 'Dân Làng',
    difficulty: 'Trung Bình',
    turnOrder: '#110',
    lifecycle: 'EVERY_NIGHT',
    actionCode: 'seer.inspect',
    imageKey: 'seer',
    dayAbility: 'Tham gia tranh luận và bỏ phiếu như Dân Làng bình thường. Cần ẩn mình để tránh bị Sói cắn sớm.',
    nightAbility: 'Thức giấc mỗi đêm và chọn 1 người chơi. Quản trò trả về kết quả phe Sói hoặc Dân Làng bí mật tuyệt đối.',
    winCondition: 'Loại bỏ toàn bộ Ma Sói khỏi làng Hắc Tùng.',
    synergy: 'Kết hợp tốt với Bảo Kê (che chở ban đêm) và Thợ Săn (kéo Sói theo mồ khi bị lộ).',
    lore: 'Nhìn thấu qua màn đêm u tối, đôi mắt Tiên Tri phản chiếu viễn cảnh tương lai và bản chất linh hồn của từng người dân.',
  },
  {
    id: 'witch',
    name: 'Phù Thủy',
    englishName: 'Witch',
    title: 'Bậc Thầy Thuốc Độc & Độc Dược',
    faction: 'Dân Làng',
    difficulty: 'Khó',
    turnOrder: '#120',
    lifecycle: 'CONDITIONAL (Còn bình)',
    actionCode: 'witch.use_heal / witch.use_poison',
    imageKey: 'witch',
    dayAbility: 'Bỏ phiếu bình thường. Có thể giữ quyền im lặng hoặc hé lộ manh mối nạn nhân ban đêm.',
    nightAbility: 'Sở hữu 2 bình thuốc duy nhất cả trận: 1 Bình Cứu (cứu nạn nhân bị Sói cắn) và 1 Bình Độc (hạ sát 1 người bất kỳ).',
    winCondition: 'Loại bỏ toàn bộ Ma Sói.',
    synergy: 'Biết trước ai bị Sói cắn trong đêm trước khi đưa ra quyết định dùng thuốc.',
    lore: 'Sống trong túp lều rậm rạp sương mù, Phù Thủy nắm giữ sức mạnh sinh tử giữa lòng bàn tay với hai chiếc bình ma thuật.',
  },
  {
    id: 'hunter',
    name: 'Thợ Săn',
    englishName: 'Hunter',
    title: 'Mũi Tên Tàn Tội',
    faction: 'Dân Làng',
    difficulty: 'Trung Bình',
    turnOrder: 'KHI CHẾT',
    lifecycle: 'DEATH_EVENT',
    actionCode: 'hunter.shoot',
    imageKey: 'hunter',
    dayAbility: 'Dùng phát bắn đe dọa để giữ thế chủ động khi tranh luận.',
    nightAbility: 'Không thức giấc ban đêm. Tuy nhiên khi tử nạn (bị Sói cắn hoặc bị treo cổ), Thợ Săn giương cung hạ gục 1 mục tiêu.',
    winCondition: 'Loại bỏ toàn bộ Ma Sói.',
    synergy: 'Là khiên chắn sống đe dọa bầy Sói không dám manh động cắn nhầm.',
    lore: 'Với cây nỏ bạc truyền thừa qua nhiều thế hệ, Thợ Săn không bao giờ nhắm mắt quy tiên mà không kéo theo kẻ thù.',
  },
  {
    id: 'werewolf',
    name: 'Ma Sói',
    englishName: 'Werewolf',
    title: 'Kẻ Săn Đêm Hắc Ám',
    faction: 'Ma Sói',
    difficulty: 'Dễ',
    turnOrder: '#100',
    lifecycle: 'EVERY_NIGHT',
    actionCode: 'wolves.choose_target',
    imageKey: 'werewolf',
    dayAbility: 'Ẩn mình dưới lốt Dân Làng hiền lành, dựng chứng cứ giả định hướng dân làng treo cổ nhầm người.',
    nightAbility: 'Thức giấc cùng bầy Sói, vào kênh thầm thì nội bộ và bỏ phiếu chốt 1 nạn nhân bị xé xác trong đêm.',
    winCondition: 'Số lượng Ma Sói bằng hoặc đông hơn số Dân Làng còn sống.',
    synergy: 'Phối hợp cùng Sói Trắng hoặc Sói Con để gia tăng áp lực cắn nạn nhân.',
    lore: 'Khi ánh trăng máu dâng cao, nanh nanh xé rách lớp da người, để lại quái thú khát máu săn lùng con mồi.',
  },
  {
    id: 'cupid',
    name: 'Thần Tình Yêu',
    englishName: 'Cupid',
    title: 'Nữ Thần Mũi Tên Sinh Tử',
    faction: 'Phe Thứ Ba',
    difficulty: 'Khó',
    turnOrder: '#20',
    lifecycle: 'FIRST_NIGHT_ONLY',
    actionCode: 'cupid.bind_lovers',
    imageKey: 'seer',
    dayAbility: 'Tùy thuộc vào việc bản thân thuộc phe nào sau khi se duyên cho 2 người chơi.',
    nightAbility: 'Thức dậy đầu tiên trong Đêm 1 và bắn mũi tên se duyên cho 2 người bất kỳ. Hai người này trở thành Cặp Đôi Sinh Tử.',
    winCondition: 'Nếu cặp đôi cùng thuộc 1 phe -> Thắng theo phe đó. Nếu khác phe -> Là cặp đôi cuối cùng sống sót.',
    synergy: 'Có thể tự chọn chính mình kết duyên với 1 người chơi khác để tạo phe thứ ba.',
    lore: 'Mũi tên tình yêu đưa hai linh hồn hòa làm một, sống cùng sống, chết cùng chết.',
  },
  {
    id: 'defender',
    name: 'Bảo Vệ',
    englishName: 'Defender',
    title: 'Khiên Hộ Vệ Làng',
    faction: 'Dân Làng',
    difficulty: 'Trung Bình',
    turnOrder: '#70',
    lifecycle: 'EVERY_NIGHT',
    actionCode: 'defender.protect',
    imageKey: 'hunter',
    dayAbility: 'Tham gia thảo luận và bỏ phiếu bình thường.',
    nightAbility: 'Thức giấc mỗi đêm chọn 1 người chơi để dựng khiên chắn bảo vệ khỏi vết cắn Ma Sói. Không bảo vệ 1 người 2 đêm liên tiếp.',
    winCondition: 'Loại bỏ toàn bộ Ma Sói.',
    synergy: 'Đoán hướng cắn của Sói để bảo vệ Tiên Tri hoặc Phù Thủy.',
    lore: 'Tay cầm chiếc khiên thép sương mù, Bảo Vệ thức trắng đêm tuần tra các ngõ ngách bảo vệ dân làng khỏi móng nanh.',
  },
  {
    id: 'angel',
    name: 'Thiên Sứ',
    englishName: 'Angel',
    title: 'Linh Hồn Tử Đạo',
    faction: 'Phe Thứ Ba',
    difficulty: 'Khó',
    turnOrder: 'PASSIVE',
    lifecycle: 'FIRST_DAY_ONLY',
    actionCode: 'angel.martyr_win',
    imageKey: 'seer',
    dayAbility: 'Cố tình hành xử kỳ quặc hoặc gây nghi ngờ trong Ngày 1 để kích động Dân Làng treo cổ mình.',
    nightAbility: 'Không thức giấc ban đêm.',
    winCondition: 'Bị treo cổ ngay trong Ngày 1. Nếu thành công, Thiên Sứ thắng đơn độc lập tức.',
    synergy: 'Nếu không bị treo cổ Ngày 1, Thiên Sứ trở thành Dân Làng bình thường.',
    lore: 'Linh hồn tử đạo tìm kiếm cái chết hiển vinh vào bình minh đầu tiên để bay về cõi vĩnh hằng.',
  },
  {
    id: 'bear_tamer',
    name: 'Người Thuần Gấu',
    englishName: 'Bear Tamer',
    title: 'Tiếng Gầm Cảnh Báo',
    faction: 'Dân Làng',
    difficulty: 'Trung Bình',
    turnOrder: 'BÌNH MINH',
    lifecycle: 'EVERY_DAY_START',
    actionCode: 'beartamer.growl_alert',
    imageKey: 'hunter',
    dayAbility: 'Nếu có ít nhất 1 con Sói ngồi cạnh (bên trái hoặc bên phải), con Gấu sẽ gầm lên vào đầu ngày.',
    nightAbility: 'Không cần thức giấc. Quản trò thông báo tiếng gầm vào đầu phiên thảo luận.',
    winCondition: 'Loại bỏ toàn bộ Ma Sói.',
    synergy: 'Manh mối thu hẹp phạm vi Ma Sói quanh 2 người ngồi kế bên.',
    lore: 'Con gấu tuyết khổng lồ ngửi thấy mùi hôi thối của Ma Sói ngay khi gã ngồi sát bên chủ nhân.',
  },
  {
    id: 'arsonist',
    name: 'Kẻ Phóng Hỏa',
    englishName: 'Arsonist',
    title: 'Hỏa Thần Cuồng Nộ',
    faction: 'Phe Thứ Ba',
    difficulty: 'Khó',
    turnOrder: '#140',
    lifecycle: 'EVERY_NIGHT',
    actionCode: 'arsonist.douse_or_ignite',
    imageKey: 'werewolf',
    dayAbility: 'Bỏ phiếu bình thường như Dân Làng.',
    nightAbility: 'Mỗi đêm chọn tưới dầu vào 2 nhà, hoặc chọn Châm Lửa thiêu rụi toàn bộ các nhà đã tưới dầu từ trước.',
    winCondition: 'Thiêu rụi toàn bộ người chơi khác và trở thành kẻ duy nhất còn sống.',
    synergy: 'Tích lũy dầu qua nhiều đêm trước khi kích hoạt châm lửa hàng loạt.',
    lore: 'Cầm ngọn đuốc rực lửa trong đêm, Kẻ Phóng Hỏa biến cả làng Hắc Tùng thành biển lửa thiêng.',
  },
  {
    id: 'stuttering_judge',
    name: 'Thẩm Phán Lắp Bắp',
    englishName: 'Stuttering Judge',
    title: 'Bản Án Kép',
    faction: 'Dân Làng',
    difficulty: 'Trung Bình',
    turnOrder: 'BAN NGÀY',
    lifecycle: 'ONCE_PER_GAME',
    actionCode: 'judge.second_execution',
    imageKey: 'seer',
    dayAbility: 'Có quyền đưa ra ký hiệu bí mật cho Quản trò để tổ chức phiên bỏ phiếu treo cổ THỨ HAI ngay trong cùng 1 ngày.',
    nightAbility: 'Đêm 1 thức giấc xác nhận ký hiệu với Quản trò.',
    winCondition: 'Loại bỏ toàn bộ Ma Sói.',
    synergy: 'Kích hoạt phiên treo cổ thứ 2 ngay khi bắt được dấu vết Sói.',
    lore: 'Gã thẩm phán già với chứng nói lắp, nhưng bản án gõ búa thứ hai của ông ta không bao giờ nhân nhượng.',
  },
  {
    id: 'father_of_werewolves',
    name: 'Người Cha Của Sói',
    englishName: 'Father of Werewolves',
    title: 'Chúa Sói Truyền Bệnh',
    faction: 'Ma Sói',
    difficulty: 'Khó',
    turnOrder: '#101',
    lifecycle: 'ONCE_PER_GAME',
    actionCode: 'fatherwolf.infect_victim',
    imageKey: 'werewolf',
    dayAbility: 'Dẫn dắt bầy Sói tranh luận ban ngày.',
    nightAbility: 'Thức cùng bầy Sói. 1 lần duy nhất trong cả trận, sau khi cắn nạn nhân, có thể chọn Biến nạn nhân thành Ma Sói thay vì giết.',
    winCondition: 'Số lượng Ma Sói bằng hoặc đông hơn Dân Làng.',
    synergy: 'Biến Tiên Tri hoặc Bảo Vệ thành Ma Sói để xoay chuyển cục diện trận đấu.',
    lore: 'Chúa Sói mang dòng máu thuần chủng có khả năng ban lời nguyền hóa Sói cho nạn nhân tội nghiệp.',
  },
];

export default function RoleDetailScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedRole, setSelectedRole] = useState<RoleSpec>(ROLES_SPEC[0]);
  const [showEngineModal, setShowEngineModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('RoleCatalog')}>
          <Text style={styles.backBtnText}>‹ Bách Khoa Vai Trò</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🃏 CHI TIẾT VAI TRÒ TAROT</Text>
        <TouchableOpacity onPress={() => setShowEngineModal(true)}>
          <Text style={styles.engineBtnIcon}>⚙️ Engine</Text>
        </TouchableOpacity>
      </View>

      {/* Role Selection Tabs */}
      <View style={styles.roleTabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {ROLES_SPEC.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.tabChip, selectedRole.id === r.id && styles.tabChipActive]}
              onPress={() => setSelectedRole(r)}
            >
              <Text style={[styles.tabChipText, selectedRole.id === r.id && styles.tabChipTextActive]}>
                {r.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tarot Card Hero Art - Full Uncropped View */}
        <View style={styles.cardHeroBox}>
          <Image
            source={{ uri: ROLE_CARD_IMAGES[selectedRole.imageKey as keyof typeof ROLE_CARD_IMAGES] || ROLE_CARD_IMAGES.seer }}
            style={styles.cardHeroImg}
            resizeMode="contain"
          />
        </View>

        {/* Role Header Details */}
        <View style={styles.cardTitleBox}>
          <View style={styles.badgeRow}>
            <View style={[
              styles.factionBadge,
              selectedRole.faction === 'Ma Sói' && styles.factionBadgeWolf,
              selectedRole.faction === 'Phe Thứ Ba' && styles.factionBadgeNeutral,
            ]}>
              <Text style={styles.factionBadgeText}>{selectedRole.faction}</Text>
            </View>

            <View style={styles.turnOrderChip}>
              <Text style={styles.turnOrderChipText}>{selectedRole.turnOrder}</Text>
            </View>
          </View>

          <Text style={styles.cardTitleName}>{selectedRole.name}</Text>
          <Text style={styles.cardSubTitle}>{selectedRole.title}</Text>
        </View>

        {/* Story Lore */}
        <View style={styles.loreBox}>
          <Text style={styles.loreText}>"{selectedRole.lore}"</Text>
        </View>

        {/* Ability Detail Sections */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.infoCardHeader}>☀️ KỸ NĂNG BAN NGÀY</Text>
            <Text style={styles.diffTag}>Độ khó: {selectedRole.difficulty}</Text>
          </View>
          <Text style={styles.infoCardText}>{selectedRole.dayAbility}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.infoCardHeaderCyan}>🌙 QUYỀN NĂNG BAN ĐÊM</Text>
            <Text style={styles.codeTag}>{selectedRole.actionCode}</Text>
          </View>
          <Text style={styles.infoCardText}>{selectedRole.nightAbility}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardHeaderGold}>🏆 ĐIỀU KIỆN THẮNG</Text>
          <Text style={styles.infoCardText}>{selectedRole.winCondition}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardHeader}>⚔️ CHIẾN THUẬT & PHỐI HỢP</Text>
          <Text style={styles.infoCardText}>{selectedRole.synergy}</Text>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.catBtn} onPress={() => setShowEngineModal(true)}>
          <Text style={styles.catBtnText}>⚡ Trạng Thái Engine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playNowBtn} onPress={() => onNavigate && onNavigate('Lobby')}>
          <Text style={styles.playNowBtnText}>⚔️ Tạo Phòng Với {selectedRole.name}</Text>
        </TouchableOpacity>
      </View>

      {/* ACTION ENGINE MACHINE STATE MODAL */}
      <Modal visible={showEngineModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚡ ACTION ENGINE - {selectedRole.name}</Text>
              <TouchableOpacity onPress={() => setShowEngineModal(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.engineRow}>
                <Text style={styles.engineLabel}>MÃ KÍCH HOẠT:</Text>
                <Text style={styles.engineValCode}>{selectedRole.actionCode}</Text>
              </View>

              <View style={styles.engineRow}>
                <Text style={styles.engineLabel}>VÒNG ĐỜI (LIFECYCLE):</Text>
                <Text style={styles.engineVal}>{selectedRole.lifecycle}</Text>
              </View>

              <View style={styles.engineRow}>
                <Text style={styles.engineLabel}>THỨ TỰ ĐÊM (TURN):</Text>
                <Text style={styles.engineValGold}>{selectedRole.turnOrder}</Text>
              </View>

              <View style={styles.engineRow}>
                <Text style={styles.engineLabel}>PHE BẢN THỂ:</Text>
                <Text style={styles.engineVal}>{selectedRole.faction}</Text>
              </View>

              <View style={styles.engineRuleBox}>
                <Text style={styles.engineRuleTitle}>💡 BẢO MẬT & QUY TẮC MÁY TRẠNG THÁI</Text>
                <Text style={styles.engineRuleText}>
                  Trạng thái hành động được đồng bộ qua kênh WebSocket bảo mật end-to-end. Kết quả soi hoặc tác động ban đêm không lưu log lộ thông tin cho người chết.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.modalConfirmBtn} onPress={() => setShowEngineModal(false)}>
              <Text style={styles.modalConfirmText}>ĐÓNG MÁY TRẠNG THÁI</Text>
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
    height: 50, paddingHorizontal: Spacing.marginMobile,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainer}E6`, borderBottomWidth: 1, borderBottomColor: `${Colors.outline}33`,
  },
  backBtn: {},
  backBtnText: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  headerTitle: { color: Colors.tertiary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  engineBtnIcon: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },

  roleTabsRow: { backgroundColor: Colors.surfaceContainerLow, paddingVertical: 8 },
  tabsContent: { paddingHorizontal: Spacing.marginMobile, gap: 8 },
  tabChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  tabChipActive: { backgroundColor: Colors.tertiaryContainer },
  tabChipText: { color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '600' },
  tabChipTextActive: { color: Colors.tertiary, fontWeight: '700' },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 12 },

  cardHeroBox: {
    height: 220, borderRadius: 16, overflow: 'hidden', position: 'relative',
    borderWidth: 2, borderColor: Colors.tertiary,
    backgroundColor: '#0c0e11', alignItems: 'center', justifyContent: 'center',
    padding: 4,
  },
  cardHeroImg: { width: '100%', height: '100%' },
  cardTitleBox: {
    backgroundColor: Colors.surfaceContainerLow, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: `${Colors.outline}26`, gap: 4,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  factionBadge: {
    backgroundColor: Colors.tertiaryContainer, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  factionBadgeWolf: { backgroundColor: Colors.primaryContainer },
  factionBadgeNeutral: { backgroundColor: Colors.secondaryContainer },
  factionBadgeText: { color: Colors.onSurface, fontSize: 10, fontWeight: '700' },

  turnOrderChip: { backgroundColor: '#0c0e11', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  turnOrderChipText: { color: Colors.tertiary, fontSize: 10, fontWeight: '800' },

  cardTitleName: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', letterSpacing: 1 },
  cardSubTitle: { color: Colors.secondary, fontSize: 12, fontWeight: '600', marginTop: 2 },

  loreBox: {
    backgroundColor: '#1a1c1f', padding: 12, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: Colors.tertiary,
  },
  loreText: { color: Colors.onSurfaceVariant, fontSize: 11, fontStyle: 'italic', lineHeight: 16 },

  infoCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, gap: 6,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoCardHeader: { color: Colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  infoCardHeaderCyan: { color: Colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  infoCardHeaderGold: { color: Colors.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  diffTag: { color: Colors.onSurfaceVariant, fontSize: 10 },
  codeTag: { color: Colors.secondary, fontSize: 10, fontWeight: '700' },
  infoCardText: { color: Colors.onSurface, fontSize: 12, lineHeight: 18 },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  catBtn: {
    paddingHorizontal: 12, height: 44, borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center',
  },
  catBtnText: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },
  playNowBtn: {
    flex: 1, height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  playNowBtnText: { color: Colors.onPrimaryContainer, fontSize: 12, fontWeight: '700' },

  // MODAL STYLING
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  modalCard: {
    width: '100%', maxWidth: 320, backgroundColor: '#1a1c1f', borderRadius: 16,
    padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.secondaryContainer,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: Colors.secondary, fontSize: 13, fontWeight: '700' },
  closeModalText: { color: Colors.onSurfaceVariant, fontSize: 16 },

  modalBody: { gap: 8 },
  engineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  engineLabel: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '600' },
  engineVal: { color: Colors.onSurface, fontSize: 11, fontWeight: '700' },
  engineValCode: { color: Colors.secondary, fontSize: 11, fontWeight: '700' },
  engineValGold: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },

  engineRuleBox: { backgroundColor: '#111317', padding: 10, borderRadius: 8, marginTop: 4, gap: 4 },
  engineRuleTitle: { color: Colors.tertiary, fontSize: 10, fontWeight: '700' },
  engineRuleText: { color: Colors.onSurfaceVariant, fontSize: 10, lineHeight: 14 },

  modalConfirmBtn: {
    height: 40, borderRadius: 8, backgroundColor: Colors.secondaryContainer,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  modalConfirmText: { color: Colors.onSecondaryContainer, fontSize: 12, fontWeight: '700' },
});
