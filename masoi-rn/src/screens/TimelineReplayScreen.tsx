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
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';

interface TimelineEvent {
  id: string;
  phase: string;
  time: string;
  title: string;
  desc: string;
  type: 'night' | 'day' | 'death' | 'divination' | 'vote';
  seatNum?: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '1', phase: 'ĐÊM 1', time: '00:10',
    title: 'Tiên Tri Thực Hiện Soi Căn Cước',
    desc: 'Tiên Tri (Ghế VII) soi Ghế IV (Thợ Săn Bạc) — Kết quả: PHE DÂN LÀNG.',
    type: 'divination', seatNum: 'IV',
  },
  {
    id: '2', phase: 'ĐÊM 1', time: '00:35',
    title: 'Phe Ma Sói Hội Ý & Hạ Sát',
    desc: 'Bánh Mì (Ghế V) bị Ma Sói cắn tử nạn trong đêm lạnh.',
    type: 'death', seatNum: 'V',
  },
  {
    id: '3', phase: 'NGÀY 1', time: '01:15',
    title: 'Bình Minh Lạnh Giá — Công Bố Tử Nạn',
    desc: 'Dân làng phát hiện xác Bánh Mì. Phiên thảo luận khởi tranh.',
    type: 'day',
  },
  {
    id: '4', phase: 'NGÀY 1', time: '02:40',
    title: 'Hành Quyết Bằng Giàn Treo',
    desc: 'Bá Tước (Ghế X) bị nhận 5/11 phiếu tình nghi và bị treo cổ. Vai trò lộ diện: MA SÓI THƯỜNG.',
    type: 'vote', seatNum: 'X',
  },
  {
    id: '5', phase: 'ĐÊM 2', time: '03:10',
    title: 'Bảo Kê Bảo Vệ Mục Tiêu',
    desc: 'Bảo Kê đặt khiên bảo vệ Ghế VII (Tiên Tri) thành công.',
    type: 'night', seatNum: 'VII',
  },
];

export default function TimelineReplayScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [activeSpeed, setActiveSpeed] = useState<'1x' | '2x' | '4x'>('1x');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 BIÊN NIÊN SỬ TRẬN ĐẤU</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ fontSize: 16 }}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Match Summary HUD */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.matchCode}>TRẬN #8921 • KHU VỰC HẮC TÙNG</Text>
          <Text style={styles.matchOutcome}>KẾT QUẢ: PHE DÂN LÀNG THẮNG</Text>
          <Text style={styles.matchDuration}>Thời lượng: 14 phút 25 giây • 12 Người chơi</Text>
        </View>

        <View style={styles.speedControls}>
          {(['1x', '2x', '4x'] as const).map((spd) => (
            <TouchableOpacity
              key={spd}
              style={[styles.speedBtn, activeSpeed === spd && styles.speedBtnActive]}
              onPress={() => setActiveSpeed(spd)}
            >
              <Text style={[styles.speedText, activeSpeed === spd && styles.speedTextActive]}>{spd}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Timeline Stream */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {TIMELINE_EVENTS.map((evt, idx) => (
          <View key={evt.id} style={styles.eventRow}>
            {/* Left Timeline Bar & Dot */}
            <View style={styles.timelineCol}>
              <View style={[
                styles.eventDot,
                evt.type === 'death' && styles.dotDeath,
                evt.type === 'divination' && styles.dotDivination,
                evt.type === 'vote' && styles.dotVote,
              ]} />
              {idx < TIMELINE_EVENTS.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* Event Content Card */}
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={styles.phaseTag}>
                  <Text style={styles.phaseTagText}>{evt.phase}</Text>
                </View>
                <Text style={styles.eventTime}>{evt.time}</Text>
              </View>

              <Text style={styles.eventTitle}>{evt.title}</Text>
              <Text style={styles.eventDesc}>{evt.desc}</Text>

              {evt.seatNum && (
                <View style={styles.playerMetaRow}>
                  <Image
                    source={{ uri: SEAT_AVATAR_IMAGES[evt.seatNum] }}
                    style={styles.playerMetaAvatar}
                    resizeMode="cover"
                  />
                  <Text style={styles.playerMetaText}>Nhân vật liên quan: Ghế {evt.seatNum}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Replay Player Controls Bar */}
      <View style={styles.playerBar}>
        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          <Text style={styles.playPauseText}>{isPlaying ? 'Tạm Dừng Replay' : 'Phát Replay Trận Đấu'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryNavBtn} onPress={() => onNavigate && onNavigate('GameOver')}>
          <Text style={styles.secondaryNavText}>🏆 Bảng Tổng Kết</Text>
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
  headerTitle: { color: Colors.primary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  shareBtn: {},

  summaryCard: {
    margin: Spacing.marginMobile, padding: 12, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh,
  },
  summaryLeft: { flex: 1 },
  matchCode: { color: Colors.outline, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  matchOutcome: { color: Colors.tertiary, fontSize: 13, fontWeight: '700', marginTop: 2 },
  matchDuration: { color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },
  speedControls: { flexDirection: 'row', gap: 4 },
  speedBtn: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: Colors.surfaceContainerHigh,
  },
  speedBtnActive: { backgroundColor: Colors.tertiaryContainer },
  speedText: { color: Colors.onSurfaceVariant, fontSize: 10, fontWeight: '700' },
  speedTextActive: { color: Colors.tertiary },

  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.marginMobile, paddingBottom: 20 },

  eventRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  timelineCol: { alignItems: 'center', width: 20 },
  eventDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.tertiary, marginTop: 4,
  },
  dotDeath: { backgroundColor: Colors.primary },
  dotDivination: { backgroundColor: Colors.secondary },
  dotVote: { backgroundColor: Colors.tertiary },
  timelineLine: { flex: 1, width: 2, backgroundColor: `${Colors.outline}33`, marginTop: 4 },

  eventCard: {
    flex: 1, backgroundColor: Colors.surfaceContainer, borderRadius: 10, padding: 12, gap: 6,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  phaseTag: {
    backgroundColor: Colors.surfaceContainerHighest, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  phaseTagText: { color: Colors.secondary, fontSize: 9, fontWeight: '700' },
  eventTime: { color: Colors.outline, fontSize: 10, fontWeight: '700' },
  eventTitle: { color: Colors.onSurface, fontSize: 12, fontWeight: '700' },
  eventDesc: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  playerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  playerMetaAvatar: { width: 20, height: 20, borderRadius: 10 },
  playerMetaText: { color: Colors.tertiary, fontSize: 10, fontWeight: '600' },

  playerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  playPauseBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryContainer, height: 44, borderRadius: 10,
  },
  playPauseIcon: { fontSize: 16, color: Colors.onPrimaryContainer },
  playPauseText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700' },
  secondaryNavBtn: {
    paddingHorizontal: 14, height: 44, borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center',
  },
  secondaryNavText: { color: Colors.onSurface, fontSize: 11, fontWeight: '600' },
});
