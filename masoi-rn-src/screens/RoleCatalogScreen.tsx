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
  Modal,
} from 'react-native';

interface RoleItem {
  id: string;
  name: string;
  englishName: string;
  faction: 'VILLAGE' | 'WOLF' | 'NEUTRAL';
  factionLabel: string;
  pack: 'BASIC' | 'CHARACTER' | 'CHARACTER_PLUS';
  turnOrder: string;
  lifecycle: string;
  icon: string;
  summary: string;
  actionCode: string;
  details: string;
}

const ROLES_LIST: RoleItem[] = [
  {
    id: 'seer',
    name: 'Tiên Tri',
    englishName: 'Seer',
    faction: 'VILLAGE',
    factionLabel: 'Dân Làng',
    pack: 'BASIC',
    turnOrder: '#110',
    lifecycle: 'EVERY_NIGHT',
    icon: '🔮',
    summary: 'Thức dậy mỗi đêm để soi danh tính 1 người chơi. Phán quyết trả về phe Sói hoặc Dân Làng bí mật tuyệt đối.',
    actionCode: 'seer.inspect',
    details: 'Mỗi đêm Quản trò gọi Tiên Tri thức giấc. Tiên Tri chọn 1 mục tiêu. Hệ thống hiển thị biểu tượng Sói (Ác) hoặc Khiên (Thiện).',
  },
  {
    id: 'witch',
    name: 'Phù Thủy',
    englishName: 'Witch',
    faction: 'VILLAGE',
    factionLabel: 'Dân Làng',
    pack: 'BASIC',
    turnOrder: '#120',
    lifecycle: 'CONDITIONAL (còn bình)',
    icon: '🧪',
    summary: 'Sở hữu 1 bình Cứu và 1 bình Độc duy nhất cả trận. Được xem ai bị Sói cắn trước khi quyết định.',
    actionCode: 'witch.use_heal / use_poison',
    details: 'Quản trò thông báo nạn nhân bị Sói cắn. Phù Thủy chọn dùng bình Cứu để cứu sống, hoặc dùng bình Độc để hạ sát 1 mục tiêu khác.',
  },
  {
    id: 'hunter',
    name: 'Thợ Săn',
    englishName: 'Hunter',
    faction: 'VILLAGE',
    factionLabel: 'Dân Làng',
    pack: 'BASIC',
    turnOrder: 'KHI CHẾT',
    lifecycle: 'DEATH_EVENT',
    icon: '🏹',
    summary: 'Khi Thợ Săn tử nạn (bị Sói cắn hoặc treo cổ), ngay lập tức kích hoạt phát đạn định mệnh hạ gục 1 người chơi khác.',
    actionCode: 'hunter.shoot',
    details: 'Khi trạng thái tử nạn được ghi nhận, Thợ Săn có 10 giây để chọn 1 nạn nhân cùng chết.',
  },
  {
    id: 'werewolf',
    name: 'Ma Sói',
    englishName: 'Werewolf',
    faction: 'WOLF',
    factionLabel: 'Phe Sói',
    pack: 'BASIC',
    turnOrder: '#100',
    lifecycle: 'EVERY_NIGHT',
    icon: '🐺',
    summary: 'Toàn bộ phe Sói thức giấc, đồng thuận bỏ phiếu cắn 1 người chơi trong làng mỗi đêm. Đòi hỏi quá bán.',
    actionCode: 'wolves.choose_target',
    details: 'Đêm đến, các thành viên Sói vào kênh chat giọng nói riêng. Mục tiêu có số vote cao nhất sẽ bị cắn.',
  },
  {
    id: 'villager',
    name: 'Dân Làng',
    englishName: 'Simple Villager',
    faction: 'VILLAGE',
    factionLabel: 'Dân Làng',
    pack: 'BASIC',
    turnOrder: 'PASSIVE',
    lifecycle: 'PASSIVE',
    icon: '👨‍🌾',
    summary: 'Không có năng lực ban đêm. Sức mạnh nằm ở khả năng suy luận, hùng biện và lá phiếu phán quyết vào ban ngày.',
    actionCode: 'vote.day_execution',
    details: 'Dân làng chỉ hoạt động vào ban ngày để trao đổi thông tin và tìm ra Ma Sói.',
  },
  {
    id: 'cupid',
    name: 'Thần Tình Yêu',
    englishName: 'Cupid',
    faction: 'NEUTRAL',
    factionLabel: 'Độc Lập',
    pack: 'CHARACTER',
    turnOrder: '#20',
    lifecycle: 'FIRST_NIGHT_ONLY',
    icon: '💘',
    summary: 'Thức dậy đầu tiên trong Đêm 1 để se duyên cho 2 người bất kỳ. Cặp đôi sẽ cùng sống cùng chết.',
    actionCode: 'cupid.bind_lovers',
    details: 'Chỉ gọi trong Đêm 1. Chọn 2 người bất kỳ làm tình nhân. Nếu 1 trong 2 chết, người còn lại tự sát theo.',
  },
  {
    id: 'defender',
    name: 'Bảo Vệ',
    englishName: 'Defender',
    faction: 'VILLAGE',
    factionLabel: 'Dân Làng',
    pack: 'CHARACTER',
    turnOrder: '#70',
    lifecycle: 'EVERY_NIGHT',
    icon: '🛡️',
    summary: 'Thức dậy mỗi đêm dựng khiên bảo vệ 1 người không bị Sói cắn. Không được bảo vệ 1 người 2 đêm liên tiếp.',
    actionCode: 'defender.protect',
    details: 'Nếu Sói cắn trúng người được Bảo Vệ khiên, đêm đó làng không có ai chết.',
  },
  {
    id: 'white_werewolf',
    name: 'Sói Trắng',
    englishName: 'White Werewolf',
    faction: 'NEUTRAL',
    factionLabel: 'Phe Thứ 3',
    pack: 'CHARACTER',
    turnOrder: '#105',
    lifecycle: 'ALTERNATING_NIGHT',
    icon: '❄️',
    summary: 'Thức cùng bầy Sói hàng đêm, nhưng vào các đêm chẵn (Đêm 2, 4, 6), Sói Trắng thức riêng để cắn 1 con Sói khác!',
    actionCode: 'whitewolf.kill_wolf',
    details: 'Mục tiêu duy nhất của Sói Trắng là trở thành kẻ sống sót cuối cùng trên bàn cờ.',
  },
];

