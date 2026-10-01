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
import { Colors, Spacing } from '../theme/colors';

interface QueueItem {
  order: number;
  role: string;
  action: string;
  timeSec: number;
  isCompleted: boolean;
}

const QUEUE_ITEMS: QueueItem[] = [
  { order: 1, role: 'Tiên Tri', action: 'Soi Thân Phận', timeSec: 20, isCompleted: true },
  { order: 2, role: 'Bảo Kê', action: 'Chọn Mục Tiêu Bảo Vệ', timeSec: 15, isCompleted: true },
  { order: 3, role: 'Phe Ma Sói', action: 'Hội Ý & Cắn Nạn Nhân', timeSec: 30, isCompleted: true },
  { order: 4, role: 'Phù Thủy', action: 'Dùng Bình Thuốc Cứu / Độc', timeSec: 20, isCompleted: false },
  { order: 5, role: 'Thợ Săn', action: 'Gài Mũi Tên Tàn Tội', timeSec: 10, isCompleted: false },
];

export default function NightQueueSchedulerScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⏱️ HÀNG ĐỜI BAN ĐÊM SCHEDULER</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>HỆ THỐNG ĐIỀU PHỐI ĐÊM</Text>
          <Text style={styles.bannerTitle}>Bộ Lập Lịch Quản Trò Tự Động</Text>
          <Text style={styles.bannerSub}>Tự động tính toán thời gian chờ tối ưu cho từng vai trò mà không làm lộ vai trò ngầm trong phòng.</Text>
        </View>

        <View style={styles.queueList}>
          {QUEUE_ITEMS.map((item) => (
            <View key={item.order} style={[styles.queueCard, item.isCompleted && styles.queueCardDone]}>
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>#{item.order}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.roleTitle}>{item.role}</Text>
                <Text style={styles.actionTitle}>{item.action}</Text>
              </View>

              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{item.timeSec}s</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.backNightBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.backNightText}>🌙 Quay Về Màn Đêm</Text>
        </TouchableOpacity>
      </View>
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
  bannerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  queueList: { gap: 10 },
  queueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  queueCardDone: { opacity: 0.6 },
  orderBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  orderText: { color: Colors.onPrimaryContainer, fontSize: 11, fontWeight: '700' },

  roleTitle: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  actionTitle: { color: Colors.secondary, fontSize: 11 },
  timeBadge: { backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeText: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  backNightBtn: {
    width: '100%', height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  backNightText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700' },
});
