import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';

interface BloodMoonOption {
  id: string;
  code: string;
  tag: string;
  timing: string;
  title: string;
  desc: string;
  badges: string[];
  checked: boolean;
  tagColor: string;
}

const INITIAL_OPTIONS: BloodMoonOption[] = [
  {
    id: 'optA',
    code: 'OPTION A',
    tag: 'PHE SÓI',
    timing: '⚡ Đêm Tới',
    title: 'TRĂNG MÁU CƯỜNG NỘ (Bloodthirst Moon)',
    desc: 'Bầy Ma Sói thức tỉnh khát máu cực độ: Phe Sói được trao thêm +1 mạng dự phòng hoặc được quyền chọn lượt cắn thứ 2 nếu cắn trúng Dân thường.',
    badges: ['⚔️ +1 Lượt Cắn Sói', '🛡️ Thêm 1 Mạng'],
    checked: true,
    tagColor: Colors.primary,
  },
  {
    id: 'optB',
    code: 'OPTION B',
    tag: 'KHÓA KỸ NĂNG',
    timing: '🌙 Tất Cả Đêm',
    title: 'TRĂNG MÁU CÂM LẶNG (Eclipse Moon)',
    desc: 'Trăng thực cẩm nín bao trùm: Vô hiệu hóa toàn bộ kỹ năng bảo vệ và cứu chữa của Thần Dân ban đêm (Bảo Vệ, Phù Thủy, Hiệp Sĩ v.v... không thể che chở mục tiêu).',
    badges: ['🛡️ Tắt Khiên Bảo Vệ', '🧪 Khóa Bình Cứu'],
    checked: true,
    tagColor: Colors.secondary,
  },
  {
    id: 'optC',
    code: 'OPTION C',
    tag: 'BIẾN THỂ NGÀY',
    timing: '☀️ Giờ Treo Cổ',
    title: 'TRĂNG MÁU TUYÊN ÁN (Gallows Moon)',
    desc: 'Huyết nguyện bỏ phiếu phán quyết: Toàn bộ số phiếu vote ban ngày của Dân Làng được nhân đôi sức nặng và mọi người chơi bắt buộc vote công khai không được bỏ phiếu trắng.',
    badges: ['⚖️ Phiếu x2', '👁️ Lộ Diện Danh Tính'],
    checked: true,
    tagColor: Colors.tertiary,
  },
  {
    id: 'optD',
    code: 'OPTION D',
    tag: 'ĐỒNG HÓA',
    timing: '🔀 Chuyển Phe',
    title: 'TRĂNG MÁU HÓA DẠI (Lycanthropic Frenzy)',
    desc: 'Mầm bệnh ma sói bộc phát: Nạn nhân bị cắn chết đêm nay không tử nạn lập tức mà bị lây nhiễm, biến thành Ma Sói Con gia nhập bầy sói từ rạng sáng sau.',
    badges: ['☣️ Hóa Sói Thay Vì Chết'],
    checked: false,
    tagColor: Colors.outlineVariant,
  },
  {
    id: 'optE',
    code: 'OPTION E',
    tag: 'CÕI ÂM',
    timing: '🗣️ Đối Thoại',
    title: 'TRĂNG MÁU TÂM LINH (Spectral Eclipse)',
    desc: 'Giao cảm âm dương hỗn loạn: Vong linh người vừa chết đêm qua được quyền để lại 1 lời nhắn / phát biểu 1 câu duy nhất cho toàn làng trước khi giờ bỏ phiếu bắt đầu.',
    badges: ['👻 1 Câu Nói Từ Cõi Chết'],
    checked: false,
    tagColor: Colors.outlineVariant,
  },
];