export const RoleCatalogScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaction, setSelectedFaction] = useState<string>('ALL');
  const [selectedPack, setSelectedPack] = useState<string>('ALL');
  const [activeModalRole, setActiveModalRole] = useState<RoleItem | null>(null);

  const filteredRoles = ROLES_LIST.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFaction = selectedFaction === 'ALL' || role.faction === selectedFaction;
    const matchesPack = selectedPack === 'ALL' || role.pack === selectedPack;

    return matchesSearch && matchesFaction && matchesPack;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111317" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => onNavigate && onNavigate('Home')}
        >
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>BÁCH KHOA VAI TRÒ</Text>

        <View style={styles.headerRightBadge}>
          <Text style={styles.headerRightBadgeText}>v2.4 Engine</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm vai trò, hành động, kỹ năng..."
            placeholderTextColor="#a78a87"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PACK TABS */}
        <View style={styles.tabsRow}>
          {['ALL', 'BASIC', 'CHARACTER'].map((pack) => (
            <TouchableOpacity
              key={pack}
              style={[styles.tabBtn, selectedPack === pack && styles.tabBtnActive]}
              onPress={() => setSelectedPack(pack)}
            >
              <Text style={[styles.tabText, selectedPack === pack && styles.tabTextActive]}>
                {pack === 'ALL' ? 'TẤT CẢ (32)' : pack}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FACTION CHIPS */}
        <View style={styles.chipsRow}>
          {[
            { id: 'ALL', label: '🌐 All Factions' },
            { id: 'VILLAGE', label: '🛡️ Dân Làng' },
            { id: 'WOLF', label: '🐺 Phe Sói' },
            { id: 'NEUTRAL', label: '🎯 Thứ 3' },
          ].map((chip) => (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chipItem, selectedFaction === chip.id && styles.chipItemActive]}
              onPress={() => setSelectedFaction(chip.id)}
            >
              <Text style={[styles.chipText, selectedFaction === chip.id && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CORE AXIOM BANNER */}
        <View style={styles.axiomBanner}>
          <Text style={styles.axiomBookIcon}>📖</Text>
          <View style={styles.axiomTextGroup}>
            <Text style={styles.axiomTitle}>NGUYÊN TẮC VÀNG ENGINE</Text>
            <Text style={styles.axiomDesc}>
              Mọi hành động đều phụ thuộc tuyệt đối vào <Text style={styles.highlightGold}>Điều kiện kích hoạt (Activation)</Text> và <Text style={styles.highlightCyan}>Vòng đời vai trò (Lifecycle)</Text>.
            </Text>
          </View>
        </View>

        {/* ROLES LIST */}
        <View style={styles.rolesList}>
          {filteredRoles.map((role) => (
            <View key={role.id} style={styles.roleCard}>
              <View style={styles.roleCardHeader}>
                <View style={styles.roleTitleLeft}>
                  <View style={styles.roleAvatar}>
                    <Text style={styles.roleAvatarEmoji}>{role.icon}</Text>
                  </View>

                  <View>
                    <View style={styles.roleNameRow}>
                      <Text style={styles.roleName}>{role.name}</Text>
                      <View
                        style={[
                          styles.factionBadge,
                          role.faction === 'WOLF' && styles.factionWolf,
                          role.faction === 'NEUTRAL' && styles.factionNeutral,
                        ]}
                      >
                        <Text style={styles.factionBadgeText}>{role.factionLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.roleEnglishName}>{role.englishName}</Text>
                  </View>
                </View>

                <View style={styles.turnOrderBadge}>
                  <Text style={styles.turnOrderText}>{role.turnOrder}</Text>
                  <Text style={styles.turnOrderSub}>Thứ Tự Đêm</Text>
                </View>
              </View>

              {/* TAGS */}
              <View style={styles.roleTagsRow}>
                <View style={styles.tagItem}>
                  <Text style={styles.tagText}>🌀 {role.lifecycle}</Text>
                </View>
                <View style={styles.tagItemCode}>
                  <Text style={styles.tagCodeText}>⚙️ {role.actionCode}</Text>
                </View>
              </View>

              <Text style={styles.roleSummaryDesc}>{role.summary}</Text>

              <TouchableOpacity
                style={styles.openDetailBtn}
                onPress={() => setActiveModalRole(role)}
              >
                <Text style={styles.openDetailBtnText}>CHI TIẾT MÁY TRẠNG THÁI (ACTION ENGINE)</Text>
                <Text style={styles.openDetailChevron}>›</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ROLE DETAIL MODAL */}
      <Modal visible={!!activeModalRole} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          {activeModalRole && (
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalIcon}>{activeModalRole.icon}</Text>
                  <Text style={styles.modalTitle}>{activeModalRole.name}</Text>
                  <Text style={styles.modalEnglish}>({activeModalRole.englishName})</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveModalRole(null)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>📌 VÀO ĐÊM:</Text>
                  <Text style={styles.modalSectionVal}>Thứ tự gọi: {activeModalRole.turnOrder}</Text>
                  <Text style={styles.modalSectionVal}>Vòng đời: {activeModalRole.lifecycle}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>⚙️ MÔ TẢ LUỒNG XỬ LÝ (SPEC):</Text>
                  <Text style={styles.modalBodyText}>{activeModalRole.details}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>💡 MẸO CHƠI ĐỀ XUẤT:</Text>
                  <Text style={styles.modalBodyText}>
                    Hãy cân nhắc kỹ thời điểm sử dụng kỹ năng. Giữ kín danh tính của bạn để tránh bị bầy Sói nhắm tới sớm!
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setActiveModalRole(null)}
              >
                <Text style={styles.modalDoneBtnText}>ĐÓNG CỬA SỔ</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: 'rgba(30, 32, 35, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 138, 137, 0.15)',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 24,
    color: '#ffb3ae',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffb3ae',
    letterSpacing: 1.5,
  },
  headerRightBadge: {
    backgroundColor: '#8a121a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  headerRightBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffb3ae',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  searchBox: {
    backgroundColor: '#0c0e11',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 138, 137, 0.2)',
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#a78a87',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0c0e11',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#8a121a',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a78a87',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#1e2023',
  },
  chipItemActive: {
    backgroundColor: '#282a2d',
    borderWidth: 1,
    borderColor: '#72d4ee',
  },
  chipText: {
    fontSize: 10,
    color: '#a78a87',
  },
  chipTextActive: {
    color: '#72d4ee',
    fontWeight: '700',
  },
  axiomBanner: {
    backgroundColor: '#1e2023',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(241, 190, 102, 0.2)',
  },
  axiomBookIcon: {
    fontSize: 18,
  },
  axiomTextGroup: {
    flex: 1,
  },
  axiomTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f1be66',
    letterSpacing: 1,
  },
  axiomDesc: {
    fontSize: 11,
    color: '#e0bfbc',
    marginTop: 2,
    lineHeight: 15,
  },
  highlightGold: {
    color: '#f1be66',
    fontWeight: '700',
  },
  highlightCyan: {
    color: '#72d4ee',
    fontWeight: '700',
  },
  rolesList: {
    gap: 10,
  },
  roleCard: {
    backgroundColor: '#1e2023',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleAvatar: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#333538',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleAvatarEmoji: {
    fontSize: 20,
  },
  roleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  factionBadge: {
    backgroundColor: 'rgba(50, 157, 182, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  factionWolf: {
    backgroundColor: '#8a121a',
  },
  factionNeutral: {
    backgroundColor: '#5c3f00',
  },
  factionBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
  },
  roleEnglishName: {
    fontSize: 10,
    color: '#a78a87',
  },
  turnOrderBadge: {
    alignItems: 'flex-end',
  },
  turnOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1be66',
  },
  turnOrderSub: {
    fontSize: 8,
    color: '#a78a87',
  },
  roleTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagItem: {
    backgroundColor: '#0c0e11',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    color: '#72d4ee',
    fontWeight: '600',
  },
  tagItemCode: {
    backgroundColor: '#0c0e11',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagCodeText: {
    fontSize: 9,
    color: '#e0bfbc',
  },
  roleSummaryDesc: {
    fontSize: 11,
    color: '#e2e2e6',
    lineHeight: 16,
  },
  openDetailBtn: {
    backgroundColor: '#282a2d',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  openDetailBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#e0bfbc',
    letterSpacing: 0.5,
  },
  openDetailChevron: {
    fontSize: 14,
    color: '#ffb3ae',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e2023',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167, 138, 137, 0.2)',
    paddingBottom: 10,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalIcon: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalEnglish: {
    fontSize: 11,
    color: '#a78a87',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#ffffff',
  },
  modalBody: {
    gap: 12,
  },
  modalSection: {
    backgroundColor: '#111317',
    padding: 10,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
  },
  modalSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f1be66',
  },
  modalSectionVal: {
    fontSize: 11,
    color: '#72d4ee',
  },
  modalBodyText: {
    fontSize: 11,
    color: '#e2e2e6',
    lineHeight: 16,
  },
  modalDoneBtn: {
    height: 44,
    backgroundColor: '#8a121a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDoneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
});

export default RoleCatalogScreen;
