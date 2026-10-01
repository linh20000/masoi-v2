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
import { Colors, Spacing } from '../theme/colors';
import { ROLE_CARD_IMAGES, SEAT_AVATAR_IMAGES } from '../theme/images';

export default function PrivateVoiceWakeUpScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [isMicActive, setIsMicActive] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate('Home')}>
          <Text style={styles.backBtnText}>‹ Trang Chủ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎙️ KÊNH THOẠI RIÊNG TƯ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
        {/* Role Hero Card */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: ROLE_CARD_IMAGES.seer }}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeText}>🔒 KÊNH THOẠI MẬT</Text>
            </View>
            <Text style={styles.heroTitle}>BẠN ĐÃ ĐƯỢC GỌI THỨC GIẤC</Text>
            <Text style={styles.heroRoleName}>Tiên Tri (Mắt Thần)</Text>
          </View>
        </View>

        {/* Live Audio Status Card */}
        <View style={styles.audioCard}>
          <View style={styles.audioHeader}>
            <Text style={styles.audioTitle}>🔊 TRẠNG THÁI ÂM THANH NỘI BỘ</Text>
            <Text style={styles.audioStatusTag}>ĐANG HOẠT ĐỘNG</Text>
          </View>
          <Text style={styles.audioDesc}>
            Chỉ những người cùng vai trò hoặc Quản trò mới nghe được giọng nói của bạn. Người đang ngủ tuyệt đối bị cách ly.
          </Text>

          <View style={styles.speakerRow}>
            <Image source={{ uri: SEAT_AVATAR_IMAGES.VII }} style={styles.speakerAvatar} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.speakerName}>Bạn (Tiên Tri - Ghế VII)</Text>
              <Text style={styles.speakerText}>Đang phát biểu thoại bảo mật...</Text>
            </View>
            <TouchableOpacity
              style={[styles.micBtn, isMicActive && styles.micBtnActive]}
              onPress={() => setIsMicActive(!isMicActive)}
            >
              <Text style={{ fontSize: 16 }}>{isMicActive ? '🎙️' : '🔇'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => onNavigate && onNavigate('NightPhase')}>
          <Text style={styles.confirmBtnText}>👁️ Thực Hiện Hành Động Ban Đêm</Text>
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

  heroCard: {
    height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative',
    borderWidth: 1, borderColor: Colors.secondary,
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 16, justifyContent: 'flex-end', gap: 4,
  },
  privateBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  privateBadgeText: { color: Colors.onSecondaryContainer, fontSize: 9, fontWeight: '700' },
  heroTitle: { color: Colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  heroRoleName: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },

  audioCard: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, gap: 10,
    borderWidth: 1, borderColor: `${Colors.outline}26`,
  },
  audioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  audioTitle: { color: Colors.tertiary, fontSize: 11, fontWeight: '700' },
  audioStatusTag: { color: Colors.secondary, fontSize: 9, fontWeight: '700' },
  audioDesc: { color: Colors.onSurfaceVariant, fontSize: 11, lineHeight: 16 },

  speakerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainer, padding: 10, borderRadius: 8,
  },
  speakerAvatar: { width: 36, height: 36, borderRadius: 18 },
  speakerName: { color: Colors.onSurface, fontSize: 12, fontWeight: '700' },
  speakerText: { color: Colors.secondary, fontSize: 10 },
  micBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: Colors.tertiaryContainer },

  footerBar: {
    height: 64, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: `${Colors.outline}33`,
  },
  confirmBtn: {
    width: '100%', height: 44, backgroundColor: Colors.primaryContainer, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  confirmBtnText: { color: Colors.onPrimaryContainer, fontSize: 13, fontWeight: '700' },
});