export default function BloodMoonModifiersScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [bloodMoonEnabled, setBloodMoonEnabled] = useState(true);
  const [options, setOptions] = useState<BloodMoonOption[]>(INITIAL_OPTIONS);

  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, checked: !o.checked } : o))
    );
  };

  const handleReset = () => {
    setOptions(INITIAL_OPTIONS);
    setBloodMoonEnabled(true);
  };

  const handleRandomize = () => {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, checked: Math.random() > 0.4 }))
    );
  };

  const activeCount = options.filter((o) => o.checked).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0c10" />

      {/* TOP SYSTEM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Lobby')}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>TRĂNG MÁU</Text>
          <View style={styles.headerPinkDot} />
        </View>

        <View style={styles.headerBadgesRow}>
          <View style={styles.dayPill}>
            <Text style={styles.dayPillText}>🌅 RẠNG SÁNG NGÀY 1</Text>
          </View>
          <View style={styles.hostPill}>
            <Text style={styles.hostPillText}>👑 QUẢN TRÒ HOST</Text>
          </View>
        </View>

        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 13 }}>📜</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 13 }}>🔊</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* MAIN BLOOD MOON ACTIVATION CARD (Red Container) */}
        <View style={styles.mainToggleCard}>
          <View style={styles.mainCardHeaderRow}>
            <View style={styles.gearIconBox}>
              <Text style={styles.gearIcon}>⚙️</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.omenRow}>
                <Text style={styles.omenTag}>DIỂM BÁO QUẢN TRÒ</Text>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerText}>00:45s</Text>
                </View>
              </View>
              <Text style={styles.mainCardTitle}>KHAI MỞ TRĂNG MÁU NGÀY 1?</Text>
            </View>

            <Switch
              value={bloodMoonEnabled}
              onValueChange={setBloodMoonEnabled}
              trackColor={{ false: '#3a2024', true: '#e63946' }}
              thumbColor={bloodMoonEnabled ? '#ffffff' : '#888888'}
            />
          </View>

          <Text style={styles.mainCardDesc}>
            Bình minh Ngày 1 bắt đầu rực sắc đỏ u linh. Quản trò có toàn quyền chọn và phối hợp nhiều hiệu ứng Modifier Trăng Máu để áp đặt lên toàn bộ diễn biến Ngày & Đêm tiếp theo.
          </Text>

          <View style={styles.alarmNoticeRow}>
            <Text style={styles.alarmIcon}>🔔</Text>
            <Text style={styles.alarmText}>Phát tín hiệu chuông rùng rợn đến máy người chơi</Text>
            <View style={styles.autoWakeBadge}>
              <Text style={styles.autoWakeText}>TỰ ĐỘNG BÁO THỨC</Text>
            </View>
          </View>
        </View>

        {/* MODIFIERS COLLECTION HEADER */}
        <View style={styles.catalogHeaderRow}>
          <View style={styles.catalogTitleRow}>
            <Text style={styles.catalogIcon}>📂</Text>
            <Text style={styles.catalogTitle}>BỘ SƯU TẬP BIẾN THỂ</Text>
          </View>

          <View style={styles.activeCountChip}>
            <Text style={styles.activeCountText}>{activeCount} / 5 Đang Bật</Text>
          </View>

          <Text style={styles.multiSelectHint}>Có thể chọn nhiều option</Text>
        </View>

        {/* 5 DETAILED OPTION CARDS */}
        <View style={styles.optionsList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.optionCard, opt.checked && styles.optionCardChecked]}
              onPress={() => toggleOption(opt.id)}
              activeOpacity={0.9}
            >
              <View style={styles.optionHeaderRow}>
                <View style={styles.checkboxTitleRow}>
                  <View style={[styles.checkboxBox, opt.checked && styles.checkboxBoxChecked]}>
                    <Text style={styles.checkboxCheckMark}>{opt.checked ? '✓' : ''}</Text>
                  </View>

                  <Text style={styles.optionCode}>{opt.code}</Text>

                  <View style={[styles.tagBadge, { backgroundColor: opt.tagColor + '33' }]}>
                    <Text style={[styles.tagBadgeText, { color: opt.tagColor }]}>{opt.tag}</Text>
                  </View>
                </View>

                <Text style={styles.timingText}>{opt.timing}</Text>
              </View>

              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>

              <View style={styles.badgesRow}>
                {opt.badges.map((b, idx) => (
                  <View key={idx} style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{b}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* QUEUE PREVIEW SECTION */}
        <View style={styles.queuePreviewCard}>
          <View style={styles.queueHeaderRow}>
            <View style={styles.queueTitleRow}>
              <Text style={styles.queueIcon}>⚡</Text>
              <Text style={styles.queueTitle}>TÁC ĐỘNG LÊN THỨ TỰ HÀNG ĐỢI (QUEUE PREVIEW)</Text>
            </View>
            <Text style={styles.queueContribCount}>{activeCount} HIỆU ỨNG GÓP</Text>
          </View>

          <View style={styles.queueRowsList}>
            <View style={styles.queueRow}>
              <Text style={styles.queueStepName}>● Đêm 1: Bầy Sói thức giấc</Text>
              <Text style={styles.queueEffectPlus}>+1 Quyền cắn bổ sung</Text>
            </View>
            <View style={styles.queueRow}>
              <Text style={styles.queueStepName}>● Đêm 1: Bảo Vệ & Phù Thủy</Text>
              <Text style={styles.queueEffectLock}>Bị khóa năng lực</Text>
            </View>
            <View style={styles.queueRow}>
              <Text style={styles.queueStepName}>● Ngày 1: Luận tội & Treo cổ</Text>
              <Text style={styles.queueEffectVote}>Phiếu vote x2 & Bắt buộc</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION BUTTONS */}
      <View style={styles.footerDock}>
        <TouchableOpacity
          style={styles.confirmCtaBtn}
          onPress={() => onNavigate && onNavigate('Lobby')}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmCtaIcon}>🪄</Text>
          <Text style={styles.confirmCtaText}>
            XÁC NHẬN KÍCH HOẠT TRĂNG MÁU ({activeCount} TÙY CHỌN)
          </Text>
        </TouchableOpacity>

        <View style={styles.subActionButtonsRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnIcon}>🔄</Text>
            <Text style={styles.resetBtnText}>ĐẶT LẠI MẶC ĐỊNH</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.randomBtn} onPress={handleRandomize}>
            <Text style={styles.randomBtnIcon}>🎲</Text>
            <Text style={styles.randomBtnText}>NGẪU NHIÊN BIẾN THỂ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f0c10' },

  // HEADER
  header: {
    height: 52, paddingHorizontal: 12, backgroundColor: '#141017E6',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#281c26',
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: Colors.onSurfaceVariant, fontSize: 24 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerTitle: { color: Colors.onSurface, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  headerPinkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e63946' },

  headerBadgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dayPill: { backgroundColor: '#381619', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  dayPillText: { color: Colors.primary, fontSize: 9, fontWeight: '800' },
  hostPill: { backgroundColor: '#28202b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  hostPillText: { color: Colors.tertiary, fontSize: 9, fontWeight: '800' },

  headerRightIcons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: {
    width: 28, height: 28, borderRadius: 6, backgroundColor: '#201824',
    alignItems: 'center', justifyContent: 'center',
  },

  mainScroll: { flex: 1 },
  scrollContent: { padding: 12, gap: 12, paddingBottom: 110 },

  // MAIN TOGGLE CARD
  mainToggleCard: {
    backgroundColor: '#2b1014', borderRadius: 14, padding: 14, gap: 10,
    borderWidth: 1, borderColor: '#5e1b23',
  },
  mainCardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gearIconBox: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#5c171e',
    alignItems: 'center', justifyContent: 'center',
  },
  gearIcon: { fontSize: 20 },
  omenRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  omenTag: { color: '#e63946', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  timerBadge: { backgroundColor: '#5c171e', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  timerText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  mainCardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 },

  mainCardDesc: { color: '#d1b8bc', fontSize: 11, lineHeight: 16 },
  alarmNoticeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1d0a0d', padding: 8, borderRadius: 8, marginTop: 2,
  },
  alarmIcon: { fontSize: 13 },
  alarmText: { color: '#d1b8bc', fontSize: 10, flex: 1 },
  autoWakeBadge: { backgroundColor: '#381619', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  autoWakeText: { color: Colors.primary, fontSize: 9, fontWeight: '800' },

  // CATALOG HEADER
  catalogHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  catalogTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catalogIcon: { fontSize: 13 },
  catalogTitle: { color: Colors.onSurface, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  activeCountChip: { backgroundColor: '#381619', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  activeCountText: { color: Colors.primary, fontSize: 9, fontWeight: '800' },
  multiSelectHint: { color: Colors.onSurfaceVariant, fontSize: 10, fontStyle: 'italic', marginLeft: 'auto' },

  // OPTIONS LIST
  optionsList: { gap: 10 },
  optionCard: {
    backgroundColor: '#17131a', borderRadius: 12, padding: 12, gap: 8,
    borderWidth: 1, borderColor: '#2c2230',
  },
  optionCardChecked: { borderColor: Colors.secondaryContainer, backgroundColor: '#1d1724' },

  optionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checkboxTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkboxBox: {
    width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#4a3b52',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#120e14',
  },
  checkboxBoxChecked: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  checkboxCheckMark: { color: '#000000', fontSize: 11, fontWeight: '900' },

  optionCode: { color: Colors.onSurface, fontSize: 11, fontWeight: '800' },
  tagBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagBadgeText: { fontSize: 9, fontWeight: '800' },
  timingText: { color: Colors.onSurfaceVariant, fontSize: 10 },

  optionTitle: { color: Colors.onSurface, fontSize: 13, fontWeight: '800' },
  optionDesc: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  featureBadge: { backgroundColor: '#261c2b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  featureBadgeText: { color: Colors.onSurface, fontSize: 10, fontWeight: '700' },

  // QUEUE PREVIEW CARD
  queuePreviewCard: {
    backgroundColor: '#141017', borderRadius: 12, padding: 12, gap: 8,
    borderWidth: 1, borderColor: '#2c2230', marginTop: 4,
  },
  queueHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  queueTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  queueIcon: { fontSize: 14, color: Colors.tertiary },
  queueTitle: { color: Colors.onSurface, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, flex: 1 },
  queueContribCount: { color: Colors.tertiary, fontSize: 9, fontWeight: '800' },

  queueRowsList: { gap: 6 },
  queueRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1b1520', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
  },
  queueStepName: { color: Colors.onSurface, fontSize: 11 },
  queueEffectPlus: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  queueEffectLock: { color: Colors.error, fontSize: 10, fontWeight: '700' },
  queueEffectVote: { color: Colors.tertiary, fontSize: 10, fontWeight: '700' },

  // FOOTER DOCK
  footerDock: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#141017F2', paddingHorizontal: 12, paddingVertical: 10, gap: 8,
    borderTopWidth: 1, borderTopColor: '#281c26',
  },
  confirmCtaBtn: {
    height: 48, borderRadius: 12, backgroundColor: '#c1272d',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: '#ff4d4d',
    shadowColor: '#ff4d4d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  confirmCtaIcon: { fontSize: 16 },
  confirmCtaText: { color: '#ffffff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  subActionButtonsRow: { flexDirection: 'row', gap: 8 },
  resetBtn: {
    flex: 1, height: 38, borderRadius: 8, backgroundColor: '#201824',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: '#332738',
  },
  resetBtnIcon: { fontSize: 12 },
  resetBtnText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '800' },

  randomBtn: {
    flex: 1, height: 38, borderRadius: 8, backgroundColor: '#201824',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: '#332738',
  },
  randomBtnIcon: { fontSize: 12 },
  randomBtnText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '800' },
});
