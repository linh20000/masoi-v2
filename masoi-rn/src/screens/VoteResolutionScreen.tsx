import React from 'react';
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
import { Colors, Spacing } from '../theme/colors';
import { SEAT_AVATAR_IMAGES } from '../theme/images';
import { mockServer } from '../engine/mockStepCallServer';

export default function VoteResolutionScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚖️ PHÂN QUYẾT BỎ PHIẾU</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.verdictCard}>
          <Text style={styles.verdictTag}>KẾT QUẢ BIỂU QUYẾT NGÀY 1</Text>
          <Text style={styles.verdictTitle}>BÁ TƯỚC BỊ THI HÀNH ÁN</Text>
          <Text style={styles.verdictSub}>Tổng cộng 5/11 phiếu thuận đưa Bá Tước lên giàn treo cổ</Text>

          <View style={styles.suspectBox}>
            <Image source={{ uri: SEAT_AVATAR_IMAGES.X }} style={styles.suspectAvatar} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.suspectName}>Ghế X — BáTước</Text>
              <Text style={styles.suspectRole}>Lộ diện: MA SÓI THƯỜNG (Phe Ma Sói)</Text>
            </View>
          </View>
        </View>

        {/* Votes Breakdown List */}
        <View style={styles.votesBreakdownCard}>
          <Text style={styles.votesTitle}>📊 CHI TIẾT CÁC PHIẾU BẦU</Text>
          <View style={styles.voteRow}>
            <Text style={styles.voteVoter}>Ghế VII (Tiên Tri):</Text>
            <Text style={styles.voteTarget}>Đã bầu cho Ghế X (BáTước)</Text>
          </View>
          <View style={styles.voteRow}>
            <Text style={styles.voteVoter}>Ghế I (Trưởng Làng):</Text>
            <Text style={styles.voteTarget}>Đã bầu cho Ghế X (BáTước)</Text>
          </View>
          <View style={styles.voteRow}>
            <Text style={styles.voteVoter}>Ghế IV (Thợ Săn):</Text>
            <Text style={styles.voteTarget}>Đã bầu cho Ghế I (Trưởng Làng)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={[styles.footerBar, { flexDirection: 'column', height: 110, gap: 8, paddingVertical: 10 }]}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            mockServer.startNextNightPhase();
            if (onNavigate) onNavigate('NightPhase');
          }}
        >
          <Text style={styles.nextBtnText}>🌙 QUẢN TRÒ: BẮT ĐẦU ĐÊM MỚI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: '#282a2d' }]}
          onPress={() => onNavigate && onNavigate('GameOver')}
        >
          <Text style={[styles.nextBtnText, { color: Colors.onSurfaceVariant }]}>🏆 KẾT THÚC VÁN ĐẤU (XEM KẾT QUẢ)</Text>
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

  mainScroll: { flex: 1 },
  scrollContent: { padding: Spacing.marginMobile, gap: 14 },

  verdictCard: {
    backgroundColor: `${Colors.primaryContainer}40`, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.primaryContainer, gap: 6,
  },
  verdictTag: { color: Colors.primary, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  verdictTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  verdictSub: { color: Colors.onSurfaceVariant, fontSize: 11 },

  suspectBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainer, padding: 10, borderRadius: 8, marginTop: 4,
  },
  suspectAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.primary },
  suspectName: { color: Colors.onSurface, fontSize: 13, fontWeight: '700' },
  suspectRole: { color: Colors.primary, fontSize: 11, fontWeight: '600', marginTop: 2 },

  votesBreakdownCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, gap: 8,
  },
  votesTitle: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },
  voteRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  voteVoter: { color: Colors.onSurface, fontSize: 11, fontWeight: '600' },
  voteTarget: { color: Colors.secondary, fontSize: 11 },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  nextBtn: {
    width: '100%', height: 44, backgroundColor: Colors.tertiaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  nextBtnText: { color: Colors.tertiary, fontSize: 13, fontWeight: '700' },
});
