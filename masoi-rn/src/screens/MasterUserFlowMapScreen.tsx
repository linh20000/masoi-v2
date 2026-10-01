import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';

interface FlowNode {
  id: string;
  name: string;
  screenKey: string;
  category: 'Trang Chủ & Sảnh' | 'Vòng Lặp Đêm' | 'Vòng Lặp Ngày' | 'Báo Cáo & Catalog';
  desc: string;
  icon: string;
}

const FLOW_NODES: FlowNode[] = [
  { id: '1', name: 'Màn Khởi Động (Splash)', screenKey: 'Splash', category: 'Trang Chủ & Sảnh', desc: 'Logo Ma Sói, hiệu ứng Sigil trăng máu & tải tài nguyên', icon: '🌌' },
  { id: '2', name: 'Trang Chủ (Home)', screenKey: 'Home', category: 'Trang Chủ & Sảnh', desc: 'Sảnh chờ công khai, vào trận nhanh, chế độ kịch bản', icon: '🏰' },
  { id: '3', name: 'Phòng Chờ (Lobby)', screenKey: 'Lobby', category: 'Trang Chủ & Sảnh', desc: 'Sảnh 12 ghế, cấu hình vai trò & sẵn sàng', icon: '🚪' },
  { id: '4', name: 'Lật Vai Tùy Chọn (Role Reveal)', screenKey: 'RoleReveal', category: 'Trang Chủ & Sảnh', desc: 'Nhận lá bài Tarot bí mật & xác nhận đọc kỹ năng', icon: '🃏' },
  { id: '5', name: 'Làng Say Ngủ (Sleep Isolation)', screenKey: 'SleepMute', category: 'Vòng Lặp Đêm', desc: 'Cách ly âm thanh, tai nghe cõi mộng & thì thầm', icon: '🌙' },
  { id: '6', name: 'Ban Đêm Bàn Đá (Night Phase)', screenKey: 'NightPhase', category: 'Vòng Lặp Đêm', desc: 'Thao tác Tiên Tri soi bài & trận ma quái 12 ghế', icon: '👁️' },
  { id: '7', name: 'Phe Sói Đêm Săn (Werewolf Turn)', screenKey: 'WerewolfTurn', category: 'Vòng Lặp Đêm', desc: 'Hội ý cắn mồi nội bộ bầy Sói & chat bí mật', icon: '🐺' },
  { id: '8', name: 'Trật Tự Thức Giấc (Wakeup Sequence)', screenKey: 'WakeUpSequence', category: 'Vòng Lặp Đêm', desc: 'Hàng đợi gọi thức từng vai trò ban đêm', icon: '📜' },
  { id: '9', name: 'Chuyển Cảnh Bình Minh (Day Loading)', screenKey: 'DayPhaseTransition', category: 'Vòng Lặp Ngày', desc: 'Hiệu ứng hừng đông nứt sương ban ngày', icon: '🌅' },
  { id: '10', name: 'Bình Minh Thảo Luận (Day Phase)', screenKey: 'DayPhase', category: 'Vòng Lặp Ngày', desc: 'Công bố tử nạn, phát biểu giơ tay & thảo luận', icon: '💬' },
  { id: '11', name: 'Bỏ Phiếu Treo Cổ (Voting Phase)', screenKey: 'VotingPhase', category: 'Vòng Lặp Ngày', desc: 'Khóa phiếu, tình nghi số 1 & nghi thức hành quyết', icon: '⚖️' },
  { id: '12', name: 'Kết Quả Trận Đấu (Game Over)', screenKey: 'GameOver', category: 'Báo Cáo & Catalog', desc: 'Vinh danh chiến thắng, chỉ số MVP & danh hiệu', icon: '🏆' },
  { id: '13', name: 'Biên Niên Sử Replay (Timeline)', screenKey: 'TimelineReplay', category: 'Báo Cáo & Catalog', desc: 'Dòng thời gian sự kiện & phát lại Replay', icon: '📖' },
  { id: '14', name: 'Bách Khoa Vai Trò (Role Catalog)', screenKey: 'RoleCatalog', category: 'Báo Cáo & Catalog', desc: '32 Vai trò & máy trạng thái', icon: '📚' },
  { id: '15', name: 'Biến Thể Huyết Nguyệt (Modifiers)', screenKey: 'BloodMoonModifiers', category: 'Báo Cáo & Catalog', desc: 'Luật chơi nâng cao & event queue', icon: '🌕' },
];

export default function MasterUserFlowMapScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🗺️ BẢN ĐỒ LUỒNG GIAO DIỆN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>KIẾN TRÚC GIAO DIỆN MASTER</Text>
          <Text style={styles.bannerTitle}>Luồng Trải Nghiệm Người Dùng</Text>
          <Text style={styles.bannerSub}>
            Tất cả 15 màn hình & quy trình nghiệp vụ đã được xây dựng hoàn chỉnh và sẵn sàng kết nối.
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {FLOW_NODES.map((node) => (
            <TouchableOpacity
              key={node.id}
              style={styles.nodeCard}
              onPress={() => onNavigate && onNavigate(node.screenKey)}
              activeOpacity={0.8}
            >
              <View style={styles.nodeHeader}>
                <View style={styles.nodeIconBox}>
                  <Text style={{ fontSize: 18 }}>{node.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nodeCategory}>{node.category}</Text>
                  <Text style={styles.nodeName}>{node.name}</Text>
                </View>
                <Text style={styles.arrowIcon}>→</Text>
              </View>

              <Text style={styles.nodeDesc}>{node.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: { color: Colors.tertiary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14 },

  banner: {
    backgroundColor: `${Colors.secondaryContainer}30`, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: `${Colors.secondary}40`, gap: 4,
  },
  bannerTag: { color: Colors.secondary, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: Colors.onSurface, fontSize: 16, fontWeight: '700' },
  bannerSub: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  gridContainer: { gap: 10 },
  nodeCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 12, gap: 6,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  nodeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nodeIconBox: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  nodeCategory: { color: Colors.tertiary, fontSize: 9, fontWeight: '700' },
  nodeName: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  arrowIcon: { color: Colors.secondary, fontSize: 16, fontWeight: '700' },
  nodeDesc: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 15 },
});
